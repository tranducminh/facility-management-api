import { Module } from '@nestjs/common';
import { RoomFacilitiesService } from './room-facilities.service';
import { RoomFacilitiesController } from './room-facilities.controller';
import { RoomFacility } from './entities/room-facility.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RoomFacility])],
  controllers: [RoomFacilitiesController],
  providers: [RoomFacilitiesService],
})
export class RoomFacilitiesModule {}
