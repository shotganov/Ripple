import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreatePostDto } from './dto/create-post.dto';
import * as fs from 'fs/promises';
import { join } from 'path';
import { avatarUrl, postImageUrl } from 'src/shared/paths';
import {
  METRIC_LIKES,
  METRIC_POSTS_CREATED,
} from '../metrics/metrics.module';

const postUserSelect = {
  id: true,
  username: true,
  tag: true,
  avatar: true,
} as const;

const postCountSelect = {
  likes: true,
  comments: true,
} as const;

type PostWithRelations = {
  id: number;
  userId: number;
  content: string;
  images: string[];
  createdAt: Date;
  user: { id: number; username: string; tag: string; avatar: string | null };
  _count: { likes: number; comments: number };
  likes: { userId: number }[];
};

const postInclude = (currentUserId: number) => ({
  user: { select: postUserSelect },
  _count: { select: postCountSelect },
  likes: {
    where: { userId: currentUserId },
    select: { userId: true },
    take: 1,
  },
});

const formatPost = (post: PostWithRelations) => ({
  id: post.id,
  content: post.content,
  images: post.images.map(postImageUrl),
  createdAt: post.createdAt,
  likes: post._count.likes,
  comments: post._count.comments,
  isLiked: post.likes.length > 0,
  user: {
    id: post.user.id,
    username: post.user.username,
    tag: post.user.tag,
    avatar: avatarUrl(post.user.avatar),
  },
});

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    @InjectMetric(METRIC_POSTS_CREATED) private postsCreated: Counter<string>,
    @InjectMetric(METRIC_LIKES) private likesCounter: Counter<string>,
  ) {}

  async getAllPosts(currentUserId: number, cursor?: number, limit = 20) {
    return this.paginate(
      { userId: { not: currentUserId } },
      currentUserId,
      cursor,
      limit,
    );
  }

  async getUserPosts(
    userId: number,
    currentUserId: number,
    cursor?: number,
    limit = 20,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.paginate({ userId }, currentUserId, cursor, limit);
  }

  private async paginate(
    where: object,
    currentUserId: number,
    cursor: number | undefined,
    limit: number,
  ) {
    const take = Math.min(Math.max(limit, 1), 50);

    const posts = await this.prisma.post.findMany({
      where,
      include: postInclude(currentUserId),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take,
      ...(cursor
        ? { cursor: { id: cursor }, skip: 1 }
        : {}),
    });

    const items = posts.map(formatPost);
    const nextCursor =
      posts.length === take ? posts[posts.length - 1].id : null;

    return { items, nextCursor };
  }

  async createPost(
    userId: number,
    data: CreatePostDto,
    files: Express.Multer.File[],
  ) {
    const imagePaths = files?.map((file) => file.filename) || [];
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = await this.prisma.post.create({
      data: {
        userId,
        content: data.content,
        images: imagePaths,
      },
      include: postInclude(userId),
    });

    this.postsCreated.inc();
    return formatPost(post);
  }

  async getPost(postId: number, currentUserId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: postInclude(currentUserId),
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return formatPost(post);
  }

  async deletePost(
    postId: number,
    userId: number,
    role: 'USER' | 'ADMIN' = 'USER',
  ) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('You can delete only your own posts');
    }

    await this.prisma.post.delete({ where: { id: postId } });

    await Promise.all(
      post.images.map((name) =>
        fs
          .unlink(join(process.cwd(), 'public', 'posts', name))
          .catch(() => undefined),
      ),
    );

    return null;
  }

  async likePost(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const result = await this.prisma.like.upsert({
      where: { postId_userId: { postId, userId } },
      update: {},
      create: { postId, userId },
    });
    // upsert не различает create/update — увеличиваем только если строка только что появилась
    // (createdAt в пределах последней секунды)
    if (Date.now() - result.createdAt.getTime() < 1000) {
      this.likesCounter.inc();
    }

    await this.notifications.create({
      recipientId: post.userId,
      actorId: userId,
      type: NotificationType.LIKE,
      postId,
    });

    return this.getLikeState(postId, userId);
  }

  async unlikePost(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    await this.prisma.like.deleteMany({ where: { postId, userId } });

    if (post) {
      await this.notifications.removeLike(post.userId, userId, postId);
    }

    return this.getLikeState(postId, userId);
  }

  private async getLikeState(postId: number, userId: number) {
    const [count, mine] = await Promise.all([
      this.prisma.like.count({ where: { postId } }),
      this.prisma.like.findUnique({
        where: { postId_userId: { postId, userId } },
        select: { userId: true },
      }),
    ]);
    return { likes: count, isLiked: !!mine };
  }

  async getFeed(userId: number, cursor?: number, limit = 20) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const follows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = follows.map((follow) => follow.followingId);

    if (followingIds.length === 0) {
      return { items: [], nextCursor: null };
    }

    return this.paginate(
      { userId: { in: followingIds } },
      userId,
      cursor,
      limit,
    );
  }
}
