import { IsString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateStreamEventDTO {
  @IsString()
  @IsNotEmpty()
  streamTitle: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  
  authorId: Types.ObjectId;
}
