import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль (минимум 6 символов)' })
  password: string;

  @ApiProperty({ example: 'USER', enum: ['USER', 'SELLER'], description: 'Роль пользователя' })
  role?: 'USER' | 'SELLER';
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль' })
  password: string;
}