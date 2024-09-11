import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { Date, Types } from 'mongoose';

export class StreamEventDTO {
  @IsString()
  @IsNotEmpty()
  streamTitle: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  authorId: Types.ObjectId;

  @IsString()
  @IsOptional()
  streamUrlCode: string;

  @IsDate()
  eventDate: Date;
}









