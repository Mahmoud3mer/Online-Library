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
import { Role } from 'src/core/EnumRoles/role.enum';
import { Roles } from 'src/core/decorators/roles.decorator';
  
   
  @UseGuards(AuthGuard)
  @Controller('carts')
  export class CartController {
    constructor(private _cartService: CartService) {}
   
    @Post()
      @Roles(Role.User) 
    async createCart(@Body() body: UserDTO, @Req() req:any ) {   
        body["userId"] = req.user.userId;
      return await this._cartService.createCart(body);
    }
  
    @Get()
    @Roles(Role.User) 
    async getUserCart(@Body() body: UserDTO,@Req() req:any) {
      body["userId"] = req.user.userId;
         return await this._cartService.getCartByUserId(body);
    }
    @Post('addBook')
    @Roles(Role.User) 
    async addBookToCart(@Body() body: CartDTO,@Req() req:any) {
      body["userId"] = req.user.userId;
      return this._cartService.addToCart(body);
    }
   
    @Patch()
    @Roles(Role.User) 
    async updateCartQuantity(@Body() body: UpdateDTO,@Req() req:any) {
      body["userId"] = req.user.userId;
      return this._cartService.updateCartQuantity(body);
    }
  
  
    @Delete()
    @Roles(Role.User) 
    async removeBookFromCart(@Body() body: CartDTO,@Req() req:any) {
      body["userId"] = req.user.userId;
      return this._cartService.removeBookFromCart(body);
    }
  
    @Delete('clear')
    @Roles(Role.User) 
    async clearCart(@Body() body: UserDTO,@Req() req:any) {
      body["userId"] = req.user.userId;
      return await this._cartService.clearCart(body);
    }
  }