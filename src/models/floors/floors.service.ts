import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BooleanStatus } from 'src/common/enums/boolean-status.enum';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { Building } from '../buildings/entities/building.entity';
import { Employee } from '../employees/entities/employee.entity';
import { NotificationsService } from '../notifications/notifications.service';
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
    private readonly notificationsService: NotificationsService,
  ) {}
  async create(createFloorDto: CreateFloorDto) {
    const existFloor = await this.floorRepository.findOne({
      name: createFloorDto.name,
      building: { id: createFloorDto.buildingId },
    });
    if (existFloor) {
      throw new BadRequestException('Tên tầng đã tồn tại');
    }
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
          employee.room = null;
          employee.hasRoom = BooleanStatus.FALSE;
          this.employeeRepository.save(employee);
          this.notificationsService.create({
            receiver: employee,
            type: NotificationType.PENDING_ROOM,
          });
        });
        room.roomFacilities.forEach((roomFacility) => {
          roomFacility.isActive = false;
          this.roomFacilityRepository.save(roomFacility);
        });
        room.isActive = false;
        this.roomRepository.save(room);
      });
      floor.isActive = false;
      floor.building = null;
      await this.floorRepository.save(floor);
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
