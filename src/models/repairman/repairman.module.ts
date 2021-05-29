import { Module } from '@nestjs/common';
import { RepairmanService } from './repairman.service';
import { RepairmanController } from './repairman.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repairman } from './entities/repairman.entity';
import { Specialize } from '../specializes/entities/specialize.entity';
import { History } from '../histories/entities/history.entity';
import { Request } from '../requests/entities/request.entity';
import { FacilityType } from '../facility-types/entities/facility-type.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationModule } from '../authentication/authentication.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { Employee } from '../employees/entities/employee.entity';

@Module({
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([
      Repairman,
      Specialize,
      FacilityType,
      History,
      Request,
      Employee,
    ]),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
    NotificationsModule,
  ],
  controllers: [RepairmanController],
  providers: [RepairmanService],
})
export class RepairmanModule {}
