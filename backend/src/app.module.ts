import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { AdminModule } from './admin/admin.module';
import { MetricsModule } from './metrics/metrics.module';

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
              options: { colorize: true, singleLine: true, translateTime: 'HH:MM:ss' },
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
          res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
        },
        autoLogging: { ignore: (req) => (req.url ?? '').startsWith('/metrics') },
      },
    }),
    PrometheusModule.register({ path: '/metrics', defaultMetrics: { enabled: true } }),
    MetricsModule,
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
    AdminModule,
  ],
  // глобальный exception filter подключается в main.ts

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
