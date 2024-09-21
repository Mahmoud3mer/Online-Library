import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class AuthorDTO {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    image: string;
    
    @IsString()
    @IsOptional()
    bio: string
}