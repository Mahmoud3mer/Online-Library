import { Module } from '@nestjs/common';
import { StreamEventService } from './stream-event.service';
import { StreamEventController } from './stream-event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StreamEvent, StreamEventSchema } from 'src/core/schemas/stream-event.schema';
import { JwtService } from '@nestjs/jwt';
// import { AuthGuard } from 'src/core/guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StreamEvent.name, schema: StreamEventSchema }]),
    //User
  ],
  controllers: [StreamEventController],
  providers: [
    StreamEventService,
    JwtService,
    // AuthGuard,
  ],
})
export class StreamEventModule { }



// 3 type of user who can CRUD
// how to make the authrization for who can do this crud
// if conditions or gaurds ?