import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import {
  METRIC_HTTP_DURATION,
  METRIC_HTTP_ERRORS,
  METRIC_HTTP_REQUESTS,
} from '../../metrics/metrics.module';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric(METRIC_HTTP_REQUESTS) private requests: Counter<string>,
    @InjectMetric(METRIC_HTTP_ERRORS) private errors: Counter<string>,
    @InjectMetric(METRIC_HTTP_DURATION) private duration: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const method = req.method;
    const path = this.normalizePath(req.route?.path ?? req.path);
    const start = process.hrtime.bigint();

    return next.handle().pipe(
      tap({
        next: () => this.record(method, path, res.statusCode, start),
        error: (err: { status?: number }) => {
          const status = err?.status ?? 500;
          this.record(method, path, status, start);
        },
      }),
    );
  }

  private record(method: string, path: string, status: number, start: bigint) {
    const labels = { method, path, status: String(status) };
    const seconds = Number(process.hrtime.bigint() - start) / 1e9;

    this.requests.inc(labels);
    this.duration.observe(labels, seconds);

    if (status >= 400) {
      this.errors.inc(labels);
    }
  }

  private normalizePath(path: string): string {
    // заменяем числовые сегменты на :id чтобы не плодить тысячи лейблов
    return path.replace(/\/\d+/g, '/:id');
  }
}
