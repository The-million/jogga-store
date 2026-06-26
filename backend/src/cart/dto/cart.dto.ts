import { IsString, IsNumber, Min, IsOptional, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @IsString()
  productId!: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity!: number;

  @IsOptional()
  @IsObject()
  variantLabel?: Record<string, string>;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}
