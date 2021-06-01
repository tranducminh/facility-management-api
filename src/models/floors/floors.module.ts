import { Module } from '@nestjs/common';
import { FloorsService } from './floors.service';
import { FloorsController } from './floors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Floor } from './entities/floor.entity';
import { Building } from '../buildings/entities/building.entity';
import { RoomFacility } from '../room-facilities/entities/room-facility.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Room } from '../rooms/entities/room.entity';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Floor, Building, Room, Employee, RoomFacility]),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
    NotificationsModule,
  ],
  controllers: [FloorsController],
  providers: [FloorsService],
})
export class FloorsModule {}
