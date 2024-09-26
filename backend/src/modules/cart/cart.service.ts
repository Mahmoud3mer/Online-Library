import {
    Injectable,
    NotFoundException,
    ConflictException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
 
  import { Book } from 'src/core/schemas/book.schema';
  
  import { CartDTO, UpdateDTO } from './dto/cart.dto';
  import { Cart } from 'src/core/schemas/cart.schema';
  import { UserDTO } from '../wishlist/dto/wishlist.dto';
    
  
  @Injectable()
  export class CartService {
    constructor(
      @InjectModel(Cart.name) private cartModel: Model<Cart>,
      @InjectModel(Book.name) private bookModel: Model<Book>,
    ) {}

    calculateShipping(subtotal: number): number {
      if(subtotal==0)  return 0;
      const shippingCost = subtotal < 500 ? 80 : 120;
      return parseFloat(shippingCost.toFixed(2)); // Format to two decimal plac
    }
    calculateTotalOrder(subtotal: number, shippingCost: number): number {
      if (subtotal==0) return 0;
      const totalOrder = subtotal + shippingCost;
      return parseFloat(totalOrder.toFixed(2));
    }
  
    async createCart(userDTO: UserDTO) {
      const { userId } = userDTO;
  
      const existingCart = await this.cartModel.findOne({ user: userId });
  
      if (existingCart) {
        throw new ConflictException('Cart already exists for this user.');
      }
  
      const newCart = new this.cartModel({
        user: userId,
        books: [],
        subtotal: 0,
        numOfCartItems: 0,
        totalOrder: 0,
      });
  
      await newCart.save();
  
      return {
        message: 'Cart created successfully',
        data: newCart,
      };
    }
    
    async getCartByUserId(userDTO: UserDTO) {
      const { userId } = userDTO;

      // Find the cart and populate book details along with category and author
      let cart = await this.cartModel.findOne({ user: userId }).populate({
          path: 'books.book',
          model: 'Book',
          populate: [

              { path: 'category', model: 'Category' },  
              { path: 'author', model: 'Author' }  
          ]
      });
  
      if (!cart) {

          cart = new this.cartModel({
              user: userId,
              books: [],
              subtotal: 0,
              numOfCartItems: 0,
              shippingCost:0,
              totalOrder: 0,
          });
  
       
      }else{
        cart.shippingCost = this.calculateShipping(cart.subtotal);
        cart.totalOrder = this.calculateTotalOrder(cart.subtotal, cart.shippingCost);
      }
     await cart.save();  
      return {
          message: 'Cart retrieved successfully',
          data: cart,
      };
  }
  
    
    async addToCart(cartDTO: CartDTO) {
      const { userId, bookId } = cartDTO;
      const book = await this.bookModel.findById(bookId);
      if (!book) {
        throw new NotFoundException('Book not found');
      }

      let cart = await this.cartModel.findOne({ user: userId });
    
      if (!cart) {
        cart = new this.cartModel({
          user: userId,
          books: [{ book: bookId, quantity: 1 }],
          subtotal: parseFloat(book.price.toFixed(2)),
          numOfCartItems: 1,
          shippingCost: this.calculateShipping(book.price), 
          totalOrder: this.calculateTotalOrder(book.price, this.calculateShipping(book.price))
        });
      } else {
        // Check if the book already exists in the cart
        const existingBook = cart.books.find(
          (book) => book.book.toString() === bookId.toString()
        );
    
        if (existingBook) {
          // If the book is already in the cart, return a message without adding it again
          return {
            message: 'Book is already in the cart',
            data: cart,
          };
        } else {
          // If the book is not in the cart, add it to the cart
          cart.books.push({ book: bookId, quantity: 1 });
          
          // Update total price and number of items
          cart.subtotal = parseFloat((cart.subtotal + book.price).toFixed(2));
          cart.numOfCartItems += 1;
          cart.shippingCost = this.calculateShipping(cart.subtotal);
          cart.totalOrder = this.calculateTotalOrder(cart.subtotal, cart.shippingCost);
        }
      }
    
      // Save the updated cart
      await cart.save();
      await cart.populate({
        path: 'books.book',
        model: 'Book',
        populate: [
            { path: 'category', model: 'Category' }, // Populate category details
            { path: 'author', model: 'Author' } // Populate author details
        ]
    })
    
      return {
        message: 'Book added to cart successfully',
        data: cart,
      };
    }


    
    async updateCartQuantity(updateDTO: UpdateDTO) {
    
      const { userId, bookId, quantity } = updateDTO;
        
      const cart = await this.cartModel.findOne({ user: userId });
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
    
      const existingBook = cart.books.find(
        (book) => book.book.toString() === bookId.toString()
      );
      if (!existingBook) {
        throw new NotFoundException('Book not found in cart');
      }
    
      if (quantity <= 0) {
        cart.books = cart.books.filter(
          (book) => book.book.toString() !== bookId.toString(),
        );
      } else {
        existingBook.quantity = quantity;
      }
    
          await cart.populate({
        path: 'books.book',
        model: 'Book',
        populate: [
            { path: 'category', model: 'Category' }, // Populate category details
            { path: 'author', model: 'Author' } // Populate author details
        ]
    })
 
     
      let subtotal = 0;
      let numOfCartItems = 0;
    
     
    for (const cartBook of cart.books) {
      const populatedBook = cartBook.book as Book; // Type assertion
      subtotal += populatedBook.price * cartBook.quantity;
      numOfCartItems += cartBook.quantity;
    }
  
    
      cart.subtotal = parseFloat(subtotal.toFixed(2));
      cart.numOfCartItems = numOfCartItems;
      cart.shippingCost = this.calculateShipping(subtotal);
      cart.totalOrder = this.calculateTotalOrder(subtotal, cart.shippingCost);
      await cart.save();
    
      return {
        message: 'Cart updated successfully',
        data: cart,
      };
    }
    
    
   
    async removeBookFromCart(cartDTO: CartDTO) {
      const { userId, bookId } = cartDTO;
    
      
      const cart = await this.cartModel.findOne({ user: userId });
    
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
    
    
      const existingBookIndex = cart.books.findIndex(
        (item) => item.book.toString() === bookId.toString()
      );
    
      if (existingBookIndex === -1) {
        throw new NotFoundException('Book not found in cart');
      }
    
      
      cart.books.splice(existingBookIndex, 1);
   
      await cart.populate({
        path: 'books.book',
        model: 'Book',
        populate: [
            { path: 'category', model: 'Category' }, // Populate category details
            { path: 'author', model: 'Author' } // Populate author details
        ]
    })
       
      let subtotal = 0;
      let numOfCartItems = 0;
    
      for (const item of cart.books) {
        const book = item.book as Book;  
        subtotal += book.price * item.quantity;
        numOfCartItems += item.quantity;
      }
    
      // Update the cart with the new totals
      cart.subtotal = parseFloat(subtotal.toFixed(2));
      cart.numOfCartItems = numOfCartItems;
      cart.shippingCost = this.calculateShipping(subtotal);
      cart.totalOrder = this.calculateTotalOrder(subtotal, cart.shippingCost);
      // Save the updated cart
      await cart.save();
    
      return {
        message: 'Book removed from cart successfully',
        data: cart,
      };
    }
    
    
    
    
    async clearCart(userDTO: UserDTO) {
      const { userId } = userDTO;
  
   
      const cart = await this.cartModel.findOne({ user: userId });
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
  
      
      cart.books = [];
      cart.subtotal = 0;
      cart.numOfCartItems = 0;
      cart.shippingCost = 0; 
      cart.totalOrder = 0;
      await cart.save();
  
      return {
        message: 'Cart cleared successfully',
        data: cart,
      };
    }
    
  
   
  }
  