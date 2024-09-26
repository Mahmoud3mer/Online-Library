import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema({ timestamps: false, versionKey: false })
export class Book {
    @Prop({ required: true, minlength: 3, maxlength: 100, index: 1 })
    title: string;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop({ required: true, min: 0 })
    publishedDate: Date;

    @Prop({ required: true, default: "" })
    coverImage: string;

    @Prop({ required: true, minlength: 10, maxlength: 500 })
    description: string;

    @Prop({ required: true, min: 0, max: 5, default: 0 })
    averageRating: number;

    @Prop({ required: true, min: 0 })
    stock: number;

    @Prop({ required: true, min: 0 })
    pages: number;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }] })
    reviews: Types.ObjectId[];

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Category", index: 1 })
    category: Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Author', index: 1 })
    author: Types.ObjectId;
}

export const BookSchema = SchemaFactory.createForClass(Book);
