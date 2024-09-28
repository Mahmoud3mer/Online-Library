import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/core/schemas/user.schema';
import { SignInDTO } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import resetMail from '../mails/reset-password';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class SigninService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,

    private _jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
  ) {}

  async signin(info: SignInDTO) {
    console.log('Received data:', info);

    const user = await this.userModel.findOne({ email: info.email });

    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

    if (user.role !== 'admin' && user.role !== 'user')
      throw new HttpException('UnExpected Role!', HttpStatus.FORBIDDEN);

    if (user.isVerified !== true)
      throw new HttpException(
        'Please, Check your email verefication',
        HttpStatus.FORBIDDEN,
      );

    if (user && (await bcrypt.compare(info.password, user.password))) {
      const token = this._jwtService.sign(
        {
          fName: user.fName,
          lName: user.lName,
          email: user.email,
          role: user.role,
          userId: user._id,
        },
        { secret: process.env.JWT_SECRET },
      );

      return { message: 'Welcome back', token: token };
    } else {
      throw new HttpException(
        'Email or password is incorrect',
        HttpStatus.NOT_FOUND,
      );
    }
  }
  //-------------------------Method to request password reset------------------
  async requestPasswordReset(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const resetToken = uuidv4();
    const expiresAt = addHours(new Date(), 1); // Token expires in 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiresAt = expiresAt;
    await user.save();

    const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: resetMail(resetLink),
    });

    return { message: 'Password reset email sent successfully.' };
  }

  // Method to reset password
  async resetPassword(token: string, newPassword: string) {
    const user = await this.userModel.findOne({
      resetToken: token,
      resetTokenExpiresAt: { $gt: new Date() },
    });
    console.log(token, newPassword);

    if (!user) {
      throw new HttpException(
        'Invalid or expired reset token',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiresAt = null;
    await user.save();

    return { message: 'Password has been reset successfully.' };
  }
}
