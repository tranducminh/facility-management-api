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
import { RequestReplacementsModule } from './models/request-replacements/request-replacements.module';
import { SpecializesModule } from './models/specializes/specializes.module';
import { AuthenticationModule } from './models/authentication/authentication.module';
import { AdminsModule } from './models/admins/admins.module';
import { ConfigurationsModule } from './models/configurations/configurations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FloorsModule } from './models/floors/floors.module';

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
    RequestReplacementsModule,
    SpecializesModule,
    AuthenticationModule,
    AdminsModule,
    ConfigurationsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
    }),
    FloorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
