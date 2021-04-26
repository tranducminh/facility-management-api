import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from 'src/models/facilities/entities/facility.entity';
import { FacilityType } from 'src/models/facility-types/entities/facility-type.entity';
import { FacilitySeederService } from './facility.seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Facility, FacilityType])],
  providers: [FacilitySeederService],
  exports: [FacilitySeederService],
})
export class FacilitySeederModule {}
