import { Module } from '@nestjs/common'; // ИСПРАВЛЕНО: было @nestjs/module
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_me_super_secret',
      signOptions: { expiresIn: '7d' }, // ИСПРАВЛЕНО: убрали конфликт типов строк
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}