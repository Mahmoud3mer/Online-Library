import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema({ timestamps: false, versionKey: false })
export class Book {
    @Prop({ required: true, index: 1 })
    title: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    publishedDate: Date;

    @Prop()
    coverImage: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    averageRating: number;

    @Prop({ required: true })
    stock: number;

    @Prop({ required: true })
    pages: number;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }] })
    reviews: Types.ObjectId[];

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Category", index: 1 })
    category: Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Author', index: 1 })
    author: Types.ObjectId;
}

export const BookSchema = SchemaFactory.createForClass(Book);
