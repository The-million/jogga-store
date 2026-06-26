import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsIn(['CONFIRMED', 'PREPARING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'])
  status!: string;

  @IsOptional()
  @IsString()
  note?: string;
}
