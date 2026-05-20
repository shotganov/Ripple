import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MetricsModule } from '../metrics/metrics.module';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MetricsSummaryService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { UsersAdminController } from './users-admin.controller';
import { UsersAdminService } from './users-admin.service';

@Module({
  imports: [PrismaModule, MetricsModule],
  controllers: [StatsController, MetricsController, UsersAdminController],
  providers: [StatsService, MetricsSummaryService, UsersAdminService],
})
export class AdminModule {}
