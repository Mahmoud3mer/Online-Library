import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/EnumRoles/role.enum';
import { PaginationDTO } from '../book/bookdto/pagination.dto';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly _orderService: OrderService) { }

  @Roles(Role.User)
  @Post()
  createOrder(@Body() createOrderDto: any, @Req() req: any) {
    const userId = req.user.userId;
    return this._orderService.createOrder(createOrderDto, userId);
  }

  @Roles(Role.User)
  @Patch(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this._orderService.updateOrder(id, updateOrderDto, userId);
  }

  @Roles(Role.User)
  @Delete(':id')
  async deleteOrder(@Param('id') id: string, @Req() req: any) {
    const userName = req.user.userName;
    return this._orderService.deleteOrder(id, userName);
  }

  @Roles(Role.User)
  @Get('user')
  async getAllOrdersByUserId(@Req() req: any) {
    const userId = req.user.userId;
    return this._orderService.getOrdersByUserId(userId);
  }

  @Roles(Role.User)
  @Get()
  async getAllOrders(@Req() req: any,@Query() paginationDTO : PaginationDTO) {
    const userId = req.user.userId;
    return this._orderService.getAllOrders(userId,paginationDTO);
  }


  @Roles(Role.Admin)
  @Get('admin')
  async getAllOrdersByAdmin(@Req() req: any,@Query() paginationDTO : PaginationDTO) {
    return this._orderService.getAllOrdersByAdmin(paginationDTO);
  }
}
