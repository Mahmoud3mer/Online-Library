import {IsMongoId, IsNumber } from 'class-validator';
import { Types } from 'mongoose';
  


export class CreateCartDTO {
  @IsMongoId()
  userId: Types.ObjectId;   
}

 

export class CartDTO {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsMongoId()
  bookId: Types.ObjectId;
}
export class UpdateDTO {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsMongoId()
  bookId: Types.ObjectId;

  @IsNumber()
  quantity:number
}