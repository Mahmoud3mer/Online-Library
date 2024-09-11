import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/core/schemas/user.schema';
import { UpdateUserDto } from '../dto/auth.dto';
import { PaginationDTO } from 'src/modules/book/bookdto/pagination.dto';

@Injectable()
export class UserSettingsService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }


  async getAllUsers(paginationDTO: PaginationDTO) {
    const page = paginationDTO.page;
    const limit = paginationDTO.limit;
    const skip = (page - 1) * limit;
    const total = await this.userModel.countDocuments().exec();
    const allUsers = await this.userModel.find()
      .limit(limit)
      .skip(skip)
    return {
      message: "Success, Got All Users",
      results: allUsers.length,
      metaData: {
        currentPage: page,
        numberOfPages: Math.ceil(total / limit),
        limit
      },
      data: allUsers
    };
  }



  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('fName lName password email');
    if (!user) throw new NotFoundException('User not found');
    return { message: "User Founded", user };
  }

  async updateUserProfile(userId: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true });
    if (!updatedUser) throw new NotFoundException('User not found');
    return { message: 'Profile updated successfully', updatedUser };
  }

  async deleteAccount(userId: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId)

    if (!deletedUser) throw new NotFoundException('User Not Found');

    return { message: "Deleted Success", deletedUser }
  }
}
