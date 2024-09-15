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
    let wishlist = await this.wishlistModel
      .findOne({ user: userId })
      .populate({
        path: 'books',
        model: 'Book',
        populate: [
            { path: 'category', model: 'Category' },  
            { path: 'author', model: 'Author' }  
        ]
    });
 
  
    
      if (!wishlist) {
        wishlist = new this.wishlistModel({
          user: userId,
          books: [],  
        });
    
        
        await wishlist.save();
      }
    return {
      message: 'Wishlist retrieved successfully',
      data: wishlist,
    };
  }


  async addToWishlist(addBookDTO: WishListDTO) {
    const { userId, bookId } = addBookDTO;
  
    // 1. Check if the book exists in the database
    const book = await this.bookModel.findById(bookId);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
  
    // 2. Find the wishlist for the user by userId
    let wishlist = await this.wishlistModel.findOne({ user: userId });
  
    // 3. If the wishlist doesn't exist, create a new one with the book
    if (!wishlist) {
      wishlist = new this.wishlistModel({
        user: userId,
        books: [bookId],  // Add the book to the new wishlist
      });
    } else {
      // 4. If the wishlist exists, check if the book is already in it
      const existingBook = wishlist.books.find(
        (id) => id.toString() === bookId.toString()  // Compare bookId directly with ids in wishlist.books
      );
  
      // 5. If the book is already in the wishlist, return a message
      if (existingBook) {
        return {
          message: 'Book is already in the wishlist',
          data: wishlist,
        };
      } else {
        // 6. If the book is not in the wishlist, add it
        wishlist.books.push(bookId);
      }
    }
  
    // 7. Save the updated wishlist
    await wishlist.save();
  
    // 8. Return the updated wishlist with populated book details
    return {
      message: 'Book added to wishlist successfully',
      data: await this.wishlistModel
        .findOne({ user: userId })
        .populate({
          path: 'books',
          model: 'Book',
          populate: [
              { path: 'category', model: 'Category' }, // Populate category details
              { path: 'author', model: 'Author' } // Populate author details
          ]
      })
    };
  }
  
  
  async removeFromWishlist(removeBookDTO: WishListDTO) {
    const { userId, bookId } = removeBookDTO;
  
    // Find the wishlist for the user
    const wishlist = await this.wishlistModel.findOne({ user: userId });
  
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found for this user.');
    }
  
    // Check if the book is in the wishlist
    const bookIndex = wishlist.books.findIndex(
      (id) => id.toString() === bookId.toString()
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
        .populate({
          path: 'books',
          model: 'Book',
          populate: [
              { path: 'category', model: 'Category' }, // Populate category details
              { path: 'author', model: 'Author' } // Populate author details
          ]
      })
   // Populate the books field
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
 

  
 
 