import { Module } from '@nestjs/common';
import { SentryModule } from '@sentry/nestjs/setup';
import { LoggerModule } from 'nestjs-pino';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpMetricsInterceptor } from './shared/interceptors/http-metrics.interceptor';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { FollowsModule } from './follows/follows.module';
import { SearchModule } from './search/search.module';
import { PrismaModule } from './prisma/prisma.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { ReportsModule } from './reports/reports.module';
import { MetricsModule } from './metrics/metrics.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              level: 'info',
              options: {
                colorize: true,
                singleLine: true,
                translateTime: 'HH:MM:ss',
              },
            },
            {
              target: 'pino-roll',
              level: 'info',
              options: {
                file: 'logs/app.log',
                frequency: 'daily',
                size: '10m',
                mkdir: true,
              },
            },
          ],
        },
        serializers: {
          req: (req: { method: string; url: string }) => ({
            method: req.method,
            url: req.url,
          }),
          res: (res: { statusCode: number }) => ({
            statusCode: res.statusCode,
          }),
        },
        autoLogging: {
          ignore: (req) => (req.url ?? '').startsWith('/metrics'),
        },
      },
    }),
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
    }),
    SentryModule.forRoot(),
    MetricsModule,
    AdminModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    PostsModule,
    CommentsModule,
    FollowsModule,
    SearchModule,
    NotificationsModule,
    ChatsModule,
    MessagesModule,
    ReportsModule,
  ],
  // глобальный exception filter подключается в main.ts

  controllers: [AppController],
  providers: [AppService, HttpMetricsInterceptor],
})
export class AppModule {}
