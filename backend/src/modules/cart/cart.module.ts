import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/core/schemas/cart.schema';
import { Book, BookSchema } from 'src/core/schemas/book.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],

  controllers: [CartController],
  providers: [CartService,JwtService]
})
export class CartModule {}
