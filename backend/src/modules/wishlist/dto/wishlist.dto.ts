import {  IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
 

export class UserDTO {
  @IsMongoId()
  userId: Types.ObjectId;   
}


export class WishListDTO {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsMongoId()
  bookId: Types.ObjectId;
}