import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from 'src/models/buildings/entities/building.entity';
import { Floor } from 'src/models/floors/entities/floor.entity';
import { Repository } from 'typeorm';
import * as floors from './floor.data.json';

@Injectable()
export class FloorSeederService {
  constructor(
    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
  ) {}

  async create(): Promise<Promise<Floor>[]> {
    try {
      return floors.map(async (floor) => {
        const building = await this.buildingRepository.findOne({
          name: floor.buildingName,
        });
        const newFloor = this.floorRepository.create({ ...floor, building });
        return await this.floorRepository.save(newFloor);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
