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
  @IsOptional()
  name: string;

  @MinLength(3)
  @MaxLength(15)
  @NotContains(' ')
  fName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  @NotContains(' ')
  lName: string;

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

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  @NotContains(' ')
  fName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  @NotContains(' ')
  lName: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @NotContains(' ')
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(8)
  password: string;
}
