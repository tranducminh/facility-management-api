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
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';

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
    const token = await this.employeesService.create(createEmployeeDto);
    return res.status(HttpStatus.OK).json({
      data: { token },
      message: 'Create employee account successfully',
    });
  }

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto, @Res() res) {
    const result = await this.employeesService.findAll(paginationQuery);
    return res.status(HttpStatus.OK).json({
      ...result,
      message: `Get employee list page ${paginationQuery.offset} successfully`,
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
