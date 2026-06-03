import { Controller, Get, Post, Body, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Orders (Заказы)')
@Controller('orders')
@UseGuards(JwtAuthGuard) // Абсолютно все эндпоинты заказов требуют авторизации
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Оформить новый заказ' })
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Получить историю своих заказов' })
  findAll(@Req() req) {
    return this.ordersService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить детали конкретного заказа по ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.ordersService.findOne(id, req.user.id);
  }
}