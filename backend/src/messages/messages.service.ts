import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { PrismaService } from '../prisma/prisma.service';
import { ChatsService } from '../chats/chats.service';
import { MessagesGateway } from './messages.gateway';
import { SendMessageDto } from './dto/send-message.dto';
import { METRIC_MESSAGES_SENT } from '../metrics/metrics.module';

const formatMessage = (m: {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  isRead: boolean;
  createdAt: Date;
}) => ({
  id: m.id,
  chatId: m.chatId,
  senderId: m.senderId,
  content: m.content,
  isRead: m.isRead,
  createdAt: m.createdAt,
});

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private chats: ChatsService,
    private gateway: MessagesGateway,
    @InjectMetric(METRIC_MESSAGES_SENT) private messagesSent: Counter<string>,
  ) {}

  async list(userId: number, chatId: number, before?: number, limit = 30) {
    await this.chats.assertMember(userId, chatId);
    const take = Math.min(Math.max(limit, 1), 100);

    const messages = await this.prisma.message.findMany({
      where: {
        chatId,
        ...(before ? { id: { lt: before } } : {}),
      },
      orderBy: { id: 'desc' },
      take,
    });

    const items = messages.reverse().map(formatMessage);
    const nextCursor =
      messages.length === take && items.length > 0 ? items[0].id : null;

    return { items, nextCursor };
  }

  async send(userId: number, dto: SendMessageDto) {
    const content = dto.content.trim();
    if (!content) {
      throw new BadRequestException('content is required');
    }
    if (!dto.chatId && !dto.peerId) {
      throw new BadRequestException('chatId or peerId is required');
    }

    let chatId: number;
    let recipientId: number;
    if (dto.chatId) {
      const chat = await this.chats.assertMember(userId, dto.chatId);
      chatId = dto.chatId;
      recipientId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
    } else {
      const chat = await this.chats.getOrCreate(userId, dto.peerId!);
      chatId = chat.id;
      recipientId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
    }

    const message = await this.prisma.message.create({
      data: { chatId, senderId: userId, content },
    });

    this.messagesSent.inc();
    const formatted = formatMessage(message);
    const payload = { chatId, message: formatted };

    this.gateway.emitToUser(recipientId, 'message:new', payload);
    this.gateway.emitToUser(userId, 'message:new', payload);

    return payload;
  }

  async markRead(userId: number, chatId: number) {
    const chat = await this.chats.assertMember(userId, chatId);
    await this.prisma.message.updateMany({
      where: { chatId, senderId: { not: userId }, isRead: false },
      data: { isRead: true },
    });

    const peerId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
    this.gateway.emitToUser(peerId, 'message:read', { chatId, readerId: userId });

    return { unreadCount: 0 };
  }

  async unreadTotal(userId: number) {
    const count = await this.prisma.message.count({
      where: {
        senderId: { not: userId },
        isRead: false,
        chat: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
      },
    });
    return { count };
  }
}
