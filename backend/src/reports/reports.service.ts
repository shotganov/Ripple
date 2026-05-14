import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ReportStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { avatarUrl, postImageUrl } from '../shared/paths';

const reportActorSelect = {
  id: true,
  username: true,
  tag: true,
  avatar: true,
} as const;

const reportInclude = {
  reporter: { select: reportActorSelect },
  post: {
    select: {
      id: true,
      content: true,
      images: true,
      createdAt: true,
      _count: { select: { likes: true, comments: true } },
      user: { select: reportActorSelect },
    },
  },
  comment: {
    select: {
      id: true,
      content: true,
      postId: true,
      user: { select: reportActorSelect },
    },
  },
} as const;

type ReportWithRelations = Prisma.ReportGetPayload<{
  include: typeof reportInclude;
}>;

const formatReport = (r: ReportWithRelations) => ({
  id: r.id,
  reason: r.reason,
  status: r.status,
  createdAt: r.createdAt,
  resolvedAt: r.resolvedAt,
  reporter: {
    id: r.reporter.id,
    username: r.reporter.username,
    tag: r.reporter.tag,
    avatar: avatarUrl(r.reporter.avatar),
  },
  post: r.post
    ? {
        id: r.post.id,
        content: r.post.content,
        images: r.post.images.map(postImageUrl),
        createdAt: r.post.createdAt,
        likes: r.post._count.likes,
        comments: r.post._count.comments,
        user: {
          id: r.post.user.id,
          username: r.post.user.username,
          tag: r.post.user.tag,
          avatar: avatarUrl(r.post.user.avatar),
        },
      }
    : null,
  comment: r.comment
    ? {
        id: r.comment.id,
        content: r.comment.content,
        postId: r.comment.postId,
        user: {
          id: r.comment.user.id,
          username: r.comment.user.username,
          tag: r.comment.user.tag,
          avatar: avatarUrl(r.comment.user.avatar),
        },
      }
    : null,
});

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(reporterId: number, dto: CreateReportDto) {
    if ((!dto.postId && !dto.commentId) || (dto.postId && dto.commentId)) {
      throw new BadRequestException(
        'Either postId or commentId must be provided',
      );
    }

    if (dto.postId) {
      const post = await this.prisma.post.findUnique({
        where: { id: dto.postId },
        select: { id: true },
      });
      if (!post) throw new NotFoundException('Post not found');
    }
    if (dto.commentId) {
      const comment = await this.prisma.comment.findUnique({
        where: { id: dto.commentId },
        select: { id: true },
      });
      if (!comment) throw new NotFoundException('Comment not found');
    }

    try {
      await this.prisma.report.create({
        data: {
          reporterId,
          postId: dto.postId ?? null,
          commentId: dto.commentId ?? null,
          reason: dto.reason,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('You have already reported this');
      }
      throw error;
    }

    return null;
  }

  async list(
    cursor: number | undefined,
    limit = 20,
    status?: ReportStatus,
    archived?: boolean,
  ) {
    const take = Math.min(Math.max(limit, 1), 50);

    const where = status
      ? { status }
      : archived
        ? { status: { not: ReportStatus.PENDING } }
        : undefined;

    const rows = await this.prisma.report.findMany({
      where,
      include: reportInclude,
      orderBy: { id: 'desc' },
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const items = rows.map(formatReport);
    const nextCursor =
      rows.length === take ? rows[rows.length - 1].id : null;

    return { items, nextCursor };
  }

  async dismiss(reportId: number) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });
    if (!report) throw new NotFoundException('Report not found');
    if (report.status !== ReportStatus.PENDING) {
      throw new BadRequestException('Report is already resolved');
    }

    await this.prisma.report.update({
      where: { id: reportId },
      data: { status: ReportStatus.DISMISSED, resolvedAt: new Date() },
    });
    return null;
  }

  async resolveByPost(postId: number) {
    await this.prisma.report.updateMany({
      where: { postId, status: ReportStatus.PENDING },
      data: { status: ReportStatus.RESOLVED, resolvedAt: new Date() },
    });
  }

  async resolveByComment(commentId: number) {
    await this.prisma.report.updateMany({
      where: { commentId, status: ReportStatus.PENDING },
      data: { status: ReportStatus.RESOLVED, resolvedAt: new Date() },
    });
  }
}
