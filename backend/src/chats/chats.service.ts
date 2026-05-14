import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { avatarUrl } from 'src/shared/paths';

const companionSelect = {
  id: true,
  username: true,
  tag: true,
  avatar: true,
} as const;

const chatInclude = (userId: number) => ({
  user1: { select: companionSelect },
  user2: { select: companionSelect },
  messages: {
    take: 1,
    orderBy: { createdAt: 'desc' as const },
  },
  _count: {
    select: {
      messages: {
        where: { senderId: { not: userId }, isRead: false },
      },
    },
  },
});

type ChatWithRelations = Prisma.ChatGetPayload<{
  include: ReturnType<typeof chatInclude>;
}>;

const formatChat = (chat: ChatWithRelations, userId: number) => {
  const companion = chat.user1.id === userId ? chat.user2 : chat.user1;
  const last = chat.messages[0] ?? null;

  return {
    id: chat.id,
    companion: {
      id: companion.id,
      username: companion.username,
      tag: companion.tag,
      avatar: avatarUrl(companion.avatar),
    },
    lastMessage: last
      ? {
          id: last.id,
          content: last.content,
          createdAt: last.createdAt,
          senderId: last.senderId,
          isRead: last.isRead,
        }
      : null,
    unreadCount: chat._count.messages,
  };
};

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  private normalizePair(a: number, b: number): [number, number] {
    return a < b ? [a, b] : [b, a];
  }

  async list(userId: number, cursor?: number, limit = 20, search?: string) {
    const take = Math.min(Math.max(limit, 1), 50);
    const term = search?.trim();

    const companionFilter = term
      ? {
          OR: [
            { username: { contains: term, mode: 'insensitive' as const } },
            { tag: { contains: term, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const where = companionFilter
      ? {
          OR: [
            { user1Id: userId, user2: companionFilter },
            { user2Id: userId, user1: companionFilter },
          ],
        }
      : { OR: [{ user1Id: userId }, { user2Id: userId }] };

    const chats = await this.prisma.chat.findMany({
      where,
      include: chatInclude(userId),
    });

    const sorted = chats
      .filter((c) => c.messages.length > 0)
      .map((c) => formatChat(c, userId))
      .sort((a, b) => {
        const aTime = a.lastMessage?.createdAt.getTime() ?? 0;
        const bTime = b.lastMessage?.createdAt.getTime() ?? 0;
        return bTime - aTime;
      });

    const startIndex = cursor
      ? sorted.findIndex((c) => c.id === cursor) + 1
      : 0;
    const slice = sorted.slice(startIndex, startIndex + take);
    const nextCursor =
      startIndex + take < sorted.length ? slice[slice.length - 1].id : null;

    return { items: slice, nextCursor };
  }

  async findWithPeer(userId: number, peerId: number) {
    if (userId === peerId) return null;
    const [a, b] = this.normalizePair(userId, peerId);

    const chat = await this.prisma.chat.findUnique({
      where: { user1Id_user2Id: { user1Id: a, user2Id: b } },
      include: chatInclude(userId),
    });

    return chat ? formatChat(chat, userId) : null;
  }

  async assertMember(userId: number, chatId: number) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });
    if (!chat) throw new NotFoundException('Chat not found');
    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('Not a member of this chat');
    }
    return chat;
  }

  async getOrCreate(userId: number, peerId: number) {
    if (userId === peerId) {
      throw new BadRequestException('Cannot chat with yourself');
    }
    const peer = await this.prisma.user.findUnique({ where: { id: peerId } });
    if (!peer) throw new NotFoundException('Peer not found');

    const [a, b] = this.normalizePair(userId, peerId);

    return this.prisma.chat.upsert({
      where: { user1Id_user2Id: { user1Id: a, user2Id: b } },
      update: {},
      create: { user1Id: a, user2Id: b },
    });
  }
}
