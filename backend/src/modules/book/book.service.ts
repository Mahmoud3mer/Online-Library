import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from 'src/core/schemas/book.schema';
import { BookDTO } from './bookdto/book.dto';
import { PaginationDTO } from './bookdto/pagination.dto';
import { Author } from 'src/core/schemas/author.schema';
import { Review } from 'src/core/schemas/review.schema';
import { Category } from 'src/core/schemas/category.schema';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name) private bookModel: Model<Book>,
        @InjectModel(Author.name) private authorModel: Model<Author>,
        @InjectModel(Review.name) private ReviewModel: Model<Review>,
        @InjectModel(Category.name) private CategoryModel: Model<Category>
    ) { }

    addNewBook = async (book: BookDTO, file: Express.Multer.File) => {
        // console.log(file);
        book.image = file.path;
        book.publishedDate = new Date()
        await this.bookModel.insertMany(book);
        return { message: "Success, Book Added.", data: book };
    }

    // ! All Books and Pagination
    getAllBooks = async (paginationDTO: PaginationDTO) => {
        const page = paginationDTO.page;
        const limit = paginationDTO.limit;
        const skip = (page - 1) * limit;
        const total = await this.bookModel.countDocuments().exec();
        try {
            const books = await this.bookModel
                .find()
                .limit(limit)
                .skip(skip)
                .populate('author', 'name _id email role')
                .populate('category', 'name image')
                .populate({
                    path: 'reviews',
                    populate: {
                        path: 'userId',
                        select: 'name'
                    }
                })

            return { 
                message: "Success, Get All Books.",
                results: books.length,
                metaData: {
                    currentPage: page,
                    numberOfPages: Math.ceil(total / limit),
                    limit
                },
                data: books };
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
    updateThisBook = async (bookId: string, book: any, user: any) => {
        try {
            const findBook = await this.bookModel.findById({ _id: bookId });

            if (!findBook) throw new HttpException('Fail, Book Not Found!', HttpStatus.BAD_REQUEST);


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
}
