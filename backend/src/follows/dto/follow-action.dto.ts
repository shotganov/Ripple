import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class FollowDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  followingId: number;
}
