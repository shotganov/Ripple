import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'Комментарий должен быть строкой' })
  @MinLength(1, { message: 'Введите текст комментария' })
  @MaxLength(300, { message: 'Комментарий должен быть не длиннее 300 символов' })
  content: string;
}
