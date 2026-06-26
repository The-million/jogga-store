import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class UpdateDeliveryStatusDto {
  @IsString()
  @IsIn(['CONFIRMED', 'PREPARING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'])
  status!: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsDateString()
  eta?: string; // ISO date string: "2026-06-27T14:30:00"
}
