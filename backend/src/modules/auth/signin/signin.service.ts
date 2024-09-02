import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/core/schemas/user.schema';
import { SignInDTO } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';




@Injectable()
export class SigninService {

    constructor(@InjectModel(User.name) private userModel: Model<User>, private _jwtService:JwtService) {}

    async signin(info:SignInDTO){
      console.log('Received data:', info);


let user=await this.userModel.findOne({email:info.email})
console.log('User found:', user);



if(user && await bcrypt.compare(info.password,user.password)){
  console.log('Password matched, checking role...');



    if (user.role === info.role) {
      
      const token = this._jwtService.sign(
          { name: user.name, email: user.email, role: user.role }, 
          { secret: "gaher" }
        );



        return { message: 'Welcome back', token: token };
      } else {


        throw new HttpException('Role is incorrect', HttpStatus.FORBIDDEN);
      }
    } else {
      
      throw new HttpException('Email or password is incorrect', HttpStatus.NOT_FOUND);
    }
    }
}
