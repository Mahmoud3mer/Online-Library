import { Body, Controller, Post } from '@nestjs/common';
import { SignInDTO } from '../dto/auth.dto';
import { SigninService } from './signin.service';

@Controller('signin')
export class SigninController {

    constructor(private _signinService: SigninService) { }

    @Post()
    signin(@Body() body: SignInDTO) {
        return this._signinService.signin(body)
    }
}