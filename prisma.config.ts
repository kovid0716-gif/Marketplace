import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// Явно подгружаем переменные из .env файла
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL, // Теперь миграции берут URL отсюда
  },
});