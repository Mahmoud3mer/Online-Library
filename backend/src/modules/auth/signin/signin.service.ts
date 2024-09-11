import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/core/schemas/user.schema';
import { SignInDTO } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SigninService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private _jwtService: JwtService,
  ) {}

  async signin(info: SignInDTO) {
    console.log('Received data:', info);

    const user = await this.userModel.findOne({ email: info.email });
    console.log('User found:', user);

    if (user && (await bcrypt.compare(info.password, user.password))) {
      if (user.isVerified === true) {
        const token = this._jwtService.sign(
          {
            name: user.name,
            email: user.email,
            role: user.role,
            userId: user._id,
          },
          { secret: 'gaher' },
        );

        return { message: 'Welcome back', token: token, name: user.name };
      } else {
        throw new HttpException(
          'Please check your email to verify your account',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        'Email or password is incorrect',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
