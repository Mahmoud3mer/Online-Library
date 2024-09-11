import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @NotContains(' ')
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  verificationToken: string;
  isVerified: boolean;
}

export class SignInDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @NotContains(' ')
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  role: string;
}
