import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { catchError } from 'src/common/helpers/catch-error';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}

  async generateHashPassword(password: string): Promise<string> {
    try {
      const saltOrRounds = 10;
      return await bcrypt.hash(password, saltOrRounds);
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async isMatchPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  generateAuthToken(id: number, role: string, channel: string): string {
    try {
      return this.jwtService.sign(
        { id, role, channel },
        {
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
          secret: process.env.JWT_SECRET_KEY,
        },
      );
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
