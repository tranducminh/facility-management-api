import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Floor } from '../floors/entities/floor.entity';
import { Employee } from '../employees/entities/employee.entity';
import { RoomFacility } from '../room-facilities/entities/room-facility.entity';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Floor, Employee, RoomFacility]),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
    NotificationsModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
