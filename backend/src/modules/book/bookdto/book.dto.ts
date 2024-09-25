import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Length, Max, Min } from "class-validator"
import { Types } from "mongoose"

export class BookDTO {
    @IsString()
    @IsNotEmpty()
    @Length(3, 100)
    title: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0, { message: "Price must be positive number." })
    price: number;

    @IsDateString()
    @IsNotEmpty()
    @IsOptional()
    publishedDate: Date;
    
    @IsString()
    @IsOptional()
    @IsUrl()
    coverImage: string;
    
    @IsString()
    @IsNotEmpty()
    @Length(10, 500, { message: "description Minimum length 10 , Max 500" })
    @IsOptional()
    description: string;
    
    
    @IsNumber()
    @Min(0)
    @Max(5)
    @IsOptional()
    averageRating: number;
    
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @IsOptional()
    stock: number
    
    @IsNumber()
    @IsNotEmpty()
    @Min(0, { message: "Pages must be positive number." })
    @IsOptional()
    pages: number;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    category: Types.ObjectId;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    author: Types.ObjectId;
}