import { Module } from '@nestjs/common';
import { RepairmanService } from './repairman.service';
import { RepairmanController } from './repairman.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repairman } from './entities/repairman.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Repairman])],
  controllers: [RepairmanController],
  providers: [RepairmanService],
})
export class RepairmanModule {}
