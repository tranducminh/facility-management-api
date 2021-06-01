import { Logger, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { AdminSeederModule } from './admin/admin.seeder.module';
import { BuildingSeederModule } from './building/building.seeder.module';
import { EmployeeSeederModule } from './employee/employee.seeder.module';
import { FacilityTypeSeederModule } from './facility-type/facility-type.seeder.module';
import { FacilitySeederModule } from './facility/facility.seeder.module';
import { FloorSeederModule } from './floor/floor.seeder.module';
import { RepairmanSeederModule } from './repairman/repairman.seeder.module';
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
    AdminSeederModule,
    EmployeeSeederModule,
    RepairmanSeederModule,
  ],
  providers: [Logger, Seeder],
})
export class SeederModule {}
