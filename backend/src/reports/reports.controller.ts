import {
  BadRequestException,
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
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ListReportsQueryDto } from './dto/list-reports.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../auth/current-user.decorator';

@Controller()
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Post('reports')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateReportDto,
  ) {
    return this.reports.create(user.userId, dto);
  }

  @Get('admin/reports/count')
  @UseGuards(JwtAuthGuard, AdminGuard)
  pendingCount(@CurrentUser() user: CurrentUserPayload) {
    return this.reports.pendingCount(user.userId);
  }

  @Post('admin/reports/seen')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  markSeen(@CurrentUser() user: CurrentUserPayload) {
    return this.reports.markSeen(user.userId);
  }

  @Get('admin/reports')
  @UseGuards(JwtAuthGuard, AdminGuard)
  list(@Query() query: ListReportsQueryDto) {
    return this.reports.list(
      query.offset,
      query.limit,
      query.status,
      query.archived,
    );
  }

  @Patch('admin/reports/:id/dismiss')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  dismiss(@Param('id', ParseIntPipe) id: number) {
    return this.reports.dismiss(id);
  }

  @Patch('admin/reports/:type/:targetId/dismiss')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  dismissByTarget(
    @Param('type') type: string,
    @Param('targetId', ParseIntPipe) targetId: number,
  ) {
    if (type !== 'post' && type !== 'comment') {
      throw new BadRequestException('type must be post or comment');
    }
    return this.reports.dismissByTarget(type, targetId);
  }
}
