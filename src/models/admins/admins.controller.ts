import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { UserRoles } from 'src/common/decorators/user-roles.decorator';
import { ChangePasswordDto } from 'src/common/dto/change-password.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('/login')
  async login(@Body() loginAdminDto: LoginAdminDto, @Res() res) {
    const result = await this.adminsService.login(loginAdminDto);
    return res.status(HttpStatus.OK).json({
      data: { ...result },
      message: 'Đăng nhập thành công',
    });
  }

  @Put('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res,
    @Req() req,
  ) {
    await this.adminsService.changePassword(req.userId, changePasswordDto);
    return res.status(HttpStatus.OK).json({
      message: 'Cập nhật mật khẩu thành công',
    });
  }

  @Post()
  // @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() createAdminDto: CreateAdminDto, @Res() res) {
    return res.status(HttpStatus.OK).json({
      admin: await this.adminsService.create(createAdminDto),
      message: 'Tạo tài khoản admin thành công',
    });
  }

  @Get('/me')
  @UserRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async findMe(@Req() req, @Res() res) {
    const admin = await this.adminsService.findMe(req.userId);
    return res.status(HttpStatus.OK).json({
      admin,
      message: `Lấy thông tin tài khoản thành công`,
    });
  }
}
