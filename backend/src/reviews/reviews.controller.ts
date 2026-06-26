import {
  Controller, Get, Post, Delete,
  Param, Body, Req, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('products/:slug/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(@Param('slug') slug: string) {
    return this.reviewsService.findByProduct(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('slug') slug: string,
    @Req() req: any,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(req.user.id, slug, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.reviewsService.remove(id, req.user.id, isAdmin);
  }
}

// Admin: voir tous les avis
@Controller('admin/reviews')
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.reviewsService.findAll();
  }
}
