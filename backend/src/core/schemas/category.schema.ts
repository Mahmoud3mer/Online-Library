import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps: true, versionKey: false})
export class Category {

    @Prop({required: true, unique: true})
    name: string

    @Prop({required: false})
    image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
