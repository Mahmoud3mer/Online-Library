import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule } from './modules/book/book.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReviewModule } from './modules/review/review.module';
import { StreamEventModule } from './modules/stream-event/stream-event.module';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { CategoryModule } from './modules/category/category.module';
import { AuthorModule } from './modules/author/author.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest_iti'),
    BookModule,
    AuthModule,
    ReviewModule,
    StreamEventModule,
    OrderModule,
    CartModule,
    WishlistModule,
    RecommendationModule,
    CategoryModule,
    AuthorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
