import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email invalide' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Mot de passe : 6 caracteres minimum' })
  @MaxLength(100)
  password!: string;

  @IsString()
  @MinLength(2, { message: 'Nom complet requis' })
  fullName!: string;

  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, { message: 'Numero de telephone invalide' })
  phone!: string;
}
