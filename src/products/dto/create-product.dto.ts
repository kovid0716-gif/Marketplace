import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Смартфон Apple iPhone 15', description: 'Название товара' })
  title: string;

  @ApiProperty({ example: '128 ГБ, черный', description: 'Описание товара' })
  description: string;

  @ApiProperty({ example: 450000, description: 'Цена товара' })
  price: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Ссылка на изображение', required: false })
  imageUrl?: string;
}