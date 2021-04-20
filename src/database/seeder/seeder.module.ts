import { Logger, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { BuildingSeederModule } from './building/building.seeder.module';
import { FloorSeederModule } from './floor/floor.seeder.module';
import { RoomSeederModule } from './room/room.seeder.module';
import { Seeder } from './seeder';

@Module({
  imports: [
    RoomSeederModule,
    BuildingSeederModule,
    AppModule,
    FloorSeederModule,
  ],
  providers: [Logger, Seeder],
})
export class SeederModule {}
