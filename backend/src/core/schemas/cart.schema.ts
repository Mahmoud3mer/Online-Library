import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Book } from 'src/core/schemas/book.schema';

@Schema({ timestamps: true, versionKey: false })
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Prop([
    {
      book: {
        type: mongoose.Schema.Types.ObjectId || Book,
        ref: 'Book',
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ])
  books: { book: mongoose.Types.ObjectId | Book; quantity: number }[];

  @Prop({ type: Number, default: 0 })
  subtotal: number;

  @Prop({ type: Number, default: 0 })
  numOfCartItems: number;

  @Prop({ type: Number, default: 0 })
  shippingCost: number;

  @Prop({ type: Number, default: 0 })
  totalOrder: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
