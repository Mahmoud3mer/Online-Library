import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule } from './modules/book/book.module';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';

@Module({
  imports: [BookModule, AuthModule,CartModule,WishlistModule, MongooseModule.forRoot('mongodb://localhost:27017/nest_iti')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
