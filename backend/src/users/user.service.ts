import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs/promises';
import { join } from 'path';
import { Prisma, Role } from '@prisma/client';
import { avatarUrl, coverUrl } from '../shared/paths';

const publicUserSelect = {
  id: true,
  username: true,
  tag: true,
  avatar: true,
  coverImage: true,
  bio: true,
  role: true,
} as const;

type PublicUser = {
  id: number;
  username: string;
  tag: string;
  avatar: string | null;
  coverImage: string | null;
  bio: string | null;
};

const formatPublicUser = (user: PublicUser) => ({
  ...user,
  avatar: avatarUrl(user.avatar),
  coverImage: coverUrl(user.coverImage),
});

const USERNAME_MIN = 3;
const USERNAME_MAX = 50;
const BIO_MAX = 160;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: publicUserSelect,
    });
    return users.map(formatPublicUser);
  }

  async getSuggestions(currentUserId: number, limit = 5) {
    const following = await this.prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });
    const excludeIds = [currentUserId, ...following.map((f) => f.followingId)];

    const candidates = await this.prisma.user.findMany({
      where: { id: { notIn: excludeIds }, role: Role.USER },
      select: publicUserSelect,
    });

    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    return candidates.slice(0, limit).map(formatPublicUser);
  }

  async findOne(id: number) {
    const [user, followersCount, followingCount] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id },
        select: publicUserSelect,
      }),
      this.prisma.follow.count({ where: { followingId: id } }), // кто подписан на этого юзера
      this.prisma.follow.count({ where: { followerId: id } }), // на кого подписан этот юзер
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...formatPublicUser(user),
      followersCount,
      followingCount,
    };
  }

  async updateProfile(
    userId: number,
    dto: UpdateUserDto,
    files: {
      avatar?: Express.Multer.File;
      coverImage?: Express.Multer.File;
    },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const data: Prisma.UserUpdateInput = {};

    if (dto.username !== undefined) {
      const username = dto.username.trim();
      if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
        throw new BadRequestException(
          `Username must be ${USERNAME_MIN}..${USERNAME_MAX} characters`,
        );
      }
      data.username = username;
    }

    if (dto.tag !== undefined) {
      const tag = dto.tag.trim();
      if (tag !== user.tag) {
        const existing = await this.prisma.user.findUnique({ where: { tag } });
        if (existing) {
          throw new ConflictException('Этот тег уже занят');
        }
      }
      data.tag = tag;
    }

    if (dto.bio !== undefined) {
      const bio = dto.bio.trim();
      if (bio.length > BIO_MAX) {
        throw new BadRequestException(
          `Bio must not exceed ${BIO_MAX} characters`,
        );
      }
      data.bio = bio || null;
    }

    let oldAvatarToDelete: string | null = null;
    if (files.avatar) {
      data.avatar = files.avatar.filename;
      oldAvatarToDelete = user.avatar;
    }

    let oldCoverToDelete: string | null = null;
    if (files.coverImage) {
      data.coverImage = files.coverImage.filename;
      oldCoverToDelete = user.coverImage;
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: publicUserSelect,
    });

    if (oldAvatarToDelete) {
      void fs
        .unlink(join(process.cwd(), 'public', 'avatars', oldAvatarToDelete))
        .catch(() => undefined);
    }
    if (oldCoverToDelete) {
      void fs
        .unlink(join(process.cwd(), 'public', 'covers', oldCoverToDelete))
        .catch(() => undefined);
    }

    return {
      ...formatPublicUser(updated),
    };
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const postImages = await this.prisma.post.findMany({
      where: { userId: id },
      select: { images: true },
    });

    await this.prisma.user.delete({ where: { id } });

    const cleanups: Promise<unknown>[] = [];

    if (user.avatar) {
      cleanups.push(
        fs
          .unlink(join(process.cwd(), 'public', 'avatars', user.avatar))
          .catch(() => undefined),
      );
    }
    if (user.coverImage) {
      cleanups.push(
        fs
          .unlink(join(process.cwd(), 'public', 'covers', user.coverImage))
          .catch(() => undefined),
      );
    }
    for (const post of postImages) {
      for (const name of post.images) {
        cleanups.push(
          fs
            .unlink(join(process.cwd(), 'public', 'posts', name))
            .catch(() => undefined),
        );
      }
    }

    await Promise.all(cleanups);

    return { message: 'User deleted' };
  }
}
