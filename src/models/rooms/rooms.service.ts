import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BooleanStatus } from 'src/common/enums/boolean-status.enum';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { Floor } from '../floors/entities/floor.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { RoomFacility } from '../room-facilities/entities/room-facility.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
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

  async create(createRoomDto: CreateRoomDto) {
    try {
      const existRoom = await this.roomRepository.findOne({
        name: createRoomDto.name,
        floor: { id: createRoomDto.floorId },
      });
      if (existRoom) {
        throw new BadRequestException('Tên phòng đã tồn tại');
      }
      const floor = await this.floorRepository.findOne(createRoomDto.floorId, {
        where: { isActive: true },
      });

      const newRoom = await this.roomRepository.create({
        ...createRoomDto,
        floor,
      });
      const saveRoom = await this.roomRepository.save(newRoom);
      if (!saveRoom) {
        throw new BadRequestException('Tạo phòng không thành công');
      }
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAll(): Promise<Room[]> {
    return await this.roomRepository.find({
      where: { isActive: true },
      relations: ['floor', 'floor.building', 'employees'],
    });
  }

  async findOne(id: number) {
    const room = await this.roomRepository.findOne(id, {
      where: { isActive: true },
      relations: ['floor', 'floor.building'],
    });
    if (!room) {
      throw new NotFoundException('Không tìm thấy phòng');
    }
    return room;
  }

  async remove(id: number) {
    try {
      const room = await this.roomRepository.findOne(id, {
        where: { isActive: true },
        relations: ['employees', 'roomFacilities'],
      });
      if (!room) {
        throw new NotFoundException('Không tìm thấy phòng');
      }
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
      room.floor = null;
      await this.roomRepository.save(room);
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
