import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Length, Max, Min } from "class-validator"
import { Types } from "mongoose"

export class BookDTO{
    @IsString()
    @IsNotEmpty()
    @Length(3,100)
    title: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0,{message: "Price must be positive number."})
    price: number;
    
    @IsDateString()
    @IsNotEmpty()
    @IsOptional()
    publishedDate: Date;

    @IsString()
    @IsUrl()
    coverImage: string;

    @IsString()
    @IsNotEmpty()
    @Length(10,500)
    description: string;


    @IsNumber()
    @Min(0)
    @Max(5)
    averageRating: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    stock: number

    @IsNumber()
    @IsNotEmpty()
    pages: number;

    @IsString()
    @IsNotEmpty()
    category: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    authorId: Types.ObjectId;
}