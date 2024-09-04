import {
    Controller,
    Post,
    Body,
    Get,
    Delete,
    Patch,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { CartService } from './cart.service';
  import { CartDTO, UpdateDTO } from './dto/cart.dto';
 
  import { AuthGuard } from 'src/core/guards/auth.guard';
import { UserDTO } from '../wishlist/dto/wishlist.dto';
  
   
  @UseGuards(AuthGuard)
  @Controller('carts')
  export class CartController {
    constructor(private _cartService: CartService) {}
  
    @Post()
    async createCart(@Body() body: UserDTO, @Req() req:any ) {
     console.log(req);
     
      return await this._cartService.createCart(body);
    }
  
    @Get()
    async getUserCart(@Body() body: UserDTO,@Req() req:any) {
         body["userId"]=req['userId']
         return await this._cartService.getCartByUserId(body);
    }
    @Post('addBook')
    async addBookToCart(@Body() body: CartDTO,@Req() req:any) {
      body["userId"]=req['userId']
      return this._cartService.addToCart(body);
    }
   
    @Patch()
    async updateCartQuantity(@Body() body: UpdateDTO,@Req() req:any) {
      body["userId"]=req['userId']
      return this._cartService.updateCartQuantity(body);
    }
  
  
    @Delete()
    async removeBookFromCart(@Body() body: CartDTO,@Req() req:any) {
      body["userId"]=req['userId']
      return this._cartService.removeBookFromCart(body);
    }
  
    @Delete('clear')
    async clearCart(@Body() body: UserDTO,@Req() req:any) {
      body["userId"]=req['userId']
      return await this._cartService.clearCart(body);
    }
  }
  