/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from 'src/core/schemas/author.schema';
import { AuthorDTO } from './dto/Author.DTO';
import { PaginationDTO } from '../book/bookdto/pagination.dto';

@Injectable()
export class AuthorService {

    constructor(@InjectModel(Author.name) private authorModel: Model<Author> // Inject Author model
){}

addNewAuthor = async (body: AuthorDTO) => {
    try {
        const newAuthor = await this.authorModel.create(body);
        return { message: 'Added New Author', newAuthor };
    } catch (error) {
        throw new HttpException('Failed to add author', HttpStatus.BAD_REQUEST);
    }
};

getAllAuthors = async (paginationDTO: PaginationDTO) => {
    const { page, limit } = paginationDTO;
    const skip = (page - 1) * limit;
    const total = await this.authorModel.countDocuments().exec();
    const allAuthors = await this.authorModel.find().limit(limit).skip(skip);
    return {
        message: 'Success, Got All Authors',
        results: allAuthors.length,
        metaData: {
            currentPage: page,
            numberOfPages: Math.ceil(total / limit),
            limit,
        },
        data: allAuthors,
    };
};

getAuthorById = async (authorId: string) => {
    const author = await this.authorModel.findById(authorId);
    if (!author) throw new HttpException('Author Not Found', HttpStatus.NOT_FOUND);
    return { message: 'Success, Got Needed Author', author };
};

updateAuthor = async (authorId: string, author: AuthorDTO) => {
    try {
        const updatedAuthor = await this.authorModel.findByIdAndUpdate(
            authorId,
            { $set: author },
            { new: true },
        );
        if (!updatedAuthor) throw new HttpException('Author Not Found', HttpStatus.NOT_FOUND);
        return { message: 'Success, Author Updated', data: updatedAuthor };
    } catch (error) {
        throw new HttpException('Error updating the author', HttpStatus.BAD_REQUEST);
    }
};

deleteAuthor = async (authorId: string) => {
    try {
        const author = await this.authorModel.findByIdAndDelete(authorId);
        if (!author) throw new HttpException('Author Not Found', HttpStatus.NOT_FOUND);
        return { message: 'Success, Author Deleted', data: author };
    } catch (error) {
        throw new HttpException('Error deleting the author', HttpStatus.BAD_REQUEST);
    }
};
}
