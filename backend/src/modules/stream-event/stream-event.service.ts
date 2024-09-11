import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StreamEvent } from '../../core/schemas/stream-event.schema';
import { StreamEventDTO } from './DTO/stream-event.DTO';
import { PaginationDTO } from '../book/bookdto/pagination.dto';

@Injectable()
export class StreamEventService {
    constructor(@InjectModel(StreamEvent.name) private streamEventModel: Model<StreamEvent>) { }

    async createStream(body: StreamEventDTO): Promise<StreamEvent> {
        const createdEvent = new this.streamEventModel(body);
        return createdEvent.save();
    }

    async getAllStreams(paginationDTO: PaginationDTO) {
        const { page, limit } = paginationDTO;
        const skip = (page - 1) * limit;
        const total = await this.streamEventModel.countDocuments().exec();
        const allStreams = await this.streamEventModel.find()
            .limit(limit)
            .skip(skip);
        return {
            message: 'Success, Got All Categories',
            results: allStreams.length,
            metaData: {
                currentPage: page,
                numberOfPages: Math.ceil(total / limit),
                limit,
            },
            data: allStreams,
        };
    }


    async findById(id: string) {
        return this.streamEventModel.findById(id).exec();
    }

    async updateStatus(id: string, body: StreamEventDTO): Promise<StreamEvent> {
        return this.streamEventModel.findByIdAndUpdate(id, body, { new: true }).exec();
    }

    async delete(id: string): Promise<StreamEvent> {
        return this.streamEventModel.findByIdAndDelete(id).exec();
    }
}
