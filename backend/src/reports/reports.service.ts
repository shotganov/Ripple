import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ReportStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { avatarUrl, postImageUrl } from '../shared/paths';

const actorSelect = {
  id: true,
  username: true,
  tag: true,
  avatar: true,
} as const;

interface PostRow {
  id: number;
  content: string;
  images: string[];
  createdAt: Date;
  _count: { likes: number; comments: number };
  user: { id: number; username: string; tag: string; avatar: string | null };
}

interface CommentRow {
  id: number;
  content: string;
  postId: number;
  createdAt: Date;
  user: { id: number; username: string; tag: string; avatar: string | null };
}

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
    offset = 0,
    limit = 20,
    status?: ReportStatus,
    archived?: boolean,
  ) {
    const take = Math.min(Math.max(limit, 1), 50);
    const skip = Math.max(offset, 0);

    const statusWhere: Prisma.ReportWhereInput = status
      ? { status }
      : archived
        ? { status: { not: ReportStatus.PENDING } }
        : { status: ReportStatus.PENDING };

    // Group by postId — aggregate pending reports per post
    const postGroups = await this.prisma.report.groupBy({
      by: ['postId'],
      where: { ...statusWhere, postId: { not: null } },
      _count: { id: true },
      _max: { createdAt: true },
      orderBy: { _max: { createdAt: 'desc' } },
    });

    // Group by commentId
    const commentGroups = await this.prisma.report.groupBy({
      by: ['commentId'],
      where: { ...statusWhere, commentId: { not: null } },
      _count: { id: true },
      _max: { createdAt: true },
      orderBy: { _max: { createdAt: 'desc' } },
    });

    // Merge and sort by latestReportAt desc
    type GroupEntry =
      | { type: 'post'; targetId: number; count: number; latestAt: Date }
      | { type: 'comment'; targetId: number; count: number; latestAt: Date };

    const merged: GroupEntry[] = [
      ...postGroups.map((g) => ({
        type: 'post' as const,
        targetId: g.postId!,
        count: g._count.id,
        latestAt: g._max.createdAt!,
      })),
      ...commentGroups.map((g) => ({
        type: 'comment' as const,
        targetId: g.commentId!,
        count: g._count.id,
        latestAt: g._max.createdAt!,
      })),
    ].sort((a, b) => b.latestAt.getTime() - a.latestAt.getTime());

    const page = merged.slice(skip, skip + take);
    const total = merged.length;

    // Fetch reasons and content for this page
    const postIds = page.filter((g) => g.type === 'post').map((g) => g.targetId);
    const commentIds = page.filter((g) => g.type === 'comment').map((g) => g.targetId);

    const postsData: PostRow[] = postIds.length
      ? await this.prisma.post.findMany({
          where: { id: { in: postIds } },
          select: {
            id: true,
            content: true,
            images: true,
            createdAt: true,
            _count: { select: { likes: true, comments: true } },
            user: { select: actorSelect },
          },
        })
      : [];

    const commentsData: CommentRow[] = commentIds.length
      ? await this.prisma.comment.findMany({
          where: { id: { in: commentIds } },
          select: {
            id: true,
            content: true,
            postId: true,
            createdAt: true,
            user: { select: actorSelect },
          },
        })
      : [];

    const reasonsByPost: { postId: number | null; reason: string }[] = postIds.length
      ? await this.prisma.report.findMany({
          where: { ...statusWhere, postId: { in: postIds } },
          select: { postId: true, reason: true },
          distinct: ['postId', 'reason'],
        })
      : [];

    const reasonsByComment: { commentId: number | null; reason: string }[] = commentIds.length
      ? await this.prisma.report.findMany({
          where: { ...statusWhere, commentId: { in: commentIds } },
          select: { commentId: true, reason: true },
          distinct: ['commentId', 'reason'],
        })
      : [];

    const postMap = new Map<number, PostRow>(postsData.map((p) => [p.id, p]));
    const commentMap = new Map<number, CommentRow>(commentsData.map((c) => [c.id, c]));

    const reasonsForPost = new Map<number, string[]>();
    for (const r of reasonsByPost) {
      if (!r.postId) continue;
      const arr = reasonsForPost.get(r.postId) ?? [];
      arr.push(r.reason);
      reasonsForPost.set(r.postId, arr);
    }

    const reasonsForComment = new Map<number, string[]>();
    for (const r of reasonsByComment) {
      if (!r.commentId) continue;
      const arr = reasonsForComment.get(r.commentId) ?? [];
      arr.push(r.reason);
      reasonsForComment.set(r.commentId, arr);
    }

    const items = page.map((g) => {
      if (g.type === 'post') {
        const post = postMap.get(g.targetId);
        return {
          type: 'post' as const,
          targetId: g.targetId,
          reportCount: g.count,
          latestReportAt: g.latestAt,
          reasons: reasonsForPost.get(g.targetId) ?? [],
          post: post
            ? {
                id: post.id,
                content: post.content,
                images: post.images.map(postImageUrl),
                createdAt: post.createdAt,
                likes: post._count.likes,
                comments: post._count.comments,
                user: { ...post.user, avatar: avatarUrl(post.user.avatar) },
              }
            : null,
        };
      } else {
        const comment = commentMap.get(g.targetId);
        return {
          type: 'comment' as const,
          targetId: g.targetId,
          reportCount: g.count,
          latestReportAt: g.latestAt,
          reasons: reasonsForComment.get(g.targetId) ?? [],
          comment: comment
            ? {
                id: comment.id,
                content: comment.content,
                postId: comment.postId,
                createdAt: comment.createdAt,
                user: {
                  ...comment.user,
                  avatar: avatarUrl(comment.user.avatar),
                },
              }
            : null,
        };
      }
    });

    return { items, total, offset: skip, limit: take };
  }

  async pendingCount(adminId: number) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      select: { reportsSeenAt: true },
    });
    const where = {
      status: ReportStatus.PENDING,
      ...(admin?.reportsSeenAt && { createdAt: { gt: admin.reportsSeenAt } }),
    };
    const groups = await this.prisma.report.groupBy({
      by: ['postId', 'commentId'],
      where,
    });
    return { count: groups.length };
  }

  async markSeen(adminId: number) {
    await this.prisma.user.update({
      where: { id: adminId },
      data: { reportsSeenAt: new Date() },
    });
    return { ok: true };
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

  async dismissByTarget(type: 'post' | 'comment', targetId: number) {
    if (type === 'post') {
      await this.prisma.report.updateMany({
        where: { postId: targetId, status: ReportStatus.PENDING },
        data: { status: ReportStatus.DISMISSED, resolvedAt: new Date() },
      });
    } else {
      await this.prisma.report.updateMany({
        where: { commentId: targetId, status: ReportStatus.PENDING },
        data: { status: ReportStatus.DISMISSED, resolvedAt: new Date() },
      });
    }
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
