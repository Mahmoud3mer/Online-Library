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
import { PaymentBackendModule } from './modules/payment-backend/payment-backend.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificationGateway } from './notification/notification.gateway';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(

      `mongodb+srv://itinoteapp:${process.env.MONGO_PASSWORD}@andaloslibrary.zgztk.mongodb.net/?retryWrites=true&w=majority&appName=AndalosLibrary`,
      
    ),
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
    PaymentBackendModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // هذا هو مجلد "uploads"
      serveRoot: '/uploads/', // المسار الذي يتم تقديم الملفات من خلاله
    }),
  ],
  controllers: [AppController],
  providers: [AppService, NotificationGateway],
})
export class AppModule {}
