import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book } from 'src/core/schemas/book.schema';
import { BookDTO } from './bookdto/book.dto';
import { PaginationDTO } from './bookdto/pagination.dto';
import { Author } from 'src/core/schemas/author.schema';
import { Review } from 'src/core/schemas/review.schema';
import { Category } from 'src/core/schemas/category.schema';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name) private bookModel: Model<Book>,
        @InjectModel(Author.name) private authorModel: Model<Author>,
        @InjectModel(Review.name) private ReviewModel: Model<Review>,
        @InjectModel(Category.name) private CategoryModel: Model<Category>
    ) {
        cloudinary.config({
            cloud_name: 'dvrl2eknu',
            api_key: '287955823152971',
            api_secret: 'TwNg0tN4IDLdQ0k6GEcFZco0deU'
        });
    }

    addNewBook = async (book: BookDTO, file: Express.Multer.File) => {

        if (file) {
            console.log(file)
            // !cloudinary
            const imgRes = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'book_cover_image'
                    },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result);
                    }
                ).end(file.buffer);
            });
            // console.log(imgRes['secure_url']);
            book.coverImage = imgRes['secure_url'];
        } else {
            throw new HttpException('Fail, File Is Empty!', HttpStatus.BAD_REQUEST);
        }
        // console.log(file);
        // book.coverImage = file.path;

        book.publishedDate = new Date()
        await this.bookModel.insertMany(book);
        return { message: "Success, Book Added.", data: book };
    }

    // ! All Books and Pagination
    getAllBooks = async (
        paginationDTO: PaginationDTO,
        category: string,
        author: string,
        title: string,
        sortField: string,
        sortOrder: string
    ) => {
        const page = paginationDTO.page;
        const limit = paginationDTO.limit;
        const skip = (page - 1) * limit;

        const query: any = {};

        if (category && category.trim() !== '') {
            query['category'] = category.trim();
        }

        if (author && author.trim() !== '') {
            query['author'] = author.trim();
        }

        if (title && title.trim() !== '') {
            query['title'] = { $regex: title.trim(), $options: 'i' };
        }

        const sort: any = {};

        if (sortField && sortField.trim() && sortOrder && sortOrder.trim()) {
            sort[sortField.trim()] = sortOrder.trim() === 'asc' ? 1 : -1;
        }
        console.log('Query:', query);
        console.log('Page:', page, 'Limit:', limit, 'Skip:', skip);


        const total = await this.bookModel.countDocuments(query).exec();

        try {
            const books = await this.bookModel
                .find(query)
                .sort(sort)
                .limit(limit)
                .skip(skip)
                .populate('author')
                .populate('category')
                .populate({
                    path: 'reviews',
                    populate: {
                        path: 'userId',
                        select: 'name'
                    }
                })
                .exec();

            return {
                message: "Success, Got Books.",
                results: books.length,
                metaData: {
                    currentPage: page,
                    numberOfPages: Math.ceil(total / limit),
                    limit
                },
                data: books
            };
        } catch (error) {
            return { message: "Error fetching the books.", Error: error.message };
        }
    }



    getOneBook = async (id: string) => {
        try {
            const findBook = await this.bookModel
                .findOne({ _id: id })
                .populate('author')
                .populate('category')
                .populate({
                    path: 'reviews',
                    populate: {
                        path: 'userId',
                        select: 'name'
                    }
                })


            if (!findBook)
                throw new HttpException('Fail, Book Not Found!', HttpStatus.BAD_REQUEST);

            return { message: "Success, Got Specific Book.", data: findBook };
        } catch (error) {
            return { message: "Error fetching the book.", Error: error.message };
        }
    }


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateThisBook = async (bookId: string, book: any, file: Express.Multer.File) => {
        try {
            const findBook = await this.bookModel.findById({ _id: bookId });

            if (!findBook) throw new HttpException('Fail, Book Not Found!', HttpStatus.BAD_REQUEST);

            if (file) {
                console.log(file)
                // !cloudinary
                const imgRes = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'image',
                            folder: 'book_cover_image'
                        },
                        (error, result) => {
                            if (error) {
                                return reject(error);
                            }
                            resolve(result);
                        }
                    ).end(file.buffer);
                });
                // console.log(imgRes['secure_url']);
                book.coverImage = imgRes['secure_url'];
            } else {
                throw new HttpException('Fail, File Is Empty!', HttpStatus.BAD_REQUEST);
            }

            const updateBook = await this.bookModel.findByIdAndUpdate(
                { _id: bookId },
                { $set: book },
                { new: true }
            ).populate('author')
                .populate('category');

            return { message: "Success, Book Updated.", data: updateBook };
        } catch (error) {
            return { message: "Error fetching the book.", Error: error.message }
        }
    }

    removeBook = async (bookId: string) => {
        try {
            const findBook = await this.bookModel.findByIdAndDelete({ _id: bookId });
            if (!findBook) throw new HttpException('Fail, Book Not Found!', HttpStatus.BAD_REQUEST);

            return { message: "Success, Book Deleted.", data: findBook };
        } catch (error) {
            return { message: "Error fetching the book.", Error: error.message }
        }

    }


    async getBooksByRecommendation(
        paginationDTO: PaginationDTO,
        categories: string[],
    ) {
        const page = Math.max(1, paginationDTO.page || 1); // Ensure page is at least 1
        const limit = Math.max(1, paginationDTO.limit || 10); // Default limit if not provided
        const skip = (page - 1) * limit;

        const query: any = {};

        // Convert category strings to ObjectId and use them in the query
        if (categories && categories.length > 0) {
            const categoryObjectIds = categories.map(id => new Types.ObjectId(id)); // Convert to ObjectId
            query['category'] = { $in: categoryObjectIds };
        }

        console.log('Query:', query);
        console.log('Page:', page, 'Limit:', limit, 'Skip:', skip);

        // Get the total count of books for pagination purposes
        const total = await this.bookModel.countDocuments(query).exec();

        try {
            // Fetch books with pagination and populate references
            const books = await this.bookModel
                .find(query)
                .limit(limit)
                .skip(skip)
                .populate('author')
                .populate('category')
                .exec();

            return {
                message: "Success, Got Recommended Books.",
                results: books.length,
                metaData: {
                    currentPage: page,
                    numberOfPages: Math.ceil(total / limit),
                    totalResults: total, // Include total count for clarity
                    limit
                },
                data: books
            };
        } catch (error) {
            console.error('Error fetching books:', error);
            return { message: "Error fetching the recommended books.", error: error.message };
        }
    }


}