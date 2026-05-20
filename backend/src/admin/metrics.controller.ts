import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { MetricsSummaryService } from './metrics.service';

@Controller('admin/metrics')
@UseGuards(JwtAuthGuard, AdminGuard)
export class MetricsController {
  constructor(private readonly metrics: MetricsSummaryService) {}

  @Get('summary')
  summary() {
    return this.metrics.getSummary();
  }
}
