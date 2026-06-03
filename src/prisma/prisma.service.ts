import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Гарантируем, что переменные окружения подгружены до инициализации клиента
dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Создаем стандартный пул соединений PostgreSQL
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL 
    });

    // 2. Оборачиваем его в драйвер-адаптер Prisma 7
    const adapter = new PrismaPg(pool);

    // 3. Передаем адаптер в родительский класс PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    // Подключаемся к базе данных при старте модуля
    await this.$connect();
  }
}