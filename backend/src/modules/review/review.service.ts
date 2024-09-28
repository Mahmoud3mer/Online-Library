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

            body.date = new Date();
            body.userId = userId
            const addedReview = await this.ReviewModel.insertMany(body);
            return { message: "Added Review", addedReview };
    }

    getAllReviews = async (paginationDto: PaginationDTO , bookID: string) => {
        const page = paginationDto.page;
        const limit = paginationDto.limit;
        const skip = (page - 1) * limit;
        try {
            const total = await this.ReviewModel.countDocuments().exec();
            const allReviews = await this.ReviewModel.find({ bookId: bookID })
            const allReviewsLength = allReviews.length
            const paginationReviews = await this.ReviewModel.find({ bookId: bookID }).populate('userId','fName lName')
                .skip(skip)
                .limit(limit);
            return {
                message: "Success, Get All reviews.",
                results: paginationReviews.length,
                metaData: {
                    currentPage: page,
                    numberOfPages: Math.ceil(total / limit),
                    limit
                },
                data: paginationReviews
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
            const updatedReview = await this.ReviewModel.findOneAndUpdate({_id: id , userId: userId}, body, { new: true });
            return { message: "Updated Review", updatedReview };
        } catch (error) {
            throw new Error('Error updating review');
        }
    }

    deleteReview = async (id: string, userId: any) => {
        try {
            const reviewById = await this.ReviewModel.findOneAndDelete({_id: id , userId: userId});
            if (!reviewById) {
                return { message: "You do not have permission to delete it" };
            }
            return { message: "Deleted Review Successed.", reviewById };
        } catch (error) {
            throw new Error('Error deleting review');
        }
    }
}
