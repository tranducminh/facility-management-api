import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Room } from '../rooms/entities/room.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    AuthenticationModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([Employee, Room]),
    NotificationsModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
