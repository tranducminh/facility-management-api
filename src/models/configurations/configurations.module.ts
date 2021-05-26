import { Module } from '@nestjs/common';
import { Configuration } from './entities/configuration.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Configuration])],
})
export class ConfigurationsModule {}
