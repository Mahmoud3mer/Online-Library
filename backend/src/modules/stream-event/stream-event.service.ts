import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StreamEvent } from 'src/core/schemas/stream-event.schema';
import { CreateStreamEventDTO } from './DTO/create-stream-event.DTO';
import { UpdateStreamEventStatusDTO } from './DTO/update-stream-event.DTO';

@Injectable()
export class StreamEventService {


    constructor(@InjectModel(StreamEvent.name) private streamEventModel: Model<StreamEvent>) { }

    async createRequest(createStreamEventDTO: CreateStreamEventDTO): Promise<StreamEvent> {
        const newEvent = new this.streamEventModel({
            ...createStreamEventDTO,
            status: 'Pending', 
            youtubeUrl: '', 
            date: null, 
        });
        return newEvent.save();
    }


    async updateStatus(id: string, updateStreamEventStatusDTO: UpdateStreamEventStatusDTO): Promise<StreamEvent> {
        const { status, youtubeUrl, date, adminId } = updateStreamEventStatusDTO;
        return this.streamEventModel.findByIdAndUpdate(
            id,
            { status, youtubeUrl, date, approvedBy: adminId },
            { new: true },
        ).exec();
    }
    // create = async (createStreamEventDTO: CreateStreamEventDTO) => {
    //     const createNewStream = new this.streamEventModel(createStreamEventDTO);
    //     return createNewStream.save();
    // }

    // getAllStreams = async () => {
    //     return this.streamEventModel.find()
    // }

    // getStreamById = async (id : string) => {
    //     return this.streamEventModel.findById(id)
    // }

    // updateStream = async (id: string, updateStatusDTO: UpdateStreamEventStatusDTO) => {
    //     return this.streamEventModel.findByIdAndUpdate(id,{ status: updateStatusDTO.status, approvedBy: updateStatusDTO.adminId }, { new: true })
    // }

    // deleteStream = async (id: string) => {
    //     return this.streamEventModel.findByIdAndDelete(id)
    // }
}











// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { StreamEvent, StreamEventDocument } from '../../core/schemas/stream-event.schema';
// import { CreateStreamEventDTO } from './DTO/create-stream-event.DTO';
// import { UpdateStreamEventStatusDTO } from './DTO/update-stream-event.DTO';

// @Injectable()
// export class StreamEventService {
//   constructor(@InjectModel(StreamEvent.name) private streamEventModel: Model<StreamEventDocument>) {}

//   async create(createStreamEventDTO: CreateStreamEventDTO): Promise<StreamEvent> {
//     const createdEvent = new this.streamEventModel(createStreamEventDTO);
//     return createdEvent.save();
//   }

//   async findAll(): Promise<StreamEvent[]> {
//     return this.streamEventModel.find().exec();
//   }

//   async findById(id: string): Promise<StreamEvent> {
//     return this.streamEventModel.findById(id).exec();
//   }

//   async updateStatus(id: string, updateStatusDTO: UpdateStreamEventStatusDTO): Promise<StreamEvent> {
//     return this.streamEventModel.findByIdAndUpdate(id, { status: updateStatusDTO.status, approvedBy: updateStatusDTO.adminId }, { new: true }).exec();
//   }

//   async delete(id: string): Promise<StreamEvent> {
//     return this.streamEventModel.findByIdAndRemove(id).exec();
//   }
// }
