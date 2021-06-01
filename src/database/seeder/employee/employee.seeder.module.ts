import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/models/employees/entities/employee.entity';
import { EmployeeSeederService } from './employee.seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeeSeederService],
  exports: [EmployeeSeederService],
})
export class EmployeeSeederModule {}
