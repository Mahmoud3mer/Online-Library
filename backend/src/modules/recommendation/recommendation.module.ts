 import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { Recommendation, RecommendationSchema } from 'src/core/schemas/recommendation.schema';
import { JwtService } from '@nestjs/jwt';
import { Category, CategorySchema } from 'src/core/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recommendation.name, schema: RecommendationSchema },{ name: Category.name, schema: CategorySchema }]),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService,JwtService],
})
export class RecommendationModule {}

