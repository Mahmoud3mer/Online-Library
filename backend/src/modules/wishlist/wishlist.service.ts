import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
 
 
import { Book } from 'src/core/schemas/book.schema';
import { UserDTO, WishListDTO } from './dto/wishlist.dto';
import { Wishlist } from 'src/core/schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private readonly wishlistModel: Model<Wishlist>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) {}

  async createWishlist(userDTO: UserDTO) {
    const { userId } = userDTO;
    const existingWishlist = await this.wishlistModel.findOne({ user: userId });

    if (existingWishlist) {
      throw new ConflictException('Wishlist already exists for this user.');
    }

    const newWishlist = new this.wishlistModel({
      user: userId,
      books: [],
    });

    await newWishlist.save();

    return {
      message: 'Wishlist created successfully',
      data: newWishlist,
    };
  }

  async getWishlistByUserId(userDTO: UserDTO) {
    const { userId } = userDTO;
    const wishlist = await this.wishlistModel
      .findOne({ user: userId })
      .populate('books') // Populate the books field
      .exec();
    
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found for this user.');
    }

    return {
      message: 'Wishlist retrieved successfully',
      data: wishlist,
    };
  }


  async addToWishlist(addBookDTO: WishListDTO) {
    const { userId, bookId } = addBookDTO;

    // Check if the book exists
    const book = await this.bookModel.findById(bookId);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Find the wishlist for the user
    let wishlist = await this.wishlistModel.findOne({ user: userId }) 

    if (!wishlist) {
      // If wishlist doesn't exist, create a new one
      wishlist = new this.wishlistModel({
        user: userId,
        books: [bookId],
      });
    } else {
      // Check if the book already exists in the wishlist
      const existingBook = wishlist.books.find(
        (book) => book._id.toString() === bookId.toString()
      );

      if (existingBook) {
        throw new ConflictException('Book is already in the wishlist.');
      } else {
        // If book doesn't exist, add it to the wishlist
        wishlist.books.push(bookId);
      }
    }

    // Save the updated wishlist
    await wishlist.save();

    return {
      message: 'Book added to wishlist successfully',
      data: await this.wishlistModel
        .findOne({ user: userId })
        .populate('books') // Populate the books field
        .exec(),
    };
  }

  
  async removeFromWishlist(removeBookDTO: WishListDTO) {
    const { userId, bookId } = removeBookDTO;

    // Find the wishlist for the user
    const wishlist = await this.wishlistModel.findOne({ user: userId }) 

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found for this user.');
    }

    // Check if the book is in the wishlist
    const bookIndex = wishlist.books.findIndex(
      (book) => book._id.toString() === bookId.toString()
    );

    if (bookIndex === -1) {
      throw new NotFoundException('Book not found in the wishlist.');
    }

    // Remove the book from the wishlist
    wishlist.books.splice(bookIndex, 1);

    // Save the updated wishlist
    await wishlist.save();

    return {
      message: 'Book removed from wishlist successfully',
      data: await this.wishlistModel
        .findOne({ user: userId })
        .populate('books') // Populate the books field
        .exec(),
    };
  }

 
  async clearWishlist(userDTO: UserDTO) {
    const { userId } = userDTO;

    // Find the wishlist for the user
    const wishlist = await this.wishlistModel.findOne({ user: userId });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found for this user.');
    }

    // Clear the books array
    wishlist.books = [];

    // Save the updated wishlist
    await wishlist.save();

    return {
      message: 'Wishlist cleared successfully',
      data: wishlist,
    };
  }


}
 

  
 
 