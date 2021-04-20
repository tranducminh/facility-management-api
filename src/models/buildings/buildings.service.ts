import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { Building } from './entities/building.entity';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
  ) {}

  async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    try {
      const newBuilding = this.buildingRepository.create(createBuildingDto);
      return await this.buildingRepository.save(newBuilding);
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAll(): Promise<Building[]> {
    try {
      return await this.buildingRepository.find({
        relations: ['rooms', 'floors'],
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} building`;
  }

  async findOneByName(name: string): Promise<Building> {
    try {
      return await this.buildingRepository.findOne(
        { name },
        { relations: ['floors', 'rooms'] },
      );
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  update(id: number, updateBuildingDto: UpdateBuildingDto) {
    return `This action updates a #${id} building`;
  }

  remove(id: number) {
    return `This action removes a #${id} building`;
  }
}
