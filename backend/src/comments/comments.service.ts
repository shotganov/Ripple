import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { avatarUrl } from 'src/shared/paths';
import { METRIC_COMMENTS_CREATED } from '../metrics/metrics.module';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    @InjectMetric(METRIC_COMMENTS_CREATED) private commentsCreated: Counter<string>,
  ) {}

  async getPostComments(postId: number, cursor?: number, limit = 20) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const take = Math.min(Math.max(limit, 1), 50);

    const comments = await this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            tag: true,
            avatar: true,
          },
        },
      },
      orderBy: { id: 'desc' },
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const items = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      user: { ...comment.user, avatar: avatarUrl(comment.user.avatar) },
    }));

    const nextCursor =
      comments.length === take ? comments[comments.length - 1].id : null;

    return { items, nextCursor };
  }

  async createComment(postId: number, userId: number, data: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!data.content || data.content.trim() === '') {
      throw new BadRequestException('Comment content is required');
    }

    const content = data.content.trim();

    const comment = await this.prisma.comment.create({
      data: {
        postId,
        userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            tag: true,
            avatar: true,
          },
        },
      },
    });

    this.commentsCreated.inc();

    await this.notifications.create({
      recipientId: post.userId,
      actorId: userId,
      type: NotificationType.COMMENT,
      postId,
      commentId: comment.id,
    });

    return {
      id: comment.id,
      content: comment.content,
      user: {
        id: comment.user.id,
        username: comment.user.username,
        tag: comment.user.tag,
        avatar: comment.user.avatar,
      },
      createdAt: comment.createdAt,
    };
  }

  async deleteComment(
    commentId: number,
    userId: number,
    role: 'USER' | 'ADMIN' = 'USER',
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('You can delete only your own comments');
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return { message: 'Comment deleted successfully' };
  }
}
