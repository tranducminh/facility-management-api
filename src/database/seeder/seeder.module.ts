import { Logger, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { BuildingSeederModule } from './building/building.seeder.module';
import { FacilityTypeSeederModule } from './facility-type/facility-type.seeder.module';
import { FacilitySeederModule } from './facility/facility.seeder.module';
import { FloorSeederModule } from './floor/floor.seeder.module';
import { RoomSeederModule } from './room/room.seeder.module';
import { Seeder } from './seeder';

@Module({
  imports: [
    RoomSeederModule,
    BuildingSeederModule,
    AppModule,
    FloorSeederModule,
    FacilityTypeSeederModule,
    FacilitySeederModule,
  ],
  providers: [Logger, Seeder],
})
export class SeederModule {}
