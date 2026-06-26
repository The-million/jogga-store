import {
  Controller, Get, Post, Delete,
  Param, Body, Req, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { WishlistService } from './wishlist.service';
import { IsString } from 'class-validator';

class AddToWishlistDto {
  @IsString()
  productId: string;
}

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.wishlistService.findByUser(req.user.id);
  }

  @Get('check/:productId')
  async check(@Req() req: any, @Param('productId') productId: string) {
    return this.wishlistService.check(req.user.id, productId);
  }

  @Post()
  add(@Req() req: any, @Body() dto: AddToWishlistDto) {
    return this.wishlistService.add(req.user.id, dto.productId);
  }

  @Post('by-slug/:slug')
  addBySlug(@Req() req: any, @Param('slug') slug: string) {
    return this.wishlistService.addBySlug(req.user.id, slug);
  }

  @Delete(':productId')
  remove(@Req() req: any, @Param('productId') productId: string) {
    return this.wishlistService.remove(req.user.id, productId);
  }

  @Delete('by-slug/:slug')
  removeBySlug(@Req() req: any, @Param('slug') slug: string) {
    return this.wishlistService.removeBySlug(req.user.id, slug);
  }
}
