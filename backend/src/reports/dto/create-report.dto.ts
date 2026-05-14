import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import { ReportReason } from '@prisma/client';

export class CreateReportDto {
  @IsEnum(ReportReason)
  reason: ReportReason;

  @ValidateIf((o: CreateReportDto) => o.commentId === undefined)
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  postId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  commentId?: number;
}
