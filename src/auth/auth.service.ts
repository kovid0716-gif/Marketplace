import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. РЕГИСТРАЦИЯ
  async register(dto: RegisterDto) {
    // Проверяем, существует ли пользователь с таким email
    const candidate = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (candidate) {
      throw new BadRequestException('Пользователь с таким email уже зарегистрирован');
    }

    // Хэшируем пароль (соль = 10)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Создаем пользователя в БД
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role || 'USER', // По умолчанию USER
      },
    });

    // Возвращаем сгенерированный токен
    return this.generateToken(user.id, user.email, user.role);
  }

  // 2. АВТОРИЗАЦИЯ (ЛОГИН)
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Проверяем правильность пароля
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return this.generateToken(user.id, user.email, user.role);
  }

  // Вспомогательный метод для создания JWT access_token
  private async generateToken(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: userId, email, role },
    };
  }
}