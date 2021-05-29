import { Module } from '@nestjs/common';
import { RoomFacilitiesService } from './room-facilities.service';
import { RoomFacilitiesController } from './room-facilities.controller';
import { RoomFacility } from './entities/room-facility.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { FacilityType } from '../facility-types/entities/facility-type.entity';
import { Room } from '../rooms/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomFacility, FacilityType, Room]),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
  ],
  controllers: [RoomFacilitiesController],
  providers: [RoomFacilitiesService],
})
export class RoomFacilitiesModule {}
