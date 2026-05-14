import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../auth/current-user.decorator';
import { ListChatsQueryDto } from './dto/list-chats.dto';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chats: ChatsService) {}

  @Get()
  list(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: ListChatsQueryDto,
  ) {
    return this.chats.list(
      user.userId,
      query.cursor,
      query.limit,
      query.search,
    );
  }

  @Get('with/:peerId')
  findWithPeer(
    @CurrentUser() user: CurrentUserPayload,
    @Param('peerId', ParseIntPipe) peerId: number,
  ) {
    return this.chats.findWithPeer(user.userId, peerId);
  }
}
