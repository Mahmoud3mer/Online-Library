import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/core/schemas/user.schema';
import { PaginationDTO } from 'src/modules/book/bookdto/pagination.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import emailHtml from '../mails/confirmPass';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UserSettingsService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly mailerService: MailerService) { 
    cloudinary.config({
      cloud_name: 'dvrl2eknu',
      api_key: '287955823152971',
      api_secret: 'TwNg0tN4IDLdQ0k6GEcFZco0deU'
    });
  }


  async getAllUsers(paginationDTO: PaginationDTO, name: string) {
    const page = paginationDTO.page;
    const limit = paginationDTO.limit;
    const skip = (page - 1) * limit;
    const query ={};
    if (name && name.trim() !== '') {
      query['$or'] = [
        { fName: { $regex: name.trim(), $options: 'i' } },
        { lName: { $regex: name.trim(), $options: 'i' } }
      ];
  }
    const total = await this.userModel.countDocuments().exec();
    const allUsers = await this.userModel
      .find(query)
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
    const user = await this.userModel.findOne({_id: userId})

    if (!user) {
      throw new HttpException('User not found!',HttpStatus.BAD_REQUEST);
    }

    // if (user.profilePic) {
    //   const oldImagePath = path.join(__dirname, '..', '..', 'uploads', 'profileImages', user.profilePic);
    //   if (fs.existsSync(oldImagePath)) {
    //     fs.unlinkSync(oldImagePath); // حذف الملف
    //   }
    // }
  
      if (file) {
        // body.profilePic = `http://localhost:3000/uploads/profileImages/${file.filename}`;
        // !cloudinary
        const imgRes = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { 
              resource_type: 'image' ,
              folder: 'profile_picture'
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result);
            }
          ).end(file.buffer);
        });
        // console.log(imgRes['secure_url']);
        body.profilePic = imgRes['secure_url'];
      }

      // if deleted image
    if(!body.profilePic){
      body.profilePic = '';
    }

    if (Array.isArray(body.fName)) {
      body.fName = body.fName[body.fName.length - 1]; // Git last array element
    }

    if (Array.isArray(body.lName)) {
      body.lName = body.lName[body.lName.length - 1];
    }

    if (Array.isArray(body.email)) {
      body.email = body.email[body.email.length - 1];
    }

    if (Array.isArray(body.phone)) {
      body.phone = body.phone[body.phone.length - 1];
    }

    if (Array.isArray(body.profilePic)) {
      body.profilePic = body.profilePic[body.profilePic.length - 1];
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(userId, body, { new: true });
    if (!updatedUser) throw new NotFoundException('User not found');

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Infrmation Update Confirmation',
      html: emailHtml('Your general information has been successfully updated.'),
      context: {
        name: `${user.fName} ${user.lName}`,
      },
    });

    return { message: 'Profile updated successfully' , updatedUser};
  }


  async updateUserPassword(userId: string, body: any) {
    // ! Hash pass
    const user = await this.userModel.findOne({_id: userId})
    console.log(user);
    console.log(body);
    
    if (!user) {
      throw new HttpException('User not found!',HttpStatus.BAD_REQUEST);
    }
    
    if (body.currentPassword && body.newPassword) {
      if (!(await bcrypt.compare(body.currentPassword, user.password))) {
        throw new HttpException('Current password is incorrect', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      body.password = hashedPassword;
    }


    const updatedUser = await this.userModel.findByIdAndUpdate(userId, body, { new: true });

    if (!updatedUser) throw new NotFoundException('User not found');

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Update Confirmation',
      html: emailHtml('Your password has been successfully updated.'),
      context: {
        name: `${user.fName} ${user.lName}`,
      },
    });

    return { message: 'Password updated successfully' , updatedUser};
  }


  async deleteAccount(userId: string) {

    const protectedAdminId = '66f9e34f28db096b6a2463aa';  

    if (userId === protectedAdminId) {
      return { message: "Cannot delete this protected admin" }

    }

    const deletedUser = await this.userModel.findByIdAndDelete(userId)

    if (!deletedUser) throw new NotFoundException('User Not Found');

    return { message: "Deleted Success", deletedUser }
  }
}
