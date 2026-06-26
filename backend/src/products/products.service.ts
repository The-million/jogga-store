import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private transform(p: any) {
    const urls: string[] = Array.isArray(p.imageUrls) ? p.imageUrls : [];
    const variants = Array.isArray(p.variants) ? p.variants : [];
    return {
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice != null ? Number(p.comparePrice) : null,
      imageUrl: urls[0] ?? null,
      imageUrls: urls,
      variants,
    };
  }

  async findAll(categorySlug?: string) {
    const where: any = { isActive: true };
    if (categorySlug) where.category = { slug: categorySlug };
    const products = await this.prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return products.map(this.transform.bind(this));
  }

  async findAllAdmin() {
    const products = await this.prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return products.map(this.transform.bind(this));
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Produit introuvable');
    return this.transform(product);
  }

  async create(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        price: dto.price,
        comparePrice: dto.comparePrice ?? null,
        stockQuantity: dto.stockQuantity,
        categoryId: dto.categoryId,
        imageUrls: dto.imageUrls ?? [],
        isActive: dto.isActive ?? true,
      },
      include: { category: true },
    });
    return this.transform(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOrFail(id);
    const product = await this.prisma.product.update({
      where: { id },
      data: dto as any,
      include: { category: true },
    });
    return this.transform(product);
  }

  async remove(id: string) {
    await this.findOrFail(id);
    return this.prisma.product.delete({ where: { id } });
  }

  private async findOrFail(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produit introuvable');
    return product;
  }
}
