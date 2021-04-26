import { Module } from '@nestjs/common';
import { FloorsService } from './floors.service';
import { FloorsController } from './floors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Floor } from './entities/floor.entity';
import { Building } from '../buildings/entities/building.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Floor, Building])],
  controllers: [FloorsController],
  providers: [FloorsService],
})
export class FloorsModule {}
