import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";


@Schema({ timestamps: true, versionKey: false })
export class Review {

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
    userId: Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Book" })
    bookId: Types.ObjectId;

    @Prop({ required: true })
    rating: number;

    @Prop({ required: false })
    comment: string;

@Prop({ required: true })
    date: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review)