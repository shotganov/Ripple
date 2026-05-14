import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ListMessagesQueryDto } from './dto/list-messages.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../auth/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Get('chats/:chatId/messages')
  list(
    @CurrentUser() user: CurrentUserPayload,
    @Param('chatId', ParseIntPipe) chatId: number,
    @Query() query: ListMessagesQueryDto,
  ) {
    return this.messages.list(user.userId, chatId, query.before, query.limit);
  }

  @Post('messages')
  @HttpCode(HttpStatus.CREATED)
  send(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: SendMessageDto,
  ) {
    return this.messages.send(user.userId, dto);
  }

  @Patch('chats/:chatId/messages/read')
  @HttpCode(HttpStatus.OK)
  markRead(
    @CurrentUser() user: CurrentUserPayload,
    @Param('chatId', ParseIntPipe) chatId: number,
  ) {
    return this.messages.markRead(user.userId, chatId);
  }

  @Get('messages/unread-count')
  unreadTotal(@CurrentUser() user: CurrentUserPayload) {
    return this.messages.unreadTotal(user.userId);
  }
}
