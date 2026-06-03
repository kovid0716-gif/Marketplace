import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // 1. Создание товара (ownerId вытаскиваем из JWT токена)
  async create(dto: CreateProductDto, userId: number) {
    return this.prisma.product.create({
      data: {
        ...dto,
        ownerId: userId,
      },
    });
  }

  // 2. Получение всех товаров
  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. Получение товара по ID
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }
    return product;
  }

  // 4. Обновление товара (с проверкой владельца)
  async update(id: number, dto: UpdateProductDto, userId: number) {
    const product = await this.findOne(id);

    if (product.ownerId !== userId) {
      throw new ForbiddenException('Вы можете редактировать только собственные товары');
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  // 5. Удаление товара (с проверкой владельца)
  async remove(id: number, userId: number) {
    const product = await this.findOne(id);

    if (product.ownerId !== userId) {
      throw new ForbiddenException('Вы можете удалять только собственные товары');
    }

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Товар успешно удален' };
  }
}