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
import { Room } from '../rooms/entities/room.entity';
import { CreateBuildingDto } from './dto/create-building.dto';
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
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(RoomFacility)
    private readonly roomFacilityRepository: Repository<RoomFacility>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    try {
      const existBuilding = await this.buildingRepository.findOne({
        name: createBuildingDto.name,
      });
      if (existBuilding) {
        throw new BadRequestException('Tên tòa nhà đã tồn tại');
      }
      const newBuilding = this.buildingRepository.create(createBuildingDto);
      const saveBuilding = await this.buildingRepository.save(newBuilding);
      if (!saveBuilding) {
        throw new BadRequestException('Tạo tòa nhà không thành công');
      }
      return saveBuilding;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAll() {
    try {
      return await this.buildingRepository
        .createQueryBuilder('building')
        .leftJoinAndSelect('building.floors', 'floor')
        .leftJoinAndSelect('floor.rooms', 'room')
        .leftJoinAndSelect('room.employees', 'employee')
        .leftJoinAndSelect('employee.requests', 'request')
        .where('building.isActive = true')
        .orderBy('building.name', 'ASC')
        .getMany();
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findOneByName(name: string): Promise<Building> {
    try {
      const building = await this.buildingRepository
        .createQueryBuilder('building')
        .leftJoinAndSelect('building.floors', 'floor')
        .leftJoinAndSelect('floor.rooms', 'room')
        .leftJoinAndSelect('room.employees', 'employee')
        .leftJoinAndSelect('employee.requests', 'requests')
        .leftJoinAndSelect('employee.facilities', 'facility')
        .leftJoinAndSelect('facility.facilityType', 'facilityType')
        .where('building.isActive = true')
        .andWhere('building.name = :name')
        .setParameters({ isActive: 'true', name })
        .getOne();
      if (!building) {
        throw new NotFoundException('Không tìm thấy tòa nhà');
      }
      return building;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAllFloor(buildingName: string) {
    try {
      const building = await this.buildingRepository
        .createQueryBuilder('building')
        .leftJoinAndSelect('building.floors', 'floor')
        .where('building.isActive = true')
        .where('building.name = :name')
        .setParameters({ name: buildingName })
        .getOne();

      if (!building) {
        throw new NotFoundException('Không tìm thấy tòa nhà');
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
        isActive: true,
      });

      if (!building) {
        throw new NotFoundException('Không tìm thấy tòa nhà');
      }

      const floor = await this.floorRepository.findOne(
        {
          name: floorName,
          building: {
            id: building.id,
          },
          isActive: true,
        },
        { relations: ['building', 'rooms'] },
      );

      if (!floor) {
        throw new NotFoundException('Không tìm thấy tầng');
      }
      return floor;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAllRoom(buildingName: string, floorName: string): Promise<Room[]> {
    try {
      const building = await this.buildingRepository.findOne({
        name: buildingName,
        isActive: true,
      });

      if (!building) {
        throw new NotFoundException('Không tìm thấy tòa nhà');
      }

      const floor = await this.floorRepository.findOne({
        isActive: true,
        name: floorName,
        building: {
          id: building.id,
        },
      });

      if (!floor) {
        throw new NotFoundException('Floor not found');
      }

      if (!floor) {
        throw new NotFoundException('Không tìm thấy tầng');
      }

      return await this.roomRepository.find({
        where: {
          isActive: true,
          floor: {
            id: floor.id,
          },
        },
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findRoom(buildingName: string, floorName: string, roomName: string) {
    try {
      const building = await this.buildingRepository.findOne({
        name: buildingName,
        isActive: true,
      });

      if (!building) {
        throw new NotFoundException('Không tìm thấy tòa nhà');
      }

      const floor = await this.floorRepository.findOne({
        isActive: true,
        name: floorName,
        building: {
          id: building.id,
        },
      });

      if (!floor) {
        throw new NotFoundException('Không tìm thấy tầng');
      }

      const room = await this.roomRepository
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.floor', 'floor')
        .leftJoinAndSelect('floor.building', 'building')
        .leftJoinAndSelect('room.employees', 'employee')
        .leftJoinAndSelect('employee.facilities', 'facility')
        .leftJoinAndSelect('facility.facilityType', 'facilityType')
        .leftJoinAndSelect('facility.configuration', 'configuration')
        .leftJoinAndSelect('room.roomFacilities', 'roomFacilities')
        .where('room.isActive = true')
        .andWhere('room.name = :name')
        .andWhere('floor.id = :floorId')
        .setParameters({ name: roomName, floorId: floor.id })
        .getOne();
      if (!room) {
        throw new NotFoundException('Không tìm thấy phòng');
      }
      return room;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async remove(id: number) {
    try {
      const building = await this.buildingRepository.findOne(id, {
        relations: [
          'floors',
          'floors.rooms',
          'floors.rooms.employees',
          'floors.rooms.roomFacilities',
        ],
      });

      if (!building) {
        throw new NotFoundException('Không tìm thấy tòa nhà');
      }

      building.floors.forEach((floor) => {
        floor.isActive = false;
        this.floorRepository.save(floor);
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
      });
      building.isActive = false;
      await this.buildingRepository.save(building);
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
