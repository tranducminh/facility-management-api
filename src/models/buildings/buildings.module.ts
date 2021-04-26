import { Module } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { Building } from './entities/building.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../rooms/entities/room.entity';
import { Floor } from '../floors/entities/floor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Building, Room, Floor])],
  controllers: [BuildingsController],
  providers: [BuildingsService],
})
export class BuildingsModule {}
