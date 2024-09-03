import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { AuthGuard } from 'src/core/guards/order.guard';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly _orderService: OrderService) {}

  @Post()
  createOrder(@Body() createOrderDto: any, @Req() req: any) {
    const userId = req.userId;
    return this._orderService.createOrder(createOrderDto, userId);
  }

  @Patch(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: any,
  ) {
    const userId = req.userId;
    return this._orderService.updateOrder(id, updateOrderDto, userId);
  }
  @Delete(':id')
  async deleteOrder(@Param('id') id: string, @Req() req: any) {
    const userName = req.name;
    return this._orderService.deleteOrder(id, userName);
  }

  @Get('user')
  async getAllOrdersByUserId(@Req() req: any) {
    const userId = req.userId;
    return this._orderService.getOrdersByUserId(userId);
  }

  @Get()
  async getAllOrders(@Req() req: any) {
    const userRole = req.role;
    return this._orderService.getAllOrders(userRole);
  }
}
