// src/modules/wishlist/wishlist.module.ts
import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { MongooseModule } from '@nestjs/mongoose';
 
import { Book, BookSchema } from 'src/core/schemas/book.schema';
import { JwtService } from '@nestjs/jwt';
import { Wishlist, WishlistSchema } from 'src/core/schemas/wishlist.schema';
 
@Module({
  imports: [MongooseModule.forFeature([{ name:Wishlist.name, schema: WishlistSchema }]),
      MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),],
  

controllers: [WishlistController],
  providers: [WishlistService,JwtService],
})
export class WishlistModule {}
