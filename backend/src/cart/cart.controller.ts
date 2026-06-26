import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  async addItem(@Req() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(req.user.id, dto.productId, dto.quantity, dto.variantLabel);
  }

  @Put('items/:itemId')
  async updateItem(@Req() req: any, @Param('itemId') itemId: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(req.user.id, itemId, dto.quantity);
  }

  @Delete('items/:itemId')
  async removeItem(@Req() req: any, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.id, itemId);
  }

  @Delete()
  async clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}
