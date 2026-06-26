import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @MinLength(2)
  label: string; // "Maison", "Bureau", "Autre"

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  @MinLength(3)
  street: string;

  @IsString()
  @MinLength(2)
  city: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
