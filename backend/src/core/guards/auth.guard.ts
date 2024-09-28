import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token = req.headers['token']; // Use req.headers['token'] to extract the token

    // Check if the token is present
    if (!token) {
      throw new HttpException(
        'User must be authenticated. Token is missing.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      // Verify the token
      const decoded = this._jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // Attach decoded information to the request object
      req.user = {
        role: decoded.role,
        userId: decoded.userId,
        userName: `${decoded.fName} ${decoded.lName}`,
      };

      // Check roles if specified
      const roles = this.reflector.get<string[]>('roles', context.getHandler());

      // If no roles are specified, allow access
      if (!roles) return true;

      // Validate the user's role
      if (roles.includes(decoded.role)) {
        return true;
      } else {
        throw new HttpException(
          'You do not have permission to access this resource.',
          HttpStatus.FORBIDDEN,
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Catch any errors during token verification
      throw new HttpException(
        'Invalid or expired token or Unauthorazied.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
