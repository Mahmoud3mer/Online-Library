import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDTO } from '../dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/core/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { generateEmailToken } from 'src/core/utils/token.util';
import { MailerService } from '@nestjs-modules/mailer';
import emailHtml from '../mails/mail-verification';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignupService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
    private _jwtService: JwtService,
  ) {}

  async signup(body: SignUpDTO) {
    console.log('jjjjjjjj');

    const existingUser = await this.userModel.findOne({ email: body.email });
    if (existingUser) {
      if (existingUser.isVerified) {
        throw new HttpException(
          'Email is already registered',
          HttpStatus.FORBIDDEN,
        );
      } else {
        console.log('kkkkkkk');

        throw new HttpException(
          ' Please check your email to verify your account.',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;

    if (!body.role) {
      body.role = 'user';
    } else if (!['user', 'admin', 'author'].includes(body.role)) {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }

    const { token: verificationToken, expiresAt: verificationTokenExpiresAt } =
      generateEmailToken();

    const newUser = new this.userModel({
      ...body,
      isVerified: false,
      verificationCode: verificationToken,
      verificationExpiresAt: verificationTokenExpiresAt,
    });

    await newUser.save();

    const verificationLink = `http://localhost:4200/verify-email?token=${verificationToken}`;

    await this.mailerService.sendMail({
      to: body.email,
      subject: 'Email Verification',
      html: emailHtml(`${body.fName} ${body.lName}`, verificationLink),
    });

    return {
      message: `Registration successful. Please check your email to verify your account.`,
    };
  }

  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({
      verificationCode: token,
      verificationExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      throw new HttpException(
        'Invalid or expired verification token',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpiresAt = null;
    await user.save();

    return {
      message:
        'Email Verified Successfully. You can now log in to your account.',
    };
  }
  async verifyGoogleToken(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`,
        ),
      );

      const {
        sub: googleId,
        email,
        given_name: fName,
        family_name: lName,
      } = response.data;
      console.log(response.data);

      let user = await this.userModel.findOne({ email });

      if (!user) {
        user = new this.userModel({
          fName,
          lName,
          email,
          googleId,
          isVerified: true,
          loginMethod: 'google',
        });
        await user
          .save()
          .then((savedUser) => {
            console.log('User saved successfully:', savedUser);
          })
          .catch((err) => {
            console.error('Error saving user:', err);
          });
      } else {
        if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }
      }

      return user;
    } catch (error) {
      console.error('Error during Google token verification:', error);
      throw new HttpException(
        error?.response?.data || 'Failed to verify Google token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
