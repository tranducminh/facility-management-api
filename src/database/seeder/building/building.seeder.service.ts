import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from 'src/models/buildings/entities/building.entity';
import { Repository } from 'typeorm';
import * as buildings from './building.data.json';

@Injectable()
export class BuildingSeederService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
  ) {}

  async create(): Promise<Promise<Building>[]> {
    try {
      return buildings.map(async (building) => {
        const newBuilding = this.buildingRepository.create(building);
        return await this.buildingRepository.save(newBuilding);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
