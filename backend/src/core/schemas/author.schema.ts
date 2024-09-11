import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: true, versionKey: false})
export class Author {
    
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    bio: string;

}

export const AuthorSchema = SchemaFactory.createForClass(Author);
