import {IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
  


export class CreateCartDTO {
  @IsMongoId()
  userId: Types.ObjectId;   
}
    

export class CartDTO {
  @IsMongoId()
  @IsOptional()
  userId: Types.ObjectId;

  @IsMongoId()
  bookId: Types.ObjectId;
}
export class UpdateDTO {
  @IsMongoId()
  @IsOptional()
  userId: Types.ObjectId;

  @IsMongoId()
  bookId: Types.ObjectId;

  @IsNumber()
  quantity:number
}