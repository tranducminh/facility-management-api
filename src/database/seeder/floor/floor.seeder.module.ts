import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from 'src/models/buildings/entities/building.entity';
import { Floor } from 'src/models/floors/entities/floor.entity';
import { FloorSeederService } from './floor.seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Floor, Building])],
  providers: [FloorSeederService],
  exports: [FloorSeederService],
})
export class FloorSeederModule {}
