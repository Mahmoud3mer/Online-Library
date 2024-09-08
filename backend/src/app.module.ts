import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
<<<<<<< HEAD
import { BookModule } from './modules/book/book.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReviewModule } from './modules/review/review.module';
import { StreamEventModule } from './modules/stream-event/stream-event.module';
=======
import { OrderModule } from './modules/order/order.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
>>>>>>> 945094a30b1fd6c10f26d7307aaa6fa7613b4236

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/onlineLibrary'),
<<<<<<< HEAD
    BookModule,
    AuthModule,
    ReviewModule,
    StreamEventModule,
=======
    OrderModule,
    AuthModule,
    BookModule,
>>>>>>> 945094a30b1fd6c10f26d7307aaa6fa7613b4236
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
