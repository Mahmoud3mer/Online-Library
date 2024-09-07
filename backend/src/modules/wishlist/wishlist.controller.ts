import { Controller, Post, Body ,Get, Delete, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import {UserDTO, WishListDTO } from './dto/wishlist.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
 
 
@UseGuards(AuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private _wishlistService: WishlistService) {}

  @Post()
  async createWishlist(@Body() body: UserDTO,@Req() req:any) {
    body["userId"]=req['userId']
      return  this._wishlistService.createWishlist(body);
  }

  @Get()
  async getWishlist(@Body() body: UserDTO,@Req() req:any) {
    body["userId"]=req['userId']
      return await this._wishlistService.getWishlistByUserId(body);
  }

  @Post('addBook')
  async addBookToWishlist(@Body() body: WishListDTO,@Req() req:any) {
    body["userId"]=req['userId']
    return this._wishlistService.addToWishlist(body);
  }
  @Delete()
  async removeBookFromWishlist(@Body() body: WishListDTO,@Req() req:any) {
    body["userId"]=req['userId']
    return await this._wishlistService.removeFromWishlist(body);
  }
  @Delete("clear")
  async clearWishlist(@Body() body: UserDTO,@Req() req:any) {
    body["userId"]=req['userId']
    return this._wishlistService.clearWishlist(body);
  }
}
