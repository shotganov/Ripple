import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FollowsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async followUser(currentUserId: number, targetUserId: number) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!target) {
      throw new NotFoundException('User to follow not found');
    }

    // upsert — повторный POST идемпотентен, без 409
    await this.prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
      update: {},
      create: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });

    await this.notifications.create({
      recipientId: targetUserId,
      actorId: currentUserId,
      type: NotificationType.FOLLOW,
    });

    return { isFollowing: true };
  }

  async unfollowUser(currentUserId: number, targetUserId: number) {
    await this.prisma.follow.deleteMany({
      where: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });

    await this.notifications.removeFollow(targetUserId, currentUserId);

    return { isFollowing: false };
  }

  async getFollowStatus(currentUserId: number, targetUserId: number) {
    if (currentUserId === targetUserId) {
      return { isFollowing: false };
    }

    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    return { isFollowing: !!follow };
  }

  async getFollowing(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const follows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            tag: true,
            avatar: true,
            bio: true,
          },
        },
      },
    });

    return follows.map((f) => ({
      id: f.following.id,
      username: f.following.username,
      tag: f.following.tag,
      avatar: f.following.avatar || '',
      bio: f.following.bio || '',
    }));
  }
}
