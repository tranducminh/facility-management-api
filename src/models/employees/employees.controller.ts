import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { BooleanStatus } from 'src/common/enums/boolean-status.enum';
import { FilterEmployeeDto } from './dto/filter-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post('/login')
  async login(@Body() loginEmployeeDto: LoginEmployeeDto, @Res() res) {
    const result = await this.employeesService.login(loginEmployeeDto);
    return res.status(HttpStatus.OK).json({
      data: { ...result },
      message: 'Login successfully',
    });
  }

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto, @Res() res) {
    const employee = await this.employeesService.create(createEmployeeDto);
    return res.status(HttpStatus.OK).json({
      employee,
      message: 'Create employee account successfully',
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() params: FilterEmployeeDto, @Res() res) {
    const result = await this.employeesService.findAll(
      params.limit,
      params.offset,
      params.hasRoom,
    );
    return res.status(HttpStatus.OK).json({
      ...result,
      message: `Get employee list page  successfully`,
    });
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async findMe(@Req() req, @Res() res) {
    const employee = await this.employeesService.findMe(req.userId);
    return res.status(HttpStatus.OK).json({
      employee,
      message: `Get profile successfully`,
    });
  }

  @Get('/me/facilities')
  @UseGuards(AuthGuard)
  async findMyFacilities(@Req() req, @Res() res) {
    const employee = await this.employeesService.findMyFacilities(req.userId);
    return res.status(HttpStatus.OK).json({
      employee,
      message: `Get profile successfully`,
    });
  }

  @Get('/me/requests')
  @UseGuards(AuthGuard)
  async findMyRequests(@Req() req, @Res() res) {
    const employee = await this.employeesService.findMyRequests(req.userId);
    return res.status(HttpStatus.OK).json({
      employee,
      message: `Get profile successfully`,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      employee: await this.employeesService.findOne(id),
    });
  }

  @Put('me')
  @UseGuards(AuthGuard)
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
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard)
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
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }

  @Put(':id/room')
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
  async removeRoom(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      employee: await this.employeesService.removeRoom(id),
      message: 'Di chuyển cán bộ khỏi phòng thành công',
    });
  }
}
