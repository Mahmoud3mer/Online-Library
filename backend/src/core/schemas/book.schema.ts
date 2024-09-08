import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";


@Schema({ timestamps: false, versionKey: false })
export class Book {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    publishedDate: Date;

    @Prop()
    image: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true })
    rating: number;

    @Prop({ required: true })
    stock: number;

    @Prop({ required: true })
    pages: number;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    authorId: Types.ObjectId;
}

export const BookSchema = SchemaFactory.createForClass(Book);
