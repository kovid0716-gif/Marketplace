import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Это позволит не импортировать PrismaModule в каждый модуль отдельно
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Обязательно экспортируем, чтобы другие сервисы его видели
})
export class PrismaModule {}