import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from 'src/core/schemas/review.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{name: Review.name, schema: ReviewSchema }])],
  controllers: [ReviewController],
  providers: [ReviewService, JwtService],
  exports: [ReviewService, MongooseModule],
})
export class ReviewModule {}
