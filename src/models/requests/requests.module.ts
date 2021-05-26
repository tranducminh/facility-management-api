import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { JwtModule } from '@nestjs/jwt';
import { Employee } from '../employees/entities/employee.entity';
import { Facility } from '../facilities/entities/facility.entity';
import { Repairman } from '../repairman/entities/repairman.entity';
import { History } from '../histories/entities/history.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, Employee, Facility, Repairman, History]),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
    NotificationsModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
