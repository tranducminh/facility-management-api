import { Module } from '@nestjs/common';
import { FacilityTypesService } from './facility-types.service';
import { FacilityTypesController } from './facility-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityType } from './entities/facility-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FacilityType])],
  controllers: [FacilityTypesController],
  providers: [FacilityTypesService],
})
export class FacilityTypesModule {}
