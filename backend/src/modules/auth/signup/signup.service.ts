import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDTO } from '../dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/core/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SignupService {
    
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
   
    async signup(body:SignUpDTO) {
    
   let user=await this.userModel.findOne({email:body.email})
   if(user) throw new HttpException('email is already register', HttpStatus.FORBIDDEN);

body.password = await bcrypt.hash(body.password, 8);

if (!body.role) {
    body.role = 'user';    
} else if (body.role !== 'user' && body.role !== 'admin'&&body.role !=='auther') {
    throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);     
}

   let adduser =await this.userModel.create(body)
        return {message:'added success',adduser}
    }
}
 