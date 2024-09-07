import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './modules/order/order.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/onlineLibrary'),
    OrderModule,
    AuthModule,
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
