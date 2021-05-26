import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { Configuration } from '../configurations/entities/configuration.entity';
import { Employee } from '../employees/entities/employee.entity';
import { FacilityType } from '../facility-types/entities/facility-type.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Replacement } from '../replacements/entities/replacement.entity';
import { Request } from '../requests/entities/request.entity';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { Facility } from './entities/facility.entity';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    @InjectRepository(FacilityType)
    private readonly facilityTypeRepository: Repository<FacilityType>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    @InjectRepository(Replacement)
    private readonly replacementRepository: Repository<Replacement>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createFacilityDto: CreateFacilityDto) {
    try {
      const { employeeId, facilityType } = createFacilityDto;
      let newFacility;
      const facilityType_ = await this.facilityTypeRepository.findOne({
        name: facilityType,
      });
      if (!facilityType_) {
        throw new NotFoundException('Không tìm tháy loại thiết bị');
      }
      if (employeeId) {
        const employee = await this.employeeRepository.findOne(employeeId, {
          where: { isActive: true },
        });
        if (!employee) {
          throw new NotFoundException('Không tìm thấy cán bộ được bàn giao');
        }
        newFacility = this.facilityRepository.create({
          ...createFacilityDto,
          employee,
          facilityType: facilityType_,
        });
      } else {
        newFacility = this.facilityRepository.create({
          ...createFacilityDto,
          facilityType: facilityType_,
        });
      }
      const saveFacility = await this.facilityRepository.save(newFacility);
      if (!saveFacility) {
        throw new BadRequestException('Tạo thiết bị không thành công');
      }
      return saveFacility;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAll({
    type,
    status,
    roomId,
  }: {
    type?: string;
    status?: string;
    roomId?: number;
  }) {
    try {
      if (type && status && roomId) {
        return await this.facilityRepository
          .createQueryBuilder('facility')
          .innerJoinAndSelect('facility.configuration', 'configuration')
          .innerJoinAndSelect('facility.employee', 'employee')
          .innerJoinAndSelect('facility.facilityType', 'facilityType')
          .innerJoinAndSelect('employee.room', 'room')
          .innerJoinAndSelect('room.floor', 'floor')
          .innerJoinAndSelect('floor.building', 'building')
          .where('room.id = :roomId')
          .andWhere(`facility.isActive = true`)
          .andWhere(`facilityType.name = :type`)
          .andWhere(`facility.status = :status`)
          .orderBy('facility.created_at', 'DESC')
          .setParameters({ roomId, type, status })
          .getMany();
      }
      if (type && status) {
        const facilityType = await this.facilityTypeRepository.findOne({
          name: type,
        });
        return await this.facilityRepository.find({
          where: {
            isActive: true,
            facilityType: { id: facilityType.id },
            status,
          },
          relations: [
            'configuration',
            'facilityType',
            'employee',
            'employee.room',
            'employee.room.floor',
            'employee.room.floor.building',
          ],
        });
      }
      if (type && roomId) {
        return await this.facilityRepository
          .createQueryBuilder('facility')
          .innerJoinAndSelect('facility.configuration', 'configuration')
          .innerJoinAndSelect('facility.employee', 'employee')
          .innerJoinAndSelect('facility.facilityType', 'facilityType')
          .innerJoinAndSelect('employee.room', 'room')
          .innerJoinAndSelect('room.floor', 'floor')
          .innerJoinAndSelect('floor.building', 'building')
          .where('room.id = :roomId')
          .andWhere(`facility.isActive = true`)
          .andWhere(`facilityType.name = :type`)
          .orderBy('facility.created_at', 'DESC')
          .setParameters({ roomId, type })
          .getMany();
      }
      if (status && roomId) {
        return await this.facilityRepository
          .createQueryBuilder('facility')
          .innerJoinAndSelect('facility.configuration', 'configuration')
          .innerJoinAndSelect('facility.employee', 'employee')
          .innerJoinAndSelect('facility.facilityType', 'facilityType')
          .innerJoinAndSelect('employee.room', 'room')
          .innerJoinAndSelect('room.floor', 'floor')
          .innerJoinAndSelect('floor.building', 'building')
          .where('room.id = :roomId')
          .andWhere(`facility.isActive = true`)
          .andWhere(`facility.status = :status`)
          .orderBy('facility.created_at', 'DESC')
          .setParameters({ roomId, status })
          .getMany();
      }
      if (type) {
        const facilityType = await this.facilityTypeRepository.findOne({
          name: type,
        });
        return await this.facilityRepository.find({
          where: { facilityType: { id: facilityType.id }, isActive: true },
          relations: [
            'configuration',
            'facilityType',
            'employee',
            'employee.room',
            'employee.room.floor',
            'employee.room.floor.building',
          ],
        });
      }
      if (status) {
        return await this.facilityRepository.find({
          where: { status, isActive: true },
          relations: [
            'configuration',
            'facilityType',
            'employee',
            'employee.room',
            'employee.room.floor',
            'employee.room.floor.building',
          ],
        });
      }
      if (roomId) {
        return await this.facilityRepository
          .createQueryBuilder('facility')
          .innerJoinAndSelect('facility.configuration', 'configuration')
          .innerJoinAndSelect('facility.employee', 'employee')
          .innerJoinAndSelect('facility.facilityType', 'facilityType')
          .innerJoinAndSelect('employee.room', 'room')
          .innerJoinAndSelect('room.floor', 'floor')
          .innerJoinAndSelect('floor.building', 'building')
          .where('room.id = :roomId')
          .andWhere('facility.isActive = true')
          .orderBy('facility.created_at', 'DESC')
          .setParameters({ roomId })
          .getMany();
      }
      return await this.facilityRepository.find({
        where: { isActive: true },
        relations: [
          'configuration',
          'facilityType',
          'employee',
          'employee.room',
          'employee.room.floor',
          'employee.room.floor.building',
        ],
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAllByEmployee(employeeId: number | null) {
    try {
      if (employeeId == null) {
        return await this.facilityRepository.find({
          where: { employee: null, isActive: true },
          relations: ['configuration', 'facilityType'],
        });
      }
      return await this.facilityRepository.find({
        where: { employee: { id: employeeId }, isActive: true },
        relations: [
          'configuration',
          'facilityType',
          'employee',
          'employee.room',
          'employee.room.floor',
          'employee.room.floor.building',
        ],
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findOne(id: number) {
    try {
      const facility = await this.facilityRepository.findOne(id, {
        where: { isActive: true },
        relations: [
          'facilityType',
          'configuration',
          'employee',
          'employee.room',
          'employee.room.floor',
          'employee.room.floor.building',
        ],
      });
      if (!facility) {
        throw new NotFoundException('Không tìm thấy thiết bị');
      }
      return facility;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async update(id: number, updateFacilityDto: UpdateFacilityDto) {
    try {
      const {
        employeeId,
        facilityType,
        configuration,
        name,
        origin,
        price,
      } = updateFacilityDto;
      const facilityType_ = await this.facilityTypeRepository.findOne({
        name: facilityType,
      });
      if (!facilityType_) {
        throw new NotFoundException('Không tìm tháy loại thiết bị');
      }
      const facility = await this.facilityRepository.findOne(id, {
        where: { isActive: true },
      });
      if (!facility) {
        throw new NotFoundException('Không tìm thấy thiết bị');
      }
      facility.configuration = configuration;
      facility.name = name;
      facility.origin = origin;
      facility.price = price;
      facility.facilityType = facilityType_;
      if (employeeId) {
        facility.employee = await this.employeeRepository.findOne(employeeId);
      } else {
        facility.employee = null;
      }
      const saveFacility = await this.facilityRepository.save(facility);
      if (!saveFacility) {
        throw new BadRequestException('Cập nhật thiết bị không thành công');
      }
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async remove(id: number) {
    try {
      const facility = await this.facilityRepository.findOne(id, {
        where: { isActive: true },
        relations: ['configuration', 'employee', 'requests', 'replacements'],
      });
      if (!facility) {
        throw new NotFoundException('Không tìm thấy thiết bị');
      }
      this.configurationRepository.update(facility.configuration.id, {
        isActive: false,
      });
      facility.requests.forEach((request) => {
        if (request.status !== RequestStatus.COMPLETED) {
          this.requestRepository.update(request.id, {
            isActive: false,
            employee: null,
          });
        } else {
          this.requestRepository.update(request.id, {
            isActive: false,
          });
        }
      });
      facility.replacements.forEach((replacement) => {
        this.replacementRepository.update(replacement.id, { isActive: true });
      });
      await this.facilityRepository.update(id, {
        isActive: false,
        employee: null,
        facilityType: null,
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async updateOwner(facilityId: number, employeeId: number) {
    try {
      const employee = await this.employeeRepository.findOne(employeeId, {
        where: { isActive: true },
      });
      if (!employee) {
        throw new NotFoundException('Không tìm thấy tài khoản cán bộ');
      }
      const facility = await this.facilityRepository.findOne(facilityId, {
        where: { isActive: true },
      });
      if (!facility) {
        throw new NotFoundException('Không tìm thấy thiết bị');
      }
      this.notificationsService.create({
        receiver: employee,
        facility,
        type: NotificationType.NEW_FACILITY_OWNER,
      });
      return await this.facilityRepository.update(facilityId, {
        employee,
        handoveredDate: new Date(),
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async removeOwner(facilityId: number) {
    try {
      const facility = await this.facilityRepository.findOne(facilityId, {
        where: { isActive: true },
        relations: ['employee'],
      });
      if (!facility) {
        throw new NotFoundException('Không tìm thấy thiết bị');
      }
      this.notificationsService.create({
        receiver: facility.employee,
        facility,
        type: NotificationType.REMOVED_FACILITY_OWNER,
      });
      return await this.facilityRepository.update(facilityId, {
        employee: null,
        handoveredDate: null,
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
