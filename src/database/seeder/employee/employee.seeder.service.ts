import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as employees from './employee.data.json';
import * as bcrypt from 'bcrypt';
import { Employee } from 'src/models/employees/entities/employee.entity';

@Injectable()
export class EmployeeSeederService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(): Promise<Promise<Employee>[]> {
    try {
      return employees.map(async (employee) => {
        const hashPassword = await bcrypt.hash(employee.identity, 10);
        const newEmployee = this.employeeRepository.create({
          identity: employee.identity,
          hashPassword,
          name: employee.name,
          unit: employee.unit,
          email: employee.email,
        });
        return await this.employeeRepository.save(newEmployee);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
