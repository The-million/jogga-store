import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  async checkout(@Req() req: any, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(req.user.id, dto.paymentMode, dto.address);
  }

  @Get('mine')
  async myOrders(@Req() req: any) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'DELIVERY')
  async findAll() {
    return this.ordersService.findAll();
  }
}
