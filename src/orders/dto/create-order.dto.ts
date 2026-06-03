import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 1, description: 'ID товара' })
  productId: number;

  @ApiProperty({ example: 2, description: 'Количество товара' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto], description: 'Список товаров в заказе' })
  items: OrderItemDto[];
}