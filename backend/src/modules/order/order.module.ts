import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderSchema } from 'src/core/schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from 'src/core/guards/order.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    JwtModule.register({
      secret: 'gaher', // Replace with a more secure secret in production
      signOptions: { expiresIn: '60m' }, // Adjust token expiration as needed
    }),
  ],
  providers: [OrderService, AuthGuard],
  controllers: [OrderController],
})
export class OrderModule {}
