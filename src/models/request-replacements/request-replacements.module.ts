import { Module } from '@nestjs/common';
import { RequestReplacementsService } from './request-replacements.service';
import { RequestReplacementsController } from './request-replacements.controller';
import { RequestReplacement } from './entities/request-replacement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RequestReplacement])],
  controllers: [RequestReplacementsController],
  providers: [RequestReplacementsService],
})
export class RequestReplacementsModule {}
