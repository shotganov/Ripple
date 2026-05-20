import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge, Histogram } from 'prom-client';
import {
  METRIC_COMMENTS_CREATED,
  METRIC_HTTP_DURATION,
  METRIC_HTTP_ERRORS,
  METRIC_HTTP_REQUESTS,
  METRIC_LIKES,
  METRIC_MESSAGES_SENT,
  METRIC_POSTS_CREATED,
  METRIC_WS_CONNECTIONS,
} from '../metrics/metrics.module';

@Injectable()
export class MetricsSummaryService {
  private cpuSnapshot = { usage: process.cpuUsage(), time: Date.now() }

  constructor(
    @InjectMetric(METRIC_HTTP_REQUESTS) private requests: Counter<string>,
    @InjectMetric(METRIC_HTTP_ERRORS) private errors: Counter<string>,
    @InjectMetric(METRIC_HTTP_DURATION) private duration: Histogram<string>,
    @InjectMetric(METRIC_POSTS_CREATED) private posts: Counter<string>,
    @InjectMetric(METRIC_COMMENTS_CREATED) private comments: Counter<string>,
    @InjectMetric(METRIC_LIKES) private likes: Counter<string>,
    @InjectMetric(METRIC_MESSAGES_SENT) private messages: Counter<string>,
    @InjectMetric(METRIC_WS_CONNECTIONS) private wsConnections: Gauge<string>,
  ) {}

  async getSummary() {
    const reqData = await this.requests.get()
    const errData = await this.errors.get()
    const durData = await this.duration.get()
    const wsData = await this.wsConnections.get()

    const totalRequests = reqData.values.reduce((s, v) => s + v.value, 0)
    const totalErrors = errData.values.reduce((s, v) => s + v.value, 0)

    // среднее время ответа из histogram: sum / count
    const sumVal = durData.values.find(v => v.metricName?.endsWith('_sum'))
    const countVal = durData.values.find(v => v.metricName?.endsWith('_count'))
    const avgDurationMs =
      sumVal && countVal && countVal.value > 0
        ? Math.round((sumVal.value / countVal.value) * 1000)
        : 0

    const wsActive = wsData.values.reduce((s, v) => s + v.value, 0)

    const [postsTotal, commentsTotal, likesTotal, messagesTotal] = await Promise.all([
      this.posts.get().then(d => d.values.reduce((s, v) => s + v.value, 0)),
      this.comments.get().then(d => d.values.reduce((s, v) => s + v.value, 0)),
      this.likes.get().then(d => d.values.reduce((s, v) => s + v.value, 0)),
      this.messages.get().then(d => d.values.reduce((s, v) => s + v.value, 0)),
    ])

    return {
      http: {
        totalRequests,
        totalErrors,
        cpuUsage: this.getCpuPercent(),
        avgDurationMs,
      },
      activity: {
        postsCreated: postsTotal,
        commentsCreated: commentsTotal,
        likesGiven: likesTotal,
        messagesSent: messagesTotal,
      },
      realtime: {
        wsConnections: wsActive,
      },
    }
  }

  private getCpuPercent(): number {
    const now = Date.now()
    const usage = process.cpuUsage(this.cpuSnapshot.usage)
    const elapsedUs = (now - this.cpuSnapshot.time) * 1000
    this.cpuSnapshot = { usage: process.cpuUsage(), time: now }
    if (elapsedUs <= 0) return 0
    return Math.round(((usage.user + usage.system) / elapsedUs) * 100 * 10) / 10
  }
}
