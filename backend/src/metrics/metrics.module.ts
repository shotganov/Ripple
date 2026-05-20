import { Global, Module } from '@nestjs/common';
import { makeCounterProvider, makeHistogramProvider, makeGaugeProvider } from '@willsoto/nestjs-prometheus';

export const METRIC_POSTS_CREATED = 'posts_created_total';
export const METRIC_COMMENTS_CREATED = 'comments_created_total';
export const METRIC_LIKES = 'likes_total';
export const METRIC_MESSAGES_SENT = 'messages_sent_total';
export const METRIC_HTTP_REQUESTS = 'http_requests_total';
export const METRIC_HTTP_ERRORS = 'http_errors_total';
export const METRIC_HTTP_DURATION = 'http_request_duration_seconds';
export const METRIC_WS_CONNECTIONS = 'ws_connections_active';

const providers = [
  makeCounterProvider({
    name: METRIC_POSTS_CREATED,
    help: 'Общее число созданных постов',
  }),
  makeCounterProvider({
    name: METRIC_COMMENTS_CREATED,
    help: 'Общее число созданных комментариев',
  }),
  makeCounterProvider({
    name: METRIC_LIKES,
    help: 'Общее число поставленных лайков',
  }),
  makeCounterProvider({
    name: METRIC_MESSAGES_SENT,
    help: 'Общее число отправленных сообщений',
  }),
  makeCounterProvider({
    name: METRIC_HTTP_REQUESTS,
    help: 'Количество HTTP-запросов',
    labelNames: ['method', 'path', 'status'],
  }),
  makeCounterProvider({
    name: METRIC_HTTP_ERRORS,
    help: 'Количество HTTP-ошибок (4xx и 5xx)',
    labelNames: ['method', 'path', 'status'],
  }),
  makeHistogramProvider({
    name: METRIC_HTTP_DURATION,
    help: 'Время ответа HTTP-запросов в секундах',
    labelNames: ['method', 'path', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  }),
  makeGaugeProvider({
    name: METRIC_WS_CONNECTIONS,
    help: 'Активные WebSocket-соединения',
  }),
];

@Global()
@Module({
  providers,
  exports: providers,
})
export class MetricsModule {}
