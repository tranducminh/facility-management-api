import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './models/employees/employees.module';
import { RepairmanModule } from './models/repairman/repairman.module';
import { BuildingsModule } from './models/buildings/buildings.module';
import { RoomsModule } from './models/rooms/rooms.module';
import { FacilitiesModule } from './models/facilities/facilities.module';
import { FacilityTypesModule } from './models/facility-types/facility-types.module';
import { RequestsModule } from './models/requests/requests.module';
import { RoomFacilitiesModule } from './models/room-facilities/room-facilities.module';
import { ReplacementsModule } from './models/replacements/replacements.module';
import { SpecializesModule } from './models/specializes/specializes.module';
import { AuthenticationModule } from './models/authentication/authentication.module';
import { AdminsModule } from './models/admins/admins.module';
import { ConfigurationsModule } from './models/configurations/configurations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FloorsModule } from './models/floors/floors.module';
import { HistoriesModule } from './models/histories/histories.module';

@Module({
  imports: [
    EmployeesModule,
    RepairmanModule,
    BuildingsModule,
    RoomsModule,
    FacilitiesModule,
    FacilityTypesModule,
    RequestsModule,
    RoomFacilitiesModule,
    ReplacementsModule,
    SpecializesModule,
    AuthenticationModule,
    AdminsModule,
    ConfigurationsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: process.env.DATABASE_HOST,
      port: 3310,
      username: 'root',
      password: 'Hoidelamgi',
      database: 'facility-management-api',
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
    }),
    FloorsModule,
    HistoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
