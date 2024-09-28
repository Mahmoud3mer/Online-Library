import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/updateOrder.dto';

import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/EnumRoles/role.enum';
import { PaginationDTO } from '../book/bookdto/pagination.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly _orderService: OrderService) {}

  @Roles(Role.User)
  @UseGuards(AuthGuard)
  @Post()
  async createOrder(@Body() createOrderDto: any, @Req() req: any) {
    const userId = req.user.userId;
    console.log(req);

    return await this._orderService.createOrder(createOrderDto, userId);
  }

  @Patch(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this._orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this._orderService.deleteOrder(id);
  }
  @Roles(Role.User)
  @UseGuards(AuthGuard)
  @Get('user')
  async getAllOrdersByUserId(@Req() req: any) {
    const userId = req.user.userId;
    return this._orderService.getOrdersByUserId(userId);
  }

  @Roles(Role.Admin)
  @Get('admin')
  async getAllOrdersByAdmin(
    @Req() req: any,
    @Query() paginationDTO: PaginationDTO,
  ) {
    return this._orderService.getAllOrdersByAdmin(paginationDTO);
  }
}
