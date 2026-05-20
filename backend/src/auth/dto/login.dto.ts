import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Введите корректный email' })
  @MaxLength(254, { message: 'Email слишком длинный' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(1, { message: 'Введите пароль' })
  @MaxLength(50, { message: 'Пароль должен быть не длиннее 50 символов' })
  password: string;
}
