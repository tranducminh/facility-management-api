import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { catchError } from 'src/common/helpers/catch-error';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}

  create(createAuthenticationDto: CreateAuthenticationDto) {
    return 'This action adds a new authentication';
  }

  findAll() {
    return `This action returns all authentication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authentication`;
  }

  update(id: number, updateAuthenticationDto: UpdateAuthenticationDto) {
    return `This action updates a #${id} authentication`;
  }

  remove(id: number) {
    return `This action removes a #${id} authentication`;
  }

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

  generateAuthToken(id: number, role: string): string {
    try {
      return this.jwtService.sign(
        { id, role },
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
