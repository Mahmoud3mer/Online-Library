import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class AuthorDTO {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    image?: string;
    
    @IsString()
    @IsOptional()
    bio: string
}