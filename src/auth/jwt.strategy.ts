import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // Извлекаем токен из заголовка Authorization: Bearer <TOKEN>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change_me_super_secret',
    });
  }

  // Сюда попадает расшифрованная дата (payload) из токена
  async validate(payload: { sub: number; email: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден или токен недействителен');
    }

    // Возвращаем объект пользователя, он автоматически запишется в req.user
    return { id: user.id, email: user.email, role: user.role };
  }
}