import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch, Query } from '@nestjs/common';
import { StreamEventService } from './stream-event.service';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/EnumRoles/role.enum';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { StreamEventDTO } from './DTO/stream-event.DTO';
import { PaginationDTO } from '../book/bookdto/pagination.dto';

@Controller('stream-events')
export class StreamEventController {
  constructor(private readonly streamEventService: StreamEventService) { }


  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Post()
  createNewStream(@Body() createStreamEventDTO: StreamEventDTO) {
    return this.streamEventService.createStream(createStreamEventDTO);
  }

  @Get()
  findAll(@Query() paginationDTO: PaginationDTO) {
    return this.streamEventService.getAllStreams(paginationDTO);
  }

  @Get(':id')
  findStreamById(@Param('id') id: string) {
    return this.streamEventService.findById(id);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Patch(':id')
  updateStream(@Param('id') id: string, @Body() body: StreamEventDTO) {
    return this.streamEventService.updateStatus(id, body);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteStream(@Param('id') id: string) {
    return this.streamEventService.delete(id);
  }
}
