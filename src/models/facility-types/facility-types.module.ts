import { Module } from '@nestjs/common';
import { FacilityTypesService } from './facility-types.service';
import { FacilityTypesController } from './facility-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityType } from './entities/facility-type.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([FacilityType]),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
  ],
  controllers: [FacilityTypesController],
  providers: [FacilityTypesService],
})
export class FacilityTypesModule {}
