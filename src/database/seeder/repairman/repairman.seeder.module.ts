import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityType } from 'src/models/facility-types/entities/facility-type.entity';
import { Repairman } from 'src/models/repairman/entities/repairman.entity';
import { Specialize } from 'src/models/specializes/entities/specialize.entity';
import { RepairmanSeederService } from './repairman.seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Repairman, FacilityType, Specialize])],
  providers: [RepairmanSeederService],
  exports: [RepairmanSeederService],
})
export class RepairmanSeederModule {}
