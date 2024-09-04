import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps: true, versionKey: false})
export class Review {

    @Prop({required: true})
    userId: string;
    
    @Prop({required: true})
    bookId: string;
    
    @Prop({required: true})
    rating: number;
    
    @Prop({required: false})
    comment: string;

    // date: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review)