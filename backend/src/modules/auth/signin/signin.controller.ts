import { Body, Controller, Post, Query } from '@nestjs/common';
import { SignInDTO } from '../dto/auth.dto';
import { SigninService } from './signin.service';

@Controller('signin')
export class SigninController {
  constructor(private _signinService: SigninService) {}

  @Post()
  signin(@Body() body: SignInDTO) {
    return this._signinService.signin(body);
  }
  @Post('forgot-password')
  async requestPasswordReset(@Body('email') email: string) {
    return this._signinService.requestPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('password') newPassword: string,
  ) {
    return this._signinService.resetPassword(token, newPassword);
  }
}
