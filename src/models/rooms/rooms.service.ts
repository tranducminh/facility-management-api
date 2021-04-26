import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { Floor } from '../floors/entities/floor.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    try {
      const floor = await this.floorRepository.findOne(createRoomDto.floorId);
      const newRoom = await this.roomRepository.create({
        ...createRoomDto,
        floor,
      });
      return await this.roomRepository.save(newRoom);
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAll(): Promise<Room[]> {
    return await this.roomRepository.find({
      relations: ['floor', 'floor.building', 'building'],
    });
  }

  async findOne(id: number) {
    return await this.roomRepository.findOne(id, {
      relations: ['floor', 'floor.building'],
    });
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
