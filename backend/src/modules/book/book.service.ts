import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from 'src/core/schemas/book.schema';
import { BookDTO } from './bookdto/book.dto';
import { PaginationDTO } from './bookdto/pagination.dto';

@Injectable()
export class BookService {
    constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

    addNewBook = async (book : BookDTO , file : Express.Multer.File) => {
        // console.log(file);
        book.image = file.path;
        book.publishedDate = new Date()
        await this.bookModel.insertMany(book);
        return {message: "Success, Book Added." , data: book};
    }

     // ! All Books and Pagination
    getAllBooks = async (paginationDTO: PaginationDTO) => {
        let page = paginationDTO.page;
        let limit = paginationDTO.limit;
        let skip = (page - 1) * limit
        try {
            let books = await this.bookModel.find().limit(limit).skip(skip).populate({path: 'authorId',select: 'name _id email role'});
            return {message: "Success, Get All Books." , data: books};
        } catch (error) {
            return {message: "Error fetching the books.", Error: error.message }
        }
    }

    getOneBook = async (id: string) => {
        try {
            let findBook = await this.bookModel.findOne({_id: id});
            if (!findBook) throw new HttpException('Fail, Book Not Found!', HttpStatus.BAD_REQUEST);

            return {message: "Success, Get Spesific Book." , data: findBook};
        } catch (error) {
            return {message: "Error fetching the book.", Error: error.message }
        }
    }

    // ! Pagination
    // paginationBooks = async (paginationDTO: PaginationDTO) => {
    //     let page = paginationDTO.page;
    //     let limit = paginationDTO.limit;
    //     let skip = (page - 1) * limit
    //     try {
    //         let books = await this.bookModel.find().limit(limit).skip(skip).populate({path: 'author',select: 'name _id email role'});
    //         return {message: "Success, Get All Books." , data: books};
    //     } catch (error) {
    //         return {message: "Error fetching the books.", Error: error.message }
    //     }
    // }

    updateThisBook = async (bookId : string , book: any , user: any) => {
        try {
            let findBook = await this.bookModel.findById({_id: bookId});

            if (!findBook) throw new HttpException('Fail, Book Not Found!', HttpStatus.BAD_REQUEST);

            // ! Check the owner of the book
            if (user.role !== 'auther' && user.userId !== findBook.authorId) {
                throw new HttpException('Unauthorized, You do not own this book.', HttpStatus.UNAUTHORIZED)
            }
            let updateBook = await this.bookModel.findByIdAndUpdate({_id: bookId} , {$set: book});
            return {message: "Success, Book Updated." ,data: updateBook};
        } catch (error) {
            return {message: "Error fetching the book.", Error: error.message }
        }
    }

    removeBook = async (bookId : string) => {
        try {
            let findBook = await this.bookModel.findByIdAndDelete({_id: bookId});
            if (!findBook) throw new HttpException('Fail, Book Not Found!', HttpStatus.BAD_REQUEST);
    
            return {message: "Success, Book Deleted." ,data: findBook};
        } catch (error) {
            return {message: "Error fetching the book.", Error: error.message }
        }

    }
}
