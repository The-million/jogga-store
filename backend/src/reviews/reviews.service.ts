import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProduct(productSlug: string) {
    const product = await this.prisma.product.findUnique({ where: { slug: productSlug } });
    if (!product) throw new NotFoundException('Produit introuvable');

    const reviews = await this.prisma.review.findMany({
      where: { productId: product.id, isVisible: true },
      include: { user: { select: { fullName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const avg =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : null;

    return { reviews, average: avg ? Math.round(avg * 10) / 10 : null, count: reviews.length };
  }

  async create(userId: string, productSlug: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({ where: { slug: productSlug } });
    if (!product) throw new NotFoundException('Produit introuvable');

    const existing = await this.prisma.review.findUnique({
      where: { userId_productId: { userId, productId: product.id } },
    });
    if (existing) throw new ConflictException('Vous avez déjà laissé un avis pour ce produit');

    return this.prisma.review.create({
      data: { ...dto, userId, productId: product.id },
      include: { user: { select: { fullName: true, avatarUrl: true } } },
    });
  }

  async remove(id: string, userId: string, isAdmin: boolean) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Avis introuvable');
    if (!isAdmin && review.userId !== userId) throw new ForbiddenException('Accès refusé');
    await this.prisma.review.delete({ where: { id } });
    return { message: 'Avis supprimé' };
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        user: { select: { fullName: true } },
        product: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
