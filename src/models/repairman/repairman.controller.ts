import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { RepairmanService } from './repairman.service';
import { CreateRepairmanDto } from './dto/create-repairman.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoginRepairmanDto } from './dto/login-repairman.dto';
import { UpdateRepairmanMyselfDto } from './dto/update-repairman-myself.dto';
import { UpdateRepairmanAdminDto } from './dto/update-repairman-admin.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRoles } from 'src/common/decorators/user-roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ChangePasswordDto } from 'src/common/dto/change-password.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FilterRepairmanDto } from './dto/filter-repairman.dto';

@Controller('repairman')
export class RepairmanController {
  constructor(private readonly repairmanService: RepairmanService) {}

  @Post('/login')
  async login(@Body() loginRepairmanDto: LoginRepairmanDto, @Res() res) {
    const result = await this.repairmanService.login(loginRepairmanDto);
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
    await this.repairmanService.changePassword(req.userId, changePasswordDto);
    return res.status(HttpStatus.OK).json({
      message: 'Cập nhật mật khẩu thành công',
    });
  }

  @Post()
  @UserRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() createRepairmanDto: CreateRepairmanDto, @Res() res) {
    return res.status(HttpStatus.OK).json({
      repairman: await this.repairmanService.create(createRepairmanDto),
      message: 'Tạo tài khoản kỹ thuật viên thành công',
    });
  }

  @Get()
  @UserRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll(@Res() res, @Query() params?: FilterRepairmanDto) {
    return res.status(HttpStatus.OK).json({
      ...(await this.repairmanService.findAll(
        params.limit,
        params.offset,
        params.specialize,
      )),
    });
  }

  @Get('me')
  @UserRoles(UserRole.REPAIRMAN)
  @UseGuards(AuthGuard, RolesGuard)
  async findMe(@Res() res, @Req() req) {
    const { userId } = req;
    return res.status(HttpStatus.OK).json({
      repairman: await this.repairmanService.findMe(+userId),
    });
  }

  @Get('me/requests')
  @UserRoles(UserRole.REPAIRMAN)
  @UseGuards(AuthGuard, RolesGuard)
  async findMyRequest(@Param('id') id: string, @Res() res, @Req() req) {
    const { userId } = req;
    return res.status(HttpStatus.OK).json({
      repairman: await this.repairmanService.findMyRequest(+userId),
    });
  }

  @Get('me/histories')
  @UserRoles(UserRole.REPAIRMAN)
  @UseGuards(AuthGuard, RolesGuard)
  async findMyHistory(@Param('id') id: string, @Res() res, @Req() req) {
    const { userId } = req;
    return res.status(HttpStatus.OK).json({
      repairman: await this.repairmanService.findMyHistory(+userId),
    });
  }

  @Get(':id')
  @UserRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      repairman: await this.repairmanService.findOne(id),
    });
  }

  @Put('me')
  @UserRoles(UserRole.REPAIRMAN)
  @UseGuards(AuthGuard, RolesGuard)
  async updateMyself(
    @Body() updateRepairmanMyselfDto: UpdateRepairmanMyselfDto,
    @Req() req,
    @Res() res,
  ) {
    return res.status(HttpStatus.OK).json({
      repairman: await this.repairmanService.updateMyself(
        +req.userId,
        updateRepairmanMyselfDto,
      ),
      message: 'Cập nhật thông tin thành công',
    });
  }

  @Put(':id')
  @UserRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async updateByAdmin(
    @Param('id') id: string,
    @Body() updateRepairmanAdminDto: UpdateRepairmanAdminDto,
    @Res() res,
  ) {
    return res.status(HttpStatus.OK).json({
      repairman: await this.repairmanService.updateByAdmin(
        +id,
        updateRepairmanAdminDto,
      ),
      message: 'Cập nhật tài khoản kỹ thuật viên thành công',
    });
  }

  @Delete(':id')
  @UserRoles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @Res() res) {
    await this.repairmanService.remove(+id);
    return res.status(HttpStatus.OK).json({
      message: 'Xóa tài khoản kỹ thuật viên thành công',
    });
  }
}
