import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityType } from 'src/models/facility-types/entities/facility-type.entity';
import { FacilityTypeSeederService } from './facility-type.seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([FacilityType])],
  providers: [FacilityTypeSeederService],
  exports: [FacilityTypeSeederService],
})
export class FacilityTypeSeederModule {}
