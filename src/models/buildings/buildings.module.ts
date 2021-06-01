import { Module } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { Building } from './entities/building.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../rooms/entities/room.entity';
import { Floor } from '../floors/entities/floor.entity';
import { Employee } from '../employees/entities/employee.entity';
import { RoomFacility } from '../room-facilities/entities/room-facility.entity';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Building, Room, Floor, Employee, RoomFacility]),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
    NotificationsModule,
  ],
  controllers: [BuildingsController],
  providers: [BuildingsService],
})
export class BuildingsModule {}
