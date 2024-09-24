import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from 'src/core/schemas/book.schema';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthorModule } from '../author/author.module';
import { CategoryModule } from '../category/category.module';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    AuthorModule,
    CategoryModule,
    ReviewModule
],
  controllers: [BookController],
  providers: [BookService,JwtService]
})
export class BookModule {}
