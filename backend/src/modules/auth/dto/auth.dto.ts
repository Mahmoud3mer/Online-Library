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
  @MinLength(3)
  @MaxLength(10)
  @NotContains(' ')
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @NotContains(' ')
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(8)
  password: string;

  @IsString()
  @IsOptional()
  role: string;

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
  @MinLength(3)
  @MaxLength(8)
  password: string;

  @IsString()
  role: string;
}
