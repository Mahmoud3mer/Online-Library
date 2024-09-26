/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/core/schemas/category.schema';
import { CategoryDTO } from './dto/Category.DTO';

import { PaginationDTO } from '../book/bookdto/pagination.dto';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private readonly CategoryModel: Model<Category>) { 
        cloudinary.config({
            cloud_name: 'dvrl2eknu',
            api_key: '287955823152971',
            api_secret: 'TwNg0tN4IDLdQ0k6GEcFZco0deU'
        });
    }

    addNewCategory = async (body: CategoryDTO, file: Express.Multer.File) => {
        try {
            if (file) {
                console.log(file)
                const imgRes = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                    { 
                        resource_type: 'image' ,
                        folder: 'category_image'
                    },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result);
                    }
                    ).end(file.buffer);
                });
                body.image = imgRes['secure_url'];
            }
            const newCategory = await this.CategoryModel.create(body);
            return { message: 'Added New Category', newCategory };
        } catch (error) {
            throw new HttpException('Failed to add category', HttpStatus.BAD_REQUEST);
        }
    };

    getAllCategories = async (paginationDTO: PaginationDTO, name: string) => {
        const { page, limit } = paginationDTO;
        const skip = (page - 1) * limit;
        const query: any = {};
        if (name && name.trim() !== '') {
            query['name'] = { $regex: name.trim(), $options: 'i' };
        }
        const total = await this.CategoryModel.countDocuments().exec();
        const allCategories = await this.CategoryModel
            .find(query)
            .limit(limit)
            .skip(skip);
        return {
            message: 'Success, Got All Categories',
            results: allCategories.length,
            metaData: {
                currentPage: page,
                numberOfPages: Math.ceil(total / limit),
                limit,
            },
            data: allCategories,
        };
    };

    getCategoryById = async (categoryId: string) => {
        const category = await this.CategoryModel.findById(categoryId);
        if (!category) throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
        return { message: 'Success, Got Needed Category', category };
    };

    updateCategory = async (categoryId: string, category: CategoryDTO, file: Express.Multer.File) => {
        try {
            if (file) {
                console.log(file)
                const imgRes = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                    { 
                        resource_type: 'image' ,
                        folder: 'category_image'
                    },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result);
                    }
                    ).end(file.buffer);
                });
                category.image = imgRes['secure_url'];
            }
            
            const updatedCategory = await this.CategoryModel.findByIdAndUpdate(
                categoryId,
                { $set: category },
                { new: true },
            );
            if (!updatedCategory) throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
            return { message: 'Success, Category Updated', data: updatedCategory };
        } catch (error) {
            throw new HttpException('Error updating the category', HttpStatus.BAD_REQUEST);
        }
    };

    deleteCategory = async (categoryId: string) => {
        try {
            const category = await this.CategoryModel.findByIdAndDelete(categoryId);
            if (!category) throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
            return { message: 'Success, Category Deleted', data: category };
        } catch (error) {
            throw new HttpException('Error deleting the category', HttpStatus.BAD_REQUEST);
        }
    };
}
