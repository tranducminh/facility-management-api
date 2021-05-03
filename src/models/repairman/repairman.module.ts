import { Module } from '@nestjs/common';
import { RepairmanService } from './repairman.service';
import { RepairmanController } from './repairman.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repairman } from './entities/repairman.entity';
import { Specialize } from '../specializes/entities/specialize.entity';
import { FacilityType } from '../facility-types/entities/facility-type.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([Repairman, Specialize, FacilityType]),
    JwtModule.register({}),
  ],
  controllers: [RepairmanController],
  providers: [RepairmanService],
})
export class RepairmanModule {}
