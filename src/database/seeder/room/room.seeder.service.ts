import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from 'src/models/buildings/entities/building.entity';
import { Floor } from 'src/models/floors/entities/floor.entity';
import { Room } from 'src/models/rooms/entities/room.entity';
import { Repository } from 'typeorm';
import * as rooms from './room.data.json';

@Injectable()
export class RoomSeederService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,
  ) {}

  async create(): Promise<Promise<Room>[]> {
    try {
      return rooms.map(async (room) => {
        const building = await this.buildingRepository.findOne({
          name: room.buildingName,
        });
        const floor = await this.floorRepository.findOne({
          name: room.floorName,
          building: building,
        });
        const newRoom = this.roomRepository.create(room);
        return await this.roomRepository.save({
          ...newRoom,
          building,
          floor,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}
