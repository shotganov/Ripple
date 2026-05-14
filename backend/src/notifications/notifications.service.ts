import { Injectable } from '@nestjs/common';
import { NotificationType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { avatarUrl, postImageUrl } from 'src/shared/paths';

type CreateNotificationInput = {
  recipientId: number;
  actorId: number;
  type: NotificationType;
  postId?: number;
  commentId?: number;
};

const actorSelect = {
  id: true,
  username: true,
  tag: true,
  avatar: true,
} as const;

const notificationInclude = {
  actor: { select: actorSelect },
  post: {
    select: {
      id: true,
      content: true,
      images: true,
    },
  },
  comment: {
    select: {
      id: true,
      content: true,
    },
  },
} as const;

type NotificationWithRelations = Prisma.NotificationGetPayload<{
  include: typeof notificationInclude;
}>;

const formatNotification = (n: NotificationWithRelations) => ({
  id: n.id,
  type: n.type,
  isRead: n.isRead,
  createdAt: n.createdAt,
  actor: {
    id: n.actor.id,
    username: n.actor.username,
    tag: n.actor.tag,
    avatar: avatarUrl(n.actor.avatar),
  },
  post: n.post
    ? {
        id: n.post.id,
        content: n.post.content,
        images: n.post.images.map(postImageUrl),
      }
    : null,
  comment: n.comment
    ? { id: n.comment.id, content: n.comment.content }
    : null,
});

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateNotificationInput) {
    if (input.recipientId === input.actorId) return null;

    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.notification.findFirst({
        where: {
          recipientId: input.recipientId,
          actorId: input.actorId,
          type: input.type,
          postId: input.postId ?? null,
          commentId: input.commentId ?? null,
        },
        select: { id: true },
      });

      if (existing) {
        await tx.notification.update({
          where: { id: existing.id },
          data: { isRead: false, createdAt: new Date() },
        });
      } else {
        await tx.notification.create({
          data: {
            recipientId: input.recipientId,
            actorId: input.actorId,
            type: input.type,
            postId: input.postId ?? null,
            commentId: input.commentId ?? null,
          },
        });
      }
    });

    return null;
  }

  async removeLike(recipientId: number, actorId: number, postId: number) {
    await this.prisma.notification.deleteMany({
      where: {
        recipientId,
        actorId,
        type: NotificationType.LIKE,
        postId,
      },
    });
  }

  async removeFollow(recipientId: number, actorId: number) {
    await this.prisma.notification.deleteMany({
      where: {
        recipientId,
        actorId,
        type: NotificationType.FOLLOW,
      },
    });
  }

  async list(userId: number, cursor?: number, limit = 20) {
    const take = Math.min(Math.max(limit, 1), 50);

    const rows = await this.prisma.notification.findMany({
      where: { recipientId: userId },
      include: notificationInclude,
      orderBy: { id: 'desc' },
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const items = rows.map(formatNotification);
    const nextCursor =
      rows.length === take ? rows[rows.length - 1].id : null;

    return { items, nextCursor };
  }

  async unreadCount(userId: number) {
    const count = await this.prisma.notification.count({
      where: { recipientId: userId, isRead: false },
    });

    return { count };
  }

  async markAllRead(userId: number) {
    await this.prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true },
    });

    return { count: 0 };
  }
}
