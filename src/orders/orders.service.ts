import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // 1. Создание заказа
  async create(dto: CreateOrderDto, userId: number) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Заказ не может быть пустым');
    }

    return this.prisma.$transaction(async (tx) => {
      let total = 0;
      // Явно указываем тип массива, чтобы убрать ошибку 'never'
      const orderItemsData: { productId: number; quantity: number; price: number }[] = [];

      // Проверяем существование товаров и считаем общую сумму
      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Товар с ID ${item.productId} не найден`);
        }

        total += product.price * item.quantity;

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Создаем заказ
      return tx.order.create({
        data: {
          userId: userId,
          totalPrice: total,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  }

  // 2. Получение истории заказов текущего пользователя
  async findAll(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. Получение конкретного заказа по ID (с проверкой прав)
  async findOne(id: number, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Заказ с ID ${id} не найден`);
    }

    if (order.userId !== userId) {
      throw new BadRequestException('У вас нет доступа к просмотру этого заказа');
    }

    return order;
  }
}