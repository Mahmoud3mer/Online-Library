import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignUpDTO } from '../dto/auth.dto';
import { VerifyTokenDTO } from '../dto/verify-token.dto';

@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post()
  async signup(@Body() body: SignUpDTO) {
    try {
      console.log('up');
      return await this.signupService.signup(body);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    try {
      const result = await this.signupService.verifyEmail(token);
      return {
        message: result.message,
      };
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('verify-token')
  async verifyToken(@Body() body: VerifyTokenDTO) {
    try {
      // Assuming a method verifyGoogleToken exists in your service
      const result = await this.signupService.verifyGoogleToken(body.token);
      return {
        message: 'Token verified successfully',
        data: result,
      };
    } catch (err) {
      throw new HttpException(
        err.message,

        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
