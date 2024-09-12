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
        { secret: 'gaher' },
      );

      return { message: 'Welcome back', token: token };
    } else {
      throw new HttpException(
        'Email or password is incorrect',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
