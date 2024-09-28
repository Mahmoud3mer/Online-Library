import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop({ required: true })
  fName: string;

  @Prop({ required: true })
  lName: string;

  @Prop({ required: false, default: '' })
  profilePic?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Prop({ required: false })
  phone?: string;

  @Prop({ type: String, default: null })
  verificationCode?: string;

  @Prop({ default: null })
  verificationExpiresAt?: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String, unique: true, sparse: true })
  googleId?: string;

  @Prop({ default: 'client' })
  loginMethod: string;

  @Prop({ type: String, default: null })
  resetToken?: string;

  @Prop({ type: Date, default: null })
  resetTokenExpiresAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
