import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type StreamEventDocument = StreamEvent & Document;

@Schema({ timestamps: true, versionKey: false })
export class StreamEvent {
    
    @Prop({ required: true })
    streamTitle: string;

    @Prop({ required: false })
    author: string;

    @Prop({ required: false })
    streamUrlCode: string;

    @Prop({required: true})
    description: string;

    @Prop({required: false})
    eventDate: string;
}

export const StreamEventSchema = SchemaFactory.createForClass(StreamEvent);


StreamEventSchema.pre('save', function (next) {
    const stream = this as StreamEventDocument;
    
    if (stream.eventDate) {
        // Format the eventDate to MM/DD/YYYY, HH:MM AM/PM before saving
        const formattedDate = new Date(stream.eventDate).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        stream.eventDate = formattedDate;
    }

    next();
});