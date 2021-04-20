import { Module } from '@nestjs/common';
import { SpecializesService } from './specializes.service';
import { SpecializesController } from './specializes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialize } from './entities/specialize.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Specialize])],
  controllers: [SpecializesController],
  providers: [SpecializesService],
})
export class SpecializesModule {}
