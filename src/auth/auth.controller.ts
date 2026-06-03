import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@ApiTags('Auth (Авторизация)') // Категория в Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({ status: 400, description: 'Email уже занят или ошибка валидации' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Изменяем дефолтный статус 201 для Post на 200 OK
  @ApiOperation({ summary: 'Авторизация пользователя (Логин)' })
  @ApiResponse({ status: 200, description: 'Успешный вход, выдан JWT токен' })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}