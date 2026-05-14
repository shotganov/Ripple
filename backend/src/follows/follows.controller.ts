import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../auth/current-user.decorator';

@Controller('users')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':targetId/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  followUser(
    @Param('targetId', ParseIntPipe) targetId: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.followsService.followUser(user.userId, targetId);
  }

  @Delete(':targetId/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  unfollowUser(
    @Param('targetId', ParseIntPipe) targetId: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.followsService.unfollowUser(user.userId, targetId);
  }

  @Get(':targetId/follow-status')
  @UseGuards(JwtAuthGuard)
  getFollowStatus(
    @Param('targetId', ParseIntPipe) targetId: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.followsService.getFollowStatus(user.userId, targetId);
  }

  @Get(':userId/following')
  getFollowing(@Param('userId', ParseIntPipe) userId: number) {
    return this.followsService.getFollowing(userId);
  }
}
