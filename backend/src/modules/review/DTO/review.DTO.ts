import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";


export class reviewDTO {

    @IsMongoId()
    userId: string;

    @IsMongoId()
    bookId: string;
    
    @IsNumber()
    rating: number;

    @IsString()
    @IsOptional()
    comment: string;
}