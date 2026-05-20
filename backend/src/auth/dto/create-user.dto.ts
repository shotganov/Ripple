import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Логин должен быть строкой' })
  @MinLength(3, { message: 'Логин должен быть не короче 3 символов' })
  @MaxLength(30, { message: 'Логин должен быть не длиннее 30 символов' })
  tag: string;

  @IsEmail({}, { message: 'Введите корректный email' })
  @MaxLength(254, { message: 'Email слишком длинный' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен быть не короче 6 символов' })
  @MaxLength(50, { message: 'Пароль должен быть не длиннее 50 символов' })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160, { message: 'Описание должно быть не длиннее 160 символов' })
  bio?: string;
}
