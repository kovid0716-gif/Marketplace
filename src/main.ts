import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS, чтобы к бэкенду можно было цеплять фронтенд
  app.enableCors();

  // Конфигурация Swagger
  const config = new DocumentBuilder()
    .setTitle('Marketplace API')
    .setDescription('Документация для бэкенда маркетплейса')
    .setVersion('1.0')
    .addBearerAuth() // Для авторизации по JWT-токену
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  // Привязываем Swagger к адресу /docs
  SwaggerModule.setup('docs', app, document);

  // Берем порт из .env или ставим 3001 по умолчанию
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`\n🚀 Сервер успешно запущен!`);
  console.log(`👉 API: http://localhost:${port}`);
  console.log(`📖 Документация Swagger: http://localhost:${port}/docs\n`);
}
bootstrap();