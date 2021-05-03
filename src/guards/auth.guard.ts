import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { catchError } from 'src/common/helpers/catch-error';
import { DecodeToken } from '../common/dto/decode-token.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService, // private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { token } = request.headers;
      /**
       * check token is null or not
       */
      if (!token) {
        throw new UnauthorizedException('Token is required');
      }

      /**
       * check id, exp are null or not
       */
      const { id, exp } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      }) as DecodeToken;
      if (!id || !exp) {
        throw new UnauthorizedException('Token is invalid');
      }

      if (!exp || exp * 1000 <= new Date().getTime())
        throw new UnauthorizedException('Token is expired');

      request.userId = id;
      return true;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
