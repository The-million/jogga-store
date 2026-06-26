import { IsString, MinLength, IsNumber, Min, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  slug!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  comparePrice?: number | null;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stockQuantity!: number;

  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  variants?: { name: string; values: string[] }[];
}
