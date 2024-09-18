import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { Date } from 'mongoose';

export class StreamEventDTO {
  @IsString()
  @IsNotEmpty()
  streamTitle: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  author: string;

  @IsString()
  @IsNotEmpty()
  streamUrlCode: string;
  
  @IsDateString()
  @IsOptional()
  eventDate: Date;
}









