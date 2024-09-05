import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _jwtService:JwtService, private reflector: Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean{
    let req = context.switchToHttp().getRequest();
    let {token} = req.headers;
    let decoded = this._jwtService.verify(token,{secret: "gaher"});

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // let c = roles.includes(decoded.role)
    // console.log(c);
    
    if (!token) {
      throw new HttpException('User must be authenticated', HttpStatus.FORBIDDEN);
    }
    else{
      // ! set user in request
      req.user = {role: decoded.role , userId: decoded.userId , userName: decoded.name}
      // console.log(req.user)z
      // ! My logic code (validation)
      if (roles.includes(decoded.role)) {
        return true
      }else{
        throw new HttpException(`Not allowed to you to access this!`, HttpStatus.FORBIDDEN);
      }
    }
  }
}
