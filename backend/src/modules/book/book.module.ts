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
  MulterModule.register({
    storage: diskStorage({
      destination: './uploads', //! مكان حفظ الملفات
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname); //! الامتداد
        const fileName = `${file.originalname}-${uniqueSuffix}${ext}`;
        callback(null, fileName);
      },
    }),
  }),
AuthorModule,
CategoryModule,
ReviewModule
],
  controllers: [BookController],
  providers: [BookService,JwtService]
})
export class BookModule {}
