import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/common/enums/user-role.enum';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { AuthenticationService } from '../authentication/authentication.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async login(
    loginAdminDto: LoginAdminDto,
  ): Promise<{
    admin: Admin;
    token: string;
  }> {
    try {
      const { email, password } = loginAdminDto;
      const admin = await this.adminRepository.findOne({
        email,
      });
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      const isAuth = await this.authenticationService.isMatchPassword(
        password,
        admin.hashPassword,
      );
      if (!isAuth) {
        throw new UnauthorizedException('Password is incorrect');
      }
      return {
        admin,
        token: this.authenticationService.generateAuthToken(
          admin.id,
          UserRole.ADMIN,
          admin.channel,
        ),
      };
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    try {
      const hashPassword = await this.authenticationService.generateHashPassword(
        createAdminDto.password,
      );
      const newAdmin = this.adminRepository.create({
        ...createAdminDto,
        hashPassword: hashPassword,
      });

      return await this.adminRepository.save(newAdmin);
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findMe(id: number) {
    try {
      return await this.adminRepository.findOne(id);
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  findAll() {
    return `This action returns all admins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
