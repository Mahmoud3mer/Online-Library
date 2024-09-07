import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from 'src/core/schemas/review.schema';
import { reviewDTO } from './DTO/review.DTO';
import { PaginationDTO } from '../book/bookdto/pagination.dto';

@Injectable()
export class ReviewService {

    constructor(@InjectModel(Review.name) private ReviewModel: Model<Review>) { }


    addReview = async (body: reviewDTO) => {
        const addedReview = await this.ReviewModel.insertMany(body)
        return {message: "added Review", addedReview}
    }

    getAllReviews = async (paginationDto : PaginationDTO) => {
        const allReviews = await this.ReviewModel.find()
        .skip(paginationDto.page)
        .limit(paginationDto.limit)
        return {message: "All Reviews", allReviews}
    }

    getReviewById = async(id: string) => {
        const reviewById = await this.ReviewModel.findById(id);
        return {message: "reviewByID", reviewById}
    }

    updateReview = async (id: string, body: any) => {
        const updatedReview = await this.ReviewModel.findByIdAndUpdate(id,body);
        return {message: "updated Review", updatedReview}

    }
    deleteReview = async(id: string) => {
        const reviewById = await this.ReviewModel.findByIdAndDelete(id);
        return {message: "deleted Review", reviewById}
    }
}
