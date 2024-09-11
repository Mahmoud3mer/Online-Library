import { IsMongoId, IsArray, IsOptional, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRecommendationDTO {
    @IsMongoId()
    @IsOptional()
    userId: Types.ObjectId;

    @IsArray()
    categories: string[];
}
export class RecommendationDTO {
    @IsMongoId()
    @IsOptional()
    userId: Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    category:Types.ObjectId;
}
    