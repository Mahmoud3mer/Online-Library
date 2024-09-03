import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule } from './modules/book/book.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [BookModule, AuthModule, MongooseModule.forRoot('mongodb://localhost:27017/onlineLibrary')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
