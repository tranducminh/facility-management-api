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
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post('/login')
  async login(@Body() loginEmployeeDto: LoginEmployeeDto, @Res() res) {
    const token = await this.employeesService.login(loginEmployeeDto);
    return res.status(HttpStatus.OK).json({
      data: { token },
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
  async findAll(@Query() paginationQuery: PaginationQueryDto, @Res() res) {
    const result = await this.employeesService.findAll(paginationQuery);
    return res.status(HttpStatus.OK).json({
      ...result,
      message: `Get employee list page ${paginationQuery.offset} successfully`,
    });
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async findMe(@Req() req, @Res() res) {
    const employee = await this.employeesService.findMe(req.employeeId);
    return res.status(HttpStatus.OK).json({
      employee,
      message: `Get profile successfully`,
    });
  }

  @Get('/me/facilities')
  @UseGuards(AuthGuard)
  async findMyFacilities(@Req() req, @Res() res) {
    const employee = await this.employeesService.findMyFacilities(
      req.employeeId,
    );
    return res.status(HttpStatus.OK).json({
      employee,
      message: `Get profile successfully`,
    });
  }

  @Get('/me/requests')
  @UseGuards(AuthGuard)
  async findMyRequests(@Req() req, @Res() res) {
    const employee = await this.employeesService.findMyRequests(req.employeeId);
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}
