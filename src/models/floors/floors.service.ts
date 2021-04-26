import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { Building } from '../buildings/entities/building.entity';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { Floor } from './entities/floor.entity';

@Injectable()
export class FloorsService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,
  ) {}
  async create(createFloorDto: CreateFloorDto) {
    const building = await this.buildingRepository.findOne(
      createFloorDto.buildingId,
    );
    const newFloor = await this.floorRepository.create({
      ...createFloorDto,
      building,
    });
    return await this.floorRepository.save(newFloor);
  }

  findAll() {
    return `This action returns all floors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} floor`;
  }

  update(id: number, updateFloorDto: UpdateFloorDto) {
    return `This action updates a #${id} floor`;
  }

  remove(id: number) {
    return `This action removes a #${id} floor`;
  }
}
