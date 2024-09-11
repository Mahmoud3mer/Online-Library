import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';



@Schema({ timestamps: true, versionKey: false })
export class StreamEvent {
    @Prop({ required: false })
    streamTitle: string;

    @Prop({ required: false , type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }] })
    author: string;

    @Prop({ required: false })
    streamUrlCode: string;

    @Prop()
    description: string;

    @Prop()
    eventDate: Date;
}

export const StreamEventSchema = SchemaFactory.createForClass(StreamEvent);
