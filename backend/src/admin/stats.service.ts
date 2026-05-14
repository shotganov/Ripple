import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type DailyPoint = { date: string; count: number };

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [users, posts, comments, likes, follows] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.post.count(),
      this.prisma.comment.count(),
      this.prisma.like.count(),
      this.prisma.follow.count(),
    ]);

    const postsByDay = await this.getPostsByDay(30);

    return { users, posts, comments, likes, follows, postsByDay };
  }

  private async getPostsByDay(days: number): Promise<DailyPoint[]> {
    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - (days - 1));

    const rows = await this.prisma.$queryRaw<
      { day: Date; count: bigint }[]
    >`
      SELECT date_trunc('day', created_at) AS day, COUNT(*) AS count
      FROM posts
      WHERE created_at >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `;

    const map = new Map<string, number>();
    for (const r of rows) {
      map.set(r.day.toISOString().slice(0, 10), Number(r.count));
    }

    const result: DailyPoint[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setUTCDate(since.getUTCDate() + i);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, count: map.get(key) ?? 0 });
    }
    return result;
  }
}
