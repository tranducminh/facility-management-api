import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Room } from '../rooms/entities/room.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { Facility } from '../facilities/entities/facility.entity';
import { Request } from '../requests/entities/request.entity';
import { History } from '../histories/entities/history.entity';
import { Replacement } from '../replacements/entities/replacement.entity';

@Module({
  imports: [
    AuthenticationModule,
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
    TypeOrmModule.forFeature([
      Employee,
      Room,
      Facility,
      Request,
      Replacement,
      History,
    ]),
    NotificationsModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
