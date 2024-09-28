// src/books/dto/book.dto.ts
import { IsNumber, IsString } from 'class-validator';
import { IsArray, IsNotEmpty } from 'class-validator';

export class OrderedBookDto {
    @IsString()
    bookId: string;

    @IsNumber()
    quantity: number;
}
 
 

export class UpdateStockDto {
    @IsArray()
    @IsNotEmpty()
    books: OrderedBookDto[];  
}
