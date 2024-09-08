import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  bookId?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsEnum(['Pending', 'Completed', 'Failed'])
  paymentStatus?: 'Pending' | 'Completed' | 'Failed';

  @IsOptional()
  @IsString()
  userId?: string;
}
