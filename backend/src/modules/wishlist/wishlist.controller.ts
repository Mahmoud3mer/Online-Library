import { Controller, Post, Body ,Get, Delete, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import {UserDTO, WishListDTO } from './dto/wishlist.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Role } from 'src/core/EnumRoles/role.enum';
import { Roles } from 'src/core/decorators/roles.decorator';
 
 
@UseGuards(AuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private _wishlistService: WishlistService) {}

  @Post()
  @Roles(Role.User) 
  async createWishlist(@Body() body: UserDTO,@Req() req:any) {
    body["userId"] = req.user.userId;
      return  this._wishlistService.createWishlist(body);
  }

  @Get()
  @Roles(Role.User) 
  async getWishlist(@Body() body: UserDTO,@Req() req:any) {
    body["userId"] = req.user.userId;
      return await this._wishlistService.getWishlistByUserId(body);
  }

  @Post('addBook')
  @Roles(Role.User) 
  async addBookToWishlist(@Body() body: WishListDTO,@Req() req:any) {
    body["userId"] = req.user.userId;
    return this._wishlistService.addToWishlist(body);
  }
  @Delete()
  @Roles(Role.User) 
  async removeBookFromWishlist(@Body() body: WishListDTO,@Req() req:any) {
    body["userId"] = req.user.userId;
    return await this._wishlistService.removeFromWishlist(body);
  }
  @Delete("clear")
  @Roles(Role.User) 
  async clearWishlist(@Body() body: UserDTO,@Req() req:any) {
    body["userId"] = req.user.userId;
    return this._wishlistService.clearWishlist(body);
  }
}
