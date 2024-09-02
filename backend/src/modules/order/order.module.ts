import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderSchema } from 'src/core/schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
