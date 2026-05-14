import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Логин должен быть строкой' })
  @MinLength(3, { message: 'Логин должен быть не короче 3 символов' })
  @MaxLength(30, { message: 'Логин должен быть не длиннее 30 символов' })
  tag: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(1, { message: 'Введите пароль' })
  @MaxLength(50, { message: 'Пароль должен быть не длиннее 50 символов' })
  password: string;
}
