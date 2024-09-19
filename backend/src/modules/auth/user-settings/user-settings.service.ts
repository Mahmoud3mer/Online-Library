import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/core/schemas/user.schema';
// import { UpdateUserDto } from '../dto/auth.dto';
import { PaginationDTO } from 'src/modules/book/bookdto/pagination.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import emailHtml from '../mails/confirmPass';
@Injectable()
export class UserSettingsService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly mailerService: MailerService) { }


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
    const user = await this.userModel.findById(userId).select('fName lName password email phone profilePic');
    if (!user) throw new NotFoundException('User not found');
    return { message: "User Founded", user };
  }

  async updateUserProfile(userId: string, body: any , file: Express.Multer.File) {
    // const profileImagePath = file ? `/uploads/profileImages/${file.filename}` : null;
    if (file) {
      body.profilePic = `/uploads/profileImages/${file.filename}`;
    }

    // ! Hash pass
    const user = await this.userModel.findOne({email: body.email})

    if (!user) {
      throw new HttpException('Email not found!',HttpStatus.BAD_REQUEST);
    }

    // if (!(await bcrypt.compare((body.currentPassword).toString(), user.password))) {
    //   throw new HttpException('Password is incorrect',HttpStatus.BAD_REQUEST);
    // }

    // const hashedPassword = await bcrypt.hash((body.newPassword).toString(), 10);
    // body.password = hashedPassword;
    // console.log(body.password);
    
    if (body.currentPassword && body.newPassword) {

      if (!(await bcrypt.compare(body.currentPassword.toString(), user.password))) {
        throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await bcrypt.hash(body.newPassword.toString(), 10);
      body.password = hashedPassword;
    }


    const updatedUser = await this.userModel.findByIdAndUpdate(userId, body, { new: true });
    if (!updatedUser) throw new NotFoundException('User not found');

    await this.mailerService.sendMail({
      to: body.email,
      subject: 'Password Update Confirmation',
      html: emailHtml(`${body.fName} ${body.lName}`),
    });

    return { message: 'Profile updated successfully' , updatedUser};
  }


  async deleteAccount(userId: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId)

    if (!deletedUser) throw new NotFoundException('User Not Found');

    return { message: "Deleted Success", deletedUser }
  }
}
