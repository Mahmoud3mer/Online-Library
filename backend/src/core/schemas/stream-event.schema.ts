import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';


export type StreamEventDocument = StreamEvent & Document;

@Schema({ timestamps: true, versionKey: false })
export class StreamEvent {
    @Prop({ required: false })
    streamTitle: string;

    @Prop({ required: false , type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    authorId: string;

    @Prop({ required: false })
    streamUrl: string;

    @Prop()
    description: string;

    @Prop()
    eventDate: Date;

    @Prop({ enum: ['Pending', 'Approved', 'Declined'], default: 'Pending' })
    status: string;

    @Prop()
    approvedBy: string;
}

export const StreamEventSchema = SchemaFactory.createForClass(StreamEvent);
