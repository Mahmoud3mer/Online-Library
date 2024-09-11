import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { User, UserSchema } from 'src/core/schemas/user.schema';
import { SignupController } from './signup/signup.controller';
import { SignupService } from './signup/signup.service';
import { SigninController } from './signin/signin.controller';
import { SigninService } from './signin/signin.service';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { UserSettingsController } from './user-settings/user-settings.controller';
import { UserSettingsService } from './user-settings/user-settings.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'itinoteapp@gmail.com',
          pass: 'bbjq ryus fmox qwow',
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: 'itinoteapp@gmail.com',
      },
    }),
    HttpModule,
  ],

  controllers: [SignupController,SigninController,UserSettingsController],
  providers: [SignupService,SigninService,JwtService,UserSettingsService],
})
export class AuthModule {}
