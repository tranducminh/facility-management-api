import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto } from 'src/common/dto/change-password.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { AuthenticationService } from '../authentication/authentication.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
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
        throw new NotFoundException('Không tìm thấy tài khoản');
      }
      const isAuth = await this.authenticationService.isMatchPassword(
        password,
        admin.hashPassword,
      );
      if (!isAuth) {
        throw new UnauthorizedException('Mật khẩu không chính xác');
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

  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    const admin = await this.adminRepository.findOne(id);
    if (!admin) {
      throw new NotFoundException('Không tìm thấy admin');
    }
    const { oldPassword, newPassword } = changePasswordDto;
    const isAuth = await this.authenticationService.isMatchPassword(
      oldPassword,
      admin.hashPassword,
    );
    if (!isAuth) {
      throw new UnauthorizedException('Mật khẩu hiện tại không chính xác');
    }
    admin.hashPassword = await this.authenticationService.generateHashPassword(
      newPassword,
    );
    return await this.adminRepository.save(admin);
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
      const admin = await this.adminRepository.findOne(id);
      if (!admin) {
        throw new NotFoundException('Không tìm thấy tài khoản');
      }
      return admin;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
