import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { StreamEventService } from './stream-event.service';
import { CreateStreamEventDTO } from './DTO/create-stream-event.DTO';
import { UpdateStreamEventStatusDTO } from './DTO/update-stream-event.DTO';
import { Roles } from 'src/core/decorators/roles.decorator';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Role } from 'src/core/EnumRoles/role.enum';

@Controller('stream-event')
export class StreamEventController {
  constructor(private readonly _streamEventService: StreamEventService) { }

  // Endpoint for Authors to request a stream event
  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Post()
  async requestStreamEvent(@Body() createStreamEventDTO: CreateStreamEventDTO) {
    return this._streamEventService.createRequest(createStreamEventDTO);
  }

  // Endpoint for Admins to approve or decline a stream event
  @Put(':id/approve')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  async approveStreamEvent(
    @Param('id') id: string,
    @Body() updateStreamEventStatusDTO: UpdateStreamEventStatusDTO,
  ) {
    return this._streamEventService.updateStatus(id, updateStreamEventStatusDTO);
  }

  // @Post()
  // create(@Body() createStreamEventDTO: CreateStreamEventDTO) {
  //   return this._streamEventService.create(createStreamEventDTO);
  // }

  // @Get()
  // getAllStreams(){
  //   return this._streamEventService.getAllStreams()
  // }


  // @Get(':id')
  // getStreamById(@Param('id') id : string){
  //   return this._streamEventService.getStreamById(id)
  // }

  // @Put(':id')
  // updateStream(@Param('id') id: string, @Body() UpdateStreamEventStatusDTO: UpdateStreamEventStatusDTO){
  //   return this._streamEventService.updateStream(id,UpdateStreamEventStatusDTO)
  // }
}









// import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
// import { StreamEventService } from './stream-event.service';
// import { CreateStreamEventDTO } from './DTO/create-stream-event.DTO';
// import { UpdateStreamEventStatusDTO } from './DTO/update-stream-event.DTO';
// import { RolesGuard } from '../auth/guards/roles.guard'; // Assuming you have a roles guard for authorization
// import { Roles } from '../auth/decorators/roles.decorator'; // Assuming you have a custom roles decorator

// @Controller('stream-events')
// export class StreamEventController {
//   constructor(private readonly streamEventService: StreamEventService) {}

//   @Post()
//   @Roles('Author')
//   @UseGuards(RolesGuard)
//   create(@Body() createStreamEventDTO: CreateStreamEventDTO) {
//     return this.streamEventService.create(createStreamEventDTO);
//   }

//   @Get()
//   findAll() {
//     return this.streamEventService.findAll();
//   }

//   @Get(':id')
//   findById(@Param('id') id: string) {
//     return this.streamEventService.findById(id);
//   }

//   @Put(':id/status')
//   @Roles('Admin')
//   @UseGuards(RolesGuard)
//   updateStatus(@Param('id') id: string, @Body() updateStatusDTO: UpdateStreamEventStatusDTO) {
//     return this.streamEventService.updateStatus(id, updateStatusDTO);
//   }

//   @Delete(':id')
//   @Roles('Admin')
//   @UseGuards(RolesGuard)
//   delete(@Param('id') id: string) {
//     return this.streamEventService.delete(id);
//   }
// }
