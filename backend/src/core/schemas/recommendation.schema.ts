import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

 
@Schema({ timestamps: true, versionKey: false })
export class Recommendation  {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }])
  recommendedCategories: mongoose.Types.ObjectId[];
}
 
export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);
