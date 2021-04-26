import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Floor } from '../floors/entities/floor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Floor])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
