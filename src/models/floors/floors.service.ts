import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BooleanStatus } from 'src/common/enums/boolean-status.enum';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { Building } from '../buildings/entities/building.entity';
import { Employee } from '../employees/entities/employee.entity';
import { RoomFacility } from '../room-facilities/entities/room-facility.entity';
import { Room } from '../rooms/entities/room.entity';
import { CreateFloorDto } from './dto/create-floor.dto';
import { Floor } from './entities/floor.entity';

@Injectable()
export class FloorsService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(RoomFacility)
    private readonly roomFacilityRepository: Repository<RoomFacility>,
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

  async remove(id: number) {
    try {
      const floor = await this.floorRepository.findOne(id, {
        relations: ['rooms', 'rooms.employees', 'rooms.roomFacilities'],
      });
      floor.rooms.forEach((room) => {
        room.employees.forEach((employee) => {
          this.employeeRepository.update(employee.id, {
            room: null,
            hasRoom: BooleanStatus.FALSE,
          });
        });
        room.roomFacilities.forEach((roomFacility) => {
          this.roomFacilityRepository.update(roomFacility.id, {
            isActive: false,
          });
        });
        this.roomRepository.update(room.id, { isActive: false });
      });
      await this.floorRepository.update(floor.id, {
        isActive: false,
        building: null,
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
