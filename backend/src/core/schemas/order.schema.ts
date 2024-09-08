import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Define the schema
@Schema({ versionKey: false })
export class Order {
  @Prop({ required: true })
  shippingAddress: string;

  @Prop({ unique: true })
  orderId: string;

  @Prop({ required: true })
  bookId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: String })
  orderDate: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ enum: ['Pending', 'Completed', 'Failed'], required: true })
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Pre-save  to generate unique order ID and order date when a new order is created
OrderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.orderId = this._id.toString();
    this.orderDate = new Date().toLocaleString();
  }
  next();
});
