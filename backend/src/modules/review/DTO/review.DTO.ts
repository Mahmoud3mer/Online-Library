import { IsDateString, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";


export class reviewDTO {

    @IsMongoId()
    userId: string;

    @IsMongoId()
    bookId: string;
    
    @IsNumber()
    raiting: number;

    @IsString()
    @IsOptional()
    comment: string;

    @IsDateString()
    @IsOptional()
    date: Date;

}