import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsOptional()
  @IsInt()
  chatId?: number;

  @IsOptional()
  @IsInt()
  peerId?: number;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content!: string;
}
