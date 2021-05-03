import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/user-roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/common/enums/user-role.enum';
import { DecodeToken } from 'src/common/dto/decode-token.dto';
import { catchError } from 'src/common/helpers/catch-error';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const { token } = request.cookies;
      if (!token) {
        throw new UnauthorizedException('Token is required');
      }

      /**
       * check id, exp are null or not
       */
      const { id, role } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      }) as DecodeToken;
      if (!id) {
        throw new UnauthorizedException('Token is invalid');
      }

      /**
       * only accept allowed roles
       */
      if (requiredRoles.includes(role)) {
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
