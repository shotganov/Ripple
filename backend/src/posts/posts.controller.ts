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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../auth/current-user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { PaginationQueryDto } from '../shared/dto/pagination.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('feed')
  @UseGuards(JwtAuthGuard)
  getFeed(
    @CurrentUser() user: CurrentUserPayload,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.postsService.getFeed(
      user.userId,
      pagination.cursor,
      pagination.limit,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllPosts(
    @CurrentUser() user: CurrentUserPayload,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.postsService.getAllPosts(
      user.userId,
      pagination.cursor,
      pagination.limit,
    );
  }

  @Get(':postId')
  @UseGuards(JwtAuthGuard)
  getPost(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.postsService.getPost(postId, user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 4, multerConfig))
  createPost(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postsService.createPost(user.userId, dto, files);
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    await this.postsService.deletePost(postId, user.userId, user.role);
  }

  @Post(':postId/likes')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.postsService.likePost(postId, user.userId);
  }

  @Delete(':postId/likes')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  unlikePost(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.postsService.unlikePost(postId, user.userId);
  }
}
