import { IsDateString, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";


export class reviewDTO {
    @IsMongoId()
    @IsOptional()
    userId: string;

    @IsMongoId()
    @IsOptional()
    bookId: string;
    
    @IsNumber()
    rating: number;

    @IsString()
    @IsOptional()
    comment: string;

    @IsDateString()
    @IsOptional()
    date: Date;

}