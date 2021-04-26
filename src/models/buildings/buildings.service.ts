import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { Floor } from '../floors/entities/floor.entity';
import { Room } from '../rooms/entities/room.entity';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { Building } from './entities/building.entity';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,
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
        relations: ['floors', 'floors.rooms', 'floors.rooms.employees'],
        order: {
          name: 'ASC',
        },
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
        { relations: ['floors', 'floors.rooms'] },
      );
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAllFloor(buildingName: string) {
    try {
      const building = await this.buildingRepository.findOne({
        name: buildingName,
      });

      if (!building) {
        throw new NotFoundException('Floor not found');
      }
      return building.floors;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findFloor(buildingName: string, floorName: string) {
    try {
      const building = await this.buildingRepository.findOne({
        name: buildingName,
      });

      const floor = await this.floorRepository.findOne(
        {
          name: floorName,
          building: {
            id: building.id,
          },
        },
        { relations: ['building', 'rooms'] },
      );

      if (!floor) {
        throw new NotFoundException('Floor not found');
      }
      return floor;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAllRoom(buildingName: string, floorName: string) {
    try {
      const building = await this.buildingRepository.findOne({
        name: buildingName,
      });

      const floor = await this.floorRepository.findOne({
        name: floorName,
        building: {
          id: building.id,
        },
      });

      if (!floor) {
        throw new NotFoundException('Floor not found');
      }
      return floor.rooms;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findRoom(buildingName: string, floorName: string, roomName: string) {
    try {
      const building = await this.buildingRepository.findOne({
        name: buildingName,
      });

      const floor = await this.floorRepository.findOne({
        name: floorName,
        building: {
          id: building.id,
        },
      });

      const room = await this.roomRepository.findOne(
        {
          name: roomName,
          floor: {
            id: floor.id,
          },
        },
        {
          relations: [
            'floor',
            'floor.building',
            'employees',
            'employees.facilities',
            'employees.facilities.facilityType',
            'employees.facilities.configuration',
            'roomFacilities',
          ],
        },
      );
      if (!room) {
        throw new NotFoundException('Room not found');
      }
      return room;
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
