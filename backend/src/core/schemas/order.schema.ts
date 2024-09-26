import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class OrderItem {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  coverImage: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

// Define the schema
@Schema({ versionKey: false })
export class Order extends Document {
  // Extend Document
  @Prop({ required: false })
  orderId?: string;

  @Prop({ required: true })
  shippingAddress: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: String })
  orderDate: string;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ enum: ['Pending', 'Completed', 'Failed'], required: true })
  paymentStatus: 'Pending' | 'Completed' | 'Failed';

  @Prop({ enum: ['online', 'ondelivery'], default: 'online' })
  paymentMethod: 'online' | 'ondelivery';

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: false })
  phone?: string;

  @Prop({ required: false })
  name?: string;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: false })
  city?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Post-save hook to assign orderId to _id if orderId is not set
OrderSchema.post<Order>('save', function (doc) {
  if (!doc.orderId) {
    doc.orderId = doc._id.toString(); // Assign _id to orderId if not set
    doc.save(); // Save again to update orderId
  }
});
