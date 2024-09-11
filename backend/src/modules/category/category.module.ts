import { Module } from '@nestjs/common';
 
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/core/schemas/category.schema';
import { JwtService } from '@nestjs/jwt';
import { CategoryService } from './category.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService],
  exports: [CategoryService, MongooseModule],
})
export class CategoryModule { }
