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
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeAdminDto } from './dto/update-employee-admin.dto';
import { UpdateEmployeeMyselfDto } from './dto/update-employee-myself.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilterEmployeeDto } from './dto/filter-employee.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRoles } from 'src/common/decorators/user-roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ChangePasswordDto } from 'src/common/dto/change-password.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post('/login')
  async login(@Body() loginEmployeeDto: LoginEmployeeDto, @Res() res) {
    const result = await this.employeesService.login(loginEmployeeDto);
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
    await this.employeesService.changePassword(req.userId, changePasswordDto);
    return res.status(HttpStatus.OK).json({
      message: 'Cập nhật mật khẩu thành công',
    });
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UserRoles(UserRole.ADMIN)
  async create(@Body() createEmployeeDto: CreateEmployeeDto, @Res() res) {
    const employee = await this.employeesService.create(createEmployeeDto);
    return res.status(HttpStatus.OK).json({
      employee,
      message: 'Tạo tài khoản cán bộ thành công',
    });
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @UserRoles(UserRole.ADMIN)
  async findAll(@Query() params: FilterEmployeeDto, @Res() res) {
    const result = await this.employeesService.findAll(
      params.limit,
      params.offset,
      params.hasRoom,
    );
    return res.status(HttpStatus.OK).json({
      ...result,
    });
  }

  @Get('/me')
  @UseGuards(AuthGuard, RolesGuard)
  @UserRoles(UserRole.EMPLOYEE)
  async findMe(@Req() req, @Res() res) {
    const employee = await this.employeesService.findMe(req.userId);
    return res.status(HttpStatus.OK).json({
      employee,
    });
  }

  @Get('/me/facilities')
  @UserRoles(UserRole.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  async findMyFacilities(@Req() req, @Res() res) {
    const employee = await this.employeesService.findMyFacilities(req.userId);
    return res.status(HttpStatus.OK).json({
      employee,
    });
  }

  @Get('/me/requests')
  @UserRoles(UserRole.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  async findMyRequests(@Req() req, @Res() res) {
    const employee = await this.employeesService.findMyRequests(req.userId);
    return res.status(HttpStatus.OK).json({
      employee,
    });
  }

  @Get(':id')
  @UserRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      employee: await this.employeesService.findOne(id),
    });
  }

  @Put('me')
  @UserRoles(UserRole.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  async updateMyself(
    @Body() updateEmployeeMyselfDto: UpdateEmployeeMyselfDto,
    @Req() req,
    @Res() res,
  ) {
    return res.status(HttpStatus.OK).json({
      employee: await this.employeesService.updateMyself(
        +req.userId,
        updateEmployeeMyselfDto,
      ),
      message: 'Cập nhật thông tin thành công',
    });
  }

  @Put(':id')
  @UserRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async updateByAdmin(
    @Param('id') id: string,
    @Body() updateEmployeeAdminDto: UpdateEmployeeAdminDto,
    @Res() res,
  ) {
    return res.status(HttpStatus.OK).json({
      employee: await this.employeesService.updateByAdmin(
        +id,
        updateEmployeeAdminDto,
      ),
      message: 'Cập nhật tài khoản cán bộ thành công',
    });
  }

  @Delete(':id')
  @UserRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string, @Res() res) {
    await this.employeesService.remove(+id);
    return res.status(HttpStatus.OK).json({
      message: 'Xóa tài khoản cán bộ thành công',
    });
  }

  @Put(':id/room')
  @UserRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async updateRoom(
    @Param('id') id: string,
    @Res() res,
    @Body() { roomId }: { roomId: number },
  ) {
    return res.status(HttpStatus.OK).json({
      employee: await this.employeesService.updateRoom(id, roomId),
      message: 'Cập nhật phòng thành công',
    });
  }

  @Delete(':id/room')
  @UserRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async removeRoom(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      employee: await this.employeesService.removeRoom(id),
      message: 'Di chuyển cán bộ khỏi phòng thành công',
    });
  }
}
