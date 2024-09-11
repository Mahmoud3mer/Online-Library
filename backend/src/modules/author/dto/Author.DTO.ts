import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class AuthorDTO {

    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsOptional()
    bio: string
}