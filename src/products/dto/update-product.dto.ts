import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

// PartialType автоматически делает все поля из CreateProductDto необязательными
export class UpdateProductDto extends PartialType(CreateProductDto) {}