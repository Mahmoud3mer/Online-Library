import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
 

@Schema({ timestamps: true, versionKey: false })
export class Wishlist extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }])
  books: mongoose.Types.ObjectId[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
