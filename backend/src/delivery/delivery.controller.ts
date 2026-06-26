import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { UpdateDeliveryStatusDto } from './dto/delivery.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post(':orderId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DELIVERY')
  async updateStatus(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateDeliveryStatusDto,
    @Req() req: any,
  ) {
    return this.deliveryService.updateStatus(orderId, dto.status, dto.note, dto.eta, req.user.id);
  }

  @Get(':orderId/history')
  @UseGuards(JwtAuthGuard)
  async getStatusHistory(@Param('orderId') orderId: string) {
    return this.deliveryService.getStatusHistory(orderId);
  }

  @Get('admin/active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DELIVERY')
  async getActiveOrders() {
    return this.deliveryService.getActiveOrders();
  }
}
