import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly _orderService: OrderService) {}

  @Post()
  createOrder(@Body() createOrderDto: any) {
    return this._orderService.createOrder(createOrderDto);
  }

  @Put(':id')
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

  @Get('user/:userId')
  async getAllOrdersByUserId(@Param('userId') userId: string) {
    return this._orderService.getOrdersByUserId(userId);
    // async getAllOrdersByUserId(@Body() body: { userId: string }) {
    //     const { userId } = body;
  }

  @Get()
  async getAllOrders() {
    return this._orderService.getAllOrders();
  }
}
