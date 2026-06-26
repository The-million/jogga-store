import { IsString, IsOptional, IsIn } from 'class-validator';

export class CheckoutDto {
  @IsString()
  @IsIn(['cash', 'mobile_money'])
  paymentMode!: string;

  @IsOptional()
  @IsString()
  address?: string;
}
