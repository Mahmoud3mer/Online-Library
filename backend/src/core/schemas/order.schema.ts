import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
export class Order {
  @Prop({ unique: true })
  orderId: string;

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

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
