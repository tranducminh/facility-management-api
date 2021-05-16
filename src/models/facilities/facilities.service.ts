import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { FacilityType } from '../facility-types/entities/facility-type.entity';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { Facility } from './entities/facility.entity';

const computerSelection = [];
const printerSelection = [];
const faxSelection = [];
const nodeSelection = [];
@Injectable()
export class FacilitiesService {
  constructor(
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    @InjectRepository(FacilityType)
    private readonly facilityTypeRepository: Repository<FacilityType>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createFacilityDto: CreateFacilityDto) {
    const { employeeId, facilityType } = createFacilityDto;
    let newFacility;
    const facilityType_ = await this.facilityTypeRepository.findOne({
      name: facilityType,
    });
    if (employeeId) {
      const employee = await this.employeeRepository.findOne(employeeId);
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
    return await this.facilityRepository.save(newFacility);
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
          where: { facilityType: { id: facilityType.id } },
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
          where: { status },
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
          .orderBy('facility.created_at', 'DESC')
          .setParameters({ roomId })
          .getMany();
      }
      return await this.facilityRepository.find({
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
          where: { employee: null },
          relations: ['configuration', 'facilityType'],
        });
      }
      return await this.facilityRepository.find({
        where: { employee: { id: employeeId } },
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
      return await this.facilityRepository.findOne(id, {
        relations: [
          'facilityType',
          'configuration',
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

  update(id: number, updateFacilityDto: UpdateFacilityDto) {
    return `This action updates a #${id} facility`;
  }

  remove(id: number) {
    return `This action removes a #${id} facility`;
  }

  async updateOwner(facilityId: number, employeeId: number) {
    try {
      const employee = await this.employeeRepository.findOne(employeeId);
      return await this.facilityRepository.update(facilityId, { employee });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async removeOwner(facilityId: number) {
    try {
      return await this.facilityRepository.update(facilityId, {
        employee: null,
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
