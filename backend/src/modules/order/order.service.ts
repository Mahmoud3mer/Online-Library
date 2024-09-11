import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/core/schemas/order.schema';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { PaginationDTO } from '../book/bookdto/pagination.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) { }

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: string,
  ): Promise<{ message: string; newOrder: Order }> {
    const newOrder = new this.orderModel({ ...createOrderDto, userId });
    await newOrder.save();
    return { message: 'Order created successfully', newOrder };
  }
  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId: string,
  ): Promise<{ message: string; updatedOrder: Order }> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      { _id: id, userId },
      { $set: updateOrderDto, orderDate: new Date().toLocaleString() }, // Only update the fields provided in the DTO
      { new: true, runValidators: true }, // Return the updated document and run validators
    );

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return { message: 'order updated successfully', updatedOrder };
  }
  async deleteOrder(id: string, userName: string) {
    const result = await this.orderModel.findByIdAndDelete({ _id: id });

    if (!result) {
      throw new NotFoundException(`No Orders found for ${userName}`);
    }

    return { message: 'The order deleted Successfully', deleted: true };
  }
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const orders = await this.orderModel.find({ userId });

    if (orders.length === 0) {
      throw new NotFoundException(`No orders found for user with ID ${userId}`);
    }

    return orders;
  }

  async getAllOrders(userId: any, paginationDTO: PaginationDTO) {
    const page = paginationDTO.page;
    const limit = paginationDTO.limit;
    const skip = (page - 1) * limit;
    const total = await this.orderModel.countDocuments().exec();
    const allOrders = await this.orderModel.find()
      .skip(skip)
      .limit(limit);
    if (allOrders.length === 0) {
      throw new NotFoundException(`No orders found`);
    }

    return {
      message: "Success, Get All Books.",
      results: allOrders.length,
      metaData: {
        currentPage: page,
        numberOfPages: Math.ceil(total / limit),
        limit
      },
      data: allOrders
    };
  };




  getAllOrdersByAdmin = async (paginationDTO: PaginationDTO) => {
    const page = paginationDTO.page;
    const limit = paginationDTO.limit;
    const skip = (page - 1) * limit;
    const total = await this.orderModel.countDocuments().exec();
    const allOrders = await this.orderModel.find()
      .skip(skip)
      .limit(limit);
    if (allOrders.length === 0) {
      throw new NotFoundException(`No orders found`);
    }

    return {
      message: "Success, Get All Books.",
      results: allOrders.length,
      metaData: {
        currentPage: page,
        numberOfPages: Math.ceil(total / limit),
        limit
      },
      data: allOrders
    };
  }
}
