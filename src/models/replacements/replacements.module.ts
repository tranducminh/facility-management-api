import { Module } from '@nestjs/common';
import { ReplacementsService } from './replacements.service';
import { ReplacementsController } from './replacements.controller';
import { Replacement } from './entities/replacement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from '../facilities/entities/facility.entity';
import { Request } from '../requests/entities/request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Replacement, Request, Facility])],
  controllers: [ReplacementsController],
  providers: [ReplacementsService],
})
export class ReplacementsModule {}
