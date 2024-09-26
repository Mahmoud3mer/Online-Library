import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  shippingAddress: string;

  @IsString()
  userId: string;

  @IsNumber()
  totalPrice: number;

  @IsDate()
  orderDate: Date;

  @IsEnum(['PENDING', 'APPROVED', 'DENIED'])
  paymentStatus: 'PENDING' | 'APPROVED' | 'DENIED';

  @IsEnum(['online', 'ondelivery'])
  paymentMethod: 'online' | 'ondelivery';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

class OrderItemDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  coverImage: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}
