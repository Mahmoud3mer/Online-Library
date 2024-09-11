import { Transform } from "class-transformer"
import { IsNumber, IsOptional, IsPositive } from "class-validator"

export class PaginationDTO{
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    limit: number; 

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    page: number;
}