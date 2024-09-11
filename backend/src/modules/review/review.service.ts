/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from 'src/core/schemas/review.schema';
import { reviewDTO } from './DTO/review.DTO';
import { PaginationDTO } from '../book/bookdto/pagination.dto';

@Injectable()
export class ReviewService {

    constructor(@InjectModel(Review.name) private ReviewModel: Model<Review>) { }

    addReview = async (userId: string, body: reviewDTO) => {
        try {
            const addedReview = await this.ReviewModel.create({ ...body, userId });
            return { message: "Added Review", addedReview };
        } catch (error) {
            throw new Error('Error adding review');
        }
    }

    getAllReviews = async (paginationDto: PaginationDTO) => {
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        try {
            const total = await this.ReviewModel.countDocuments().exec();
            const allReviews = await this.ReviewModel.find()
                .skip(skip)
                .limit(limit);
            return {
                message: "Success, Get All reviews.",
                results: allReviews.length,
                metaData: {
                    currentPage: page,
                    numberOfPages: Math.ceil(total / limit),
                    limit
                },
                data: allReviews
            };
        } catch (error) {
            throw new Error('Error fetching reviews');
        }
    }

    getReviewById = async (id: string) => {
        try {
            const reviewById = await this.ReviewModel.findById(id);
            return { message: "Review By ID", reviewById };
        } catch (error) {
            throw new Error('Review not found');
        }
    }

    updateReview = async (id: string, body: any, userId: any) => {
        try {
            const updatedReview = await this.ReviewModel.findByIdAndUpdate(id, body, { new: true });
            return { message: "Updated Review", updatedReview };
        } catch (error) {
            throw new Error('Error updating review');
        }
    }

    deleteReview = async (id: string, userId: any) => {
        try {
            const reviewById = await this.ReviewModel.findByIdAndDelete(id);
            return { message: "Deleted Review", reviewById };
        } catch (error) {
            throw new Error('Error deleting review');
        }
    }
}
