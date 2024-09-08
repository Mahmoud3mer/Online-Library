import { IsString, IsNumber, IsDate, IsEnum } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  shippingAddress: string;

  @IsString()
  bookId: string;

  @IsString()
  userId: string;

  @IsNumber()
  totalAmount: number;

  @IsDate()
  orderDate: Date;

  @IsEnum(['Pending', 'Completed', 'Failed'])
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
}
