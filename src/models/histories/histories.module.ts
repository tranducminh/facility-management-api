import { Module } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([History]),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
  ],
  controllers: [HistoriesController],
  providers: [HistoriesService],
})
export class HistoriesModule {}
