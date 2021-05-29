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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FloorsModule } from './models/floors/floors.module';
import { HistoriesModule } from './models/histories/histories.module';
import { NotificationsModule } from './models/notifications/notifications.module';

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
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        // host: process.env.DATABASE_HOST,
        port: parseInt(configService.get<string>('DATABASE_PORT')),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    FloorsModule,
    HistoriesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
