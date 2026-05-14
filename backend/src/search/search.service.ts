import { Injectable, BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { avatarUrl, postImageUrl } from '../shared/paths';

type SearchType = 'users' | 'posts';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(
    query: string,
    type: SearchType,
    currentUserId: number,
    cursor?: number,
    limit = 20,
  ) {
    const term = query.trim();
    if (!term) {
      throw new BadRequestException('Search query is required');
    }
    const take = Math.min(Math.max(limit, 1), 50);

    if (type === 'users') {
      return this.searchUsers(term, cursor, take);
    }
    return this.searchPosts(term, currentUserId, cursor, take);
  }

  private async searchUsers(term: string, cursor: number | undefined, take: number) {
    const users = await this.prisma.user.findMany({
      where: {
        role: Role.USER,
        OR: [
          { username: { contains: term, mode: 'insensitive' } },
          { tag: { contains: term, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        tag: true,
        avatar: true,
        bio: true,
      },
      orderBy: { id: 'desc' },
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const items = users.map((u) => ({
      ...u,
      avatar: avatarUrl(u.avatar),
    }));

    const nextCursor =
      users.length === take ? users[users.length - 1].id : null;

    return { items, nextCursor };
  }

  private async searchPosts(
    term: string,
    currentUserId: number,
    cursor: number | undefined,
    take: number,
  ) {
    const posts = await this.prisma.post.findMany({
      where: {
        content: { contains: term, mode: 'insensitive' },
      },
      include: {
        user: {
          select: { id: true, username: true, tag: true, avatar: true },
        },
        _count: { select: { likes: true, comments: true } },
        likes: {
          where: { userId: currentUserId },
          select: { userId: true },
          take: 1,
        },
      },
      orderBy: { id: 'desc' },
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const items = posts.map((post) => ({
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
    }));

    const nextCursor =
      posts.length === take ? posts[posts.length - 1].id : null;

    return { items, nextCursor };
  }
}
