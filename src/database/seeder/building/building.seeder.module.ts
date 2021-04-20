import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from 'src/models/buildings/entities/building.entity';
import { BuildingSeederService } from './building.seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Building])],
  providers: [BuildingSeederService],
  exports: [BuildingSeederService],
})
export class BuildingSeederModule {}
