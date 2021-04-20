import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { AuthenticationService } from '../authentication/authentication.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<string> {
    try {
      const { password, passwordConfirmation } = createEmployeeDto;
      if (password !== passwordConfirmation) {
        throw new UnauthorizedException('Password confirmation is not matched');
      }
      const hashPassword = await this.authenticationService.generateHashPassword(
        password,
      );
      const newEmployee = this.employeeRepository.create({
        ...createEmployeeDto,
        hashPassword: hashPassword,
      });
      const saveEmployee = await this.employeeRepository.save(newEmployee);
      return await this.authenticationService.generateAuthToken(
        saveEmployee.id,
        'Employee',
      );
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<{ employees: Employee[]; totalPage: number }> {
    const { limit, offset } = paginationQuery;
    const totalCount = await this.employeeRepository.count();
    return {
      employees: await this.employeeRepository.find({
        skip: (offset - 1) * limit,
        take: limit,
        relations: ['room'],
      }),
      totalPage: Math.ceil(totalCount / limit),
    };
  }

  async findOne(id: string): Promise<Employee> {
    try {
      const employee = await this.employeeRepository.findOne({
        identity: id,
      });
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }
      return employee;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }

  async login(loginEmployeeDto: LoginEmployeeDto): Promise<string> {
    const { identity, password } = loginEmployeeDto;
    const employee = await this.employeeRepository.findOne({
      identity,
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    const isAuth = await this.authenticationService.isMatchPassword(
      password,
      employee.hashPassword,
    );
    if (!isAuth) {
      throw new UnauthorizedException('Password is incorrect');
    }
    return this.authenticationService.generateAuthToken(
      employee.id,
      'Employee',
    );
  }
}
