import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Тег должен быть не короче 3 символов' })
  @MaxLength(30, { message: 'Тег должен быть не длиннее 30 символов' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Тег может содержать только буквы, цифры и _' })
  tag?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  bio?: string;
}
