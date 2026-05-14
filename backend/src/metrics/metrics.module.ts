import { Global, Module } from '@nestjs/common';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

export const METRIC_POSTS_CREATED = 'posts_created_total';
export const METRIC_COMMENTS_CREATED = 'comments_created_total';
export const METRIC_LIKES = 'likes_total';
export const METRIC_MESSAGES_SENT = 'messages_sent_total';

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
];

@Global()
@Module({
  providers,
  exports: providers,
})
export class MetricsModule {}
