import { Module } from '@nestjs/common';
import { SigninController } from './signin/signin.controller';
import { SignupController } from './signup/signup.controller';
import { SigninService } from './signin/signin.service';
import { SignupService } from './signup/signup.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/core/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers:[SigninController,SignupController],
    providers:[SigninService,SignupService,JwtService]
})
export class AuthModule {}
