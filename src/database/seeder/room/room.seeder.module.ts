import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from 'src/models/buildings/entities/building.entity';
import { Floor } from 'src/models/floors/entities/floor.entity';
import { Room } from 'src/models/rooms/entities/room.entity';
import { RoomSeederService } from './room.seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Building, Floor])],
  providers: [RoomSeederService],
  exports: [RoomSeederService],
})
export class RoomSeederModule {}
