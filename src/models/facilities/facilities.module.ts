import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from './entities/facility.entity';
import { FacilityType } from '../facility-types/entities/facility-type.entity';
import { Employee } from '../employees/entities/employee.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { Configuration } from '../configurations/entities/configuration.entity';
import { Request } from '../requests/entities/request.entity';
import { Replacement } from '../replacements/entities/replacement.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Facility,
      FacilityType,
      Employee,
      Configuration,
      Request,
      Replacement,
    ]),
    NotificationsModule,
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
  ],
  controllers: [FacilitiesController],
  providers: [FacilitiesService],
})
export class FacilitiesModule {}
