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
            book.coverImage = '';
        }
        // console.log(file);
        // book.coverImage = file.path;
        const pages = Number(book.pages);
        const price = Number(book.price);
        const stock = Number(book.stock);

        if (isNaN(pages) || pages < 0) {
            throw new HttpException('Invalid pages count. Pages must be a valid number greater than 0.', HttpStatus.BAD_REQUEST);
        }

        if (isNaN(price) || price < 0) {
            throw new HttpException('Invalid price. Price must be a valid number greater than 0.', HttpStatus.BAD_REQUEST);
        }
        if (isNaN(stock) || stock < 0) {
            throw new HttpException('Invalid Stock. Stock must be a valid number greater than 0.', HttpStatus.BAD_REQUEST);
        }
        book.pages = pages;
        book.price = price;
        book.stock = stock;

        book.publishedDate = new Date()
        try {
            await this.bookModel.insertMany(book);
            return { message: "Success, Book Added.", data: book };

        } catch (error) {
            throw new HttpException(`Error Inserting Data ${error}`, HttpStatus.BAD_REQUEST)
        }
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
        // Trim and validate page and limit
        const page = Math.max(1, parseInt(paginationDTO.page.toString(), 10) || 1); // Ensure page is at least 1
        const limit = Math.min(Math.max(1, parseInt(paginationDTO.limit.toString(), 10) || 10), 100); // Limit between 1 and 100
    
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
    updateThisBook = async (bookId: string, book: BookDTO, user: any, file: Express.Multer.File) => {


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
            book.coverImage = imgRes['secure_url'];
        }


        if (book.pages) {
            const pages = Number(book.pages);
            if (isNaN(pages) || pages < 0) {
                throw new HttpException('Invalid pages count. Pages must be a valid number greater than 0.', HttpStatus.BAD_REQUEST);
            }
            book.pages = pages;
        }

        if (book.price) {
            const price = Number(book.price);
            if (isNaN(price) || price < 0) {
                throw new HttpException('Invalid price. Price must be a valid number greater than 0.', HttpStatus.BAD_REQUEST);
            }
            book.price = price;
        }

        if (book.stock) {
            const stock = Number(book.stock);
            if (isNaN(stock) || stock < 0) {
                throw new HttpException('Invalid Stock. Stock must be a valid number greater than 0.', HttpStatus.BAD_REQUEST);
            }
            book.stock = stock;
        }

        const updateBook = await this.bookModel.findByIdAndUpdate(
            { _id: bookId },
            { $set: book },
            { new: true }
        ).populate('author')
            .populate('category');

        return { message: "Success, Book Updated.", data: updateBook };

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



    async findByAuthorOrTitle(paginationDTO: PaginationDTO, author: string, title: string) {
        const page = paginationDTO.page;
        const limit = paginationDTO.limit;
        const skip = (page - 1) * limit;

        const query = {};

        // Search by title if provided
        if (title && title.trim() !== '') {
            query['title'] = { $regex: title.trim(), $options: 'i' };
        }

        // Search by author name if provided
        if (author && author.trim() !== '') {
            // Find authors by the provided name
            const authors = await this.authorModel.find({ name: { $regex: author.trim(), $options: 'i' } }).exec();
            if (authors.length > 0) {
                // Extract the author _id values
                const authorIds = authors.map(a => a._id);
                query['author'] = { $in: authorIds };  // Use author _id(s) to filter books
            } else {
                // If no authors match, return empty results
                return {
                    message: "No books found for the specified author.",
                    results: 0,
                    metaData: {
                        currentPage: page,
                        numberOfPages: 0,
                        limit
                    },
                    data: []
                };
            }
        }

        const total = await this.bookModel.countDocuments(query).exec();
        console.log(query);

        try {
            const foundedBooks = await this.bookModel
                .find(query)
                .limit(limit)
                .skip(skip)
                .populate('author') // Ensure the author is populated
                .populate('category') // Populate category
                .populate({
                    path: 'reviews',
                    populate: {
                        path: 'userId',
                        select: 'fName lName profilePic'  // Select only specific fields from User model
                    }
                })
                .exec();

            return {
                message: "Success, Got Books.",
                results: foundedBooks.length,
                metaData: {
                    currentPage: page,
                    numberOfPages: Math.ceil(total / limit),
                    limit
                },
                data: foundedBooks
            };
        } catch (error) {
            return { message: "Error fetching the books.", Error: error.message };
        }
    }

    //update stock
    async updateStock(books: { bookId: string, quantity: number }[]) {
        try {
            // Step 1: Fetch all required books in a single query
            const bookIds = books.map(b => b.bookId);
            const existingBooks = await this.bookModel.find({ _id: { $in: bookIds } });

            // Step 2: Create a map for quick lookup
            const bookMap = new Map(existingBooks.map(book => [book._id.toString(), book]));

            // Step 3: Prepare bulk operations
            const bulkOperations = books.map(orderedBook => {
                const { bookId, quantity } = orderedBook;
                const book = bookMap.get(bookId);

                if (!book) {
                    throw new HttpException(`Book with ID ${bookId} not found`, HttpStatus.NOT_FOUND);
                }

                if (book.stock < quantity) {
                    throw new HttpException(`Insufficient stock for book: ${book.title}`, HttpStatus.BAD_REQUEST);
                }

                return {
                    updateOne: {
                        filter: { _id: bookId },
                        update: { $inc: { stock: -quantity } } // Decrease stock
                    }
                };
            });

            // Step 4: Execute bulkWrite
            const result = await this.bookModel.bulkWrite(bulkOperations);

            // Step 5: Check modified count
            if (result.modifiedCount === 0) {
                throw new HttpException(`No stock updates were made.`, HttpStatus.BAD_REQUEST);
            }

            return { message: "Success, stock updated." };

        } catch (error) {
            // Additional error handling for bulkWrite can be added here
            throw new HttpException(`Error updating stock: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //check stock
    async checkStock(booksInCart: { bookId: string; quantity: number }[]) {
        const outOfStockBooks = [];

        try {
            // Step 1: Fetch all required books in a single query
            const bookIds = booksInCart.map(book => book.bookId);
            const existingBooks = await this.bookModel.find({ _id: { $in: bookIds } });

            // Step 2: Create a map for quick lookup
            const bookMap = new Map(existingBooks.map(book => [book._id.toString(), book]));

            // Step 3: Check the stock for each book
            for (const book of booksInCart) {
                const { bookId, quantity } = book;
                const bookDetails = bookMap.get(bookId);

                // Check if there is enough stock
                if (bookDetails && bookDetails.stock < quantity) {
                    outOfStockBooks.push({
                        bookId: bookId,
                        bookTitle: bookDetails.title, // Include title for better feedback
                        availableStock: bookDetails.stock // Optional: include available stock
                    });
                }
            }

            // Determine if all books are in stock
            const inStock = outOfStockBooks.length === 0;

            return {
                inStock,
                outOfStockBooks,
            };
        } catch (error) {
            throw new HttpException(`Error checking stock: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }






}