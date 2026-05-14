import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UsersService } from './user.service';
import { PostsService } from '../posts/posts.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../auth/current-user.decorator';
import { profileMulterConfig } from './multer.config';
import { PaginationQueryDto } from '../shared/dto/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('suggestions')
  @UseGuards(JwtAuthGuard)
  getSuggestions(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.getSuggestions(user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get(':id/posts')
  @UseGuards(JwtAuthGuard)
  getUserPosts(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.postsService.getUserPosts(
      id,
      user.userId,
      pagination.cursor,
      pagination.limit,
    );
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 },
      ],
      profileMulterConfig,
    ),
  )
  updateMe(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateUserDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    },
  ) {
    return this.usersService.updateProfile(user.userId, dto, {
      avatar: files?.avatar?.[0],
      coverImage: files?.coverImage?.[0],
    });
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  removeMe(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.remove(user.userId);
  }
}
