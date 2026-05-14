import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CurrentUser,
  type CurrentUserPayload,
} from 'src/auth/current-user.decorator';
import { PaginationQueryDto } from '../shared/dto/pagination.dto';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('posts/:postId/comments')
  getPostComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.commentsService.getPostComments(
      postId,
      pagination.cursor,
      pagination.limit,
    );
  }

  @Post('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(postId, user.userId, dto);
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.commentsService.deleteComment(
      commentId,
      user.userId,
      user.role,
    );
  }
}
