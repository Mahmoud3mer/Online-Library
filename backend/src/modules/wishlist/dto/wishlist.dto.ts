import {  IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
 

export class UserDTO {
  @IsMongoId()
  @IsOptional()
  userId: Types.ObjectId;   
}


export class WishListDTO {
  @IsMongoId()
  @IsOptional()
  userId: Types.ObjectId;

  @IsMongoId()
  bookId: Types.ObjectId;
}

