import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityStatus } from 'src/common/enums/facility-status.enum';
import { HistoryStatus } from 'src/common/enums/history-status.enum';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { Facility } from '../facilities/entities/facility.entity';
import { History } from '../histories/entities/history.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Repairman } from '../repairman/entities/repairman.entity';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { CompleteRequestDto } from './dto/complete-request.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { RejectRequestDto } from './dto/reject-request.dto';
import { UnCompleteRequestDto } from './dto/uncomplete-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request } from './entities/request.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Repairman)
    private readonly repairmanRepository: Repository<Repairman>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createRequestDto: CreateRequestDto, employeeId: number) {
    try {
      const employee = await this.employeeRepository.findOne(employeeId, {
        where: { isActive: true },
        relations: ['facilities'],
      });
      if (!employee) {
        throw new NotFoundException('Không tìm thấy tài khoản cán bộ');
      }
      const isOwner = employee.facilities.filter(
        (facility) => facility.id === createRequestDto.facilityId,
      );
      if (isOwner.length <= 0) {
        throw new ForbiddenException(
          'Thiết bị này không thuốc quyền sở hữu của bạn',
        );
      }
      const facility = await this.facilityRepository.findOne(
        createRequestDto.facilityId,
        { where: { isActive: true } },
      );
      if (!facility) {
        throw new NotFoundException('Không tìm thấy thiết bị');
      }
      await this.facilityRepository.update(facility.id, {
        status: FacilityStatus.ERROR,
      });
      const newRequest = this.requestRepository.create({
        ...createRequestDto,
        employee,
        facility,
      });
      const saveRequest = await this.requestRepository.save(newRequest);
      this.notificationsService.create({
        sender: employee,
        request: saveRequest,
        type: NotificationType.NEW_REQUEST,
      });
      return saveRequest;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAll(limit_?: number, offset_?: number, status?: RequestStatus) {
    try {
      const limit = limit_ || 20;
      const offset = offset_ || 1;
      if (!status) {
        const [requests, count] = await this.requestRepository.findAndCount({
          where: { isActive: true },
          skip: (offset - 1) * limit,
          take: limit,
          relations: [
            'employee',
            'employee.room',
            'employee.room.floor',
            'employee.room.floor.building',
            'repairman',
            'repairman.specializes',
            'repairman.specializes.facilityType',
            'facility',
            'facility.configuration',
            'facility.facilityType',
            'replacements',
          ],
        });
        return {
          requests,
          totalPage: Math.ceil(count / limit),
        };
      }
      const [requests, count] = await this.requestRepository.findAndCount({
        where: { status, isActive: true },
        skip: (offset - 1) * limit,
        take: limit,
        relations: [
          'employee',
          'employee.room',
          'employee.room.floor',
          'employee.room.floor.building',
          'repairman',
          'repairman.specializes',
          'repairman.specializes.facilityType',
          'facility',
          'facility.configuration',
          'facility.facilityType',
          'replacements',
        ],
      });
      return {
        requests,
        totalPage: Math.ceil(count / limit),
      };
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findOne(id: number) {
    try {
      const request = await this.requestRepository.findOne(id, {
        where: { isActive: true },
      });
      if (!request) {
        throw new NotFoundException('Không tìm thấy yêu cầu');
      }
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async update(id: number, updateRequestDto: UpdateRequestDto) {
    try {
      const request = await this.requestRepository.findOne(id, {
        where: { isActive: true },
      });
      if (!request) {
        throw new NotFoundException('Không tìm thấy yêu cầu');
      }
      if (request.status === RequestStatus.PENDING) {
        return await this.requestRepository.update(id, { ...updateRequestDto });
      } else {
        throw new BadRequestException('Không thể cập nhật yêu cầu');
      }
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async assign(id: number, approveRequestDto: ApproveRequestDto) {
    try {
      const repairman = await this.repairmanRepository.findOne(
        approveRequestDto.repairmanId,
        { where: { isActive: true } },
      );
      if (!repairman) {
        throw new NotFoundException('Không tìm thấy tài khoản kỹ thuật viên');
      }
      const request = await this.requestRepository.findOne(id, {
        relations: ['employee', 'facility'],
        where: { isActive: true },
      });
      if (!request) {
        throw new NotFoundException('Không tìm thấy yêu cầu');
      }
      this.facilityRepository.update(request.facility.id, {
        status: FacilityStatus.ERROR,
      });
      this.notificationsService.create({
        receiver: repairman,
        request,
        type: NotificationType.ASSIGNED_TASK,
      });
      this.notificationsService.create({
        receiver: request.employee,
        request,
        type: NotificationType.APPROVED_REQUEST,
      });
      return await this.requestRepository.update(id, {
        status: RequestStatus.ASSIGNED,
        repairman,
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async delete(id: number) {
    try {
      const request = await this.requestRepository.findOne(id, {
        relations: ['facility'],
        where: { isActive: true },
      });
      if (!request) {
        throw new NotFoundException('Không tìm thấy yêu cầu');
      }
      if (request.status === RequestStatus.PENDING) {
        this.facilityRepository.update(request.facility.id, {
          status: FacilityStatus.READY,
        });
        return await this.requestRepository.update(id, {
          status: RequestStatus.DELETED,
        });
      }
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async process(id: number) {
    try {
      const request = await this.requestRepository.findOne(id, {
        relations: ['repairman', 'employee', 'facility'],
        where: { isActive: true },
      });
      if (!request) {
        throw new NotFoundException('Không tìm thấy yêu cầu');
      }
      this.facilityRepository.update(request.facility.id, {
        status: FacilityStatus.REPAIRING,
      });
      this.notificationsService.create({
        sender: request.repairman,
        request,
        type: NotificationType.STARTED_TASK,
      });
      this.notificationsService.create({
        sender: request.repairman,
        receiver: request.employee,
        request,
        type: NotificationType.INPROCESS_REQUEST,
      });
      return await this.requestRepository.update(id, {
        status: RequestStatus.INPROCESS,
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async complete(
    id: number,
    completeRequestDto: CompleteRequestDto,
    repairmanId?: number,
  ) {
    try {
      const repairman = await this.repairmanRepository.findOne(repairmanId);
      if (!repairman) {
        throw new NotFoundException('Không tìm thấy tài khoản kỹ thuật viên');
      }
      const request = await this.requestRepository.findOne(id, {
        relations: ['repairman', 'employee', 'facility'],
        where: { isActive: true },
      });
      if (!request) {
        throw new NotFoundException('Không tìm thấy yêu cầu');
      }
      this.facilityRepository.update(request.facility.id, {
        status: FacilityStatus.READY,
      });
      const newHistory = this.historyRepository.create({
        request,
        repairman,
        status: HistoryStatus.COMPLETED,
      });
      this.historyRepository.save(newHistory);
      this.notificationsService.create({
        sender: request.repairman,
        request,
        type: NotificationType.COMPLETED_TASK,
      });
      this.notificationsService.create({
        sender: request.repairman,
        receiver: request.employee,
        request,
        type: NotificationType.COMPLETED_REQUEST,
      });
      return await this.requestRepository.update(id, {
        ...completeRequestDto,
        status: RequestStatus.COMPLETED,
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async unComplete(
    id: number,
    unCompleteRequestDto: UnCompleteRequestDto,
    repairmanId: number,
  ) {
    try {
      const repairman = await this.repairmanRepository.findOne(repairmanId, {
        where: { isActive: true },
      });
      if (!repairman) {
        throw new NotFoundException('Không tìm thấy tài khoản kỹ thuật viên');
      }
      const request = await this.requestRepository.findOne(id, {
        relations: ['facility'],
        where: { isActive: true },
      });
      if (!request) {
        throw new NotFoundException('Không tìm thấy yêu cầu');
      }
      this.facilityRepository.update(request.facility.id, {
        status: FacilityStatus.ERROR,
      });
      const newHistory = this.historyRepository.create({
        request,
        repairman,
        status: HistoryStatus.UNCOMPLETED,
        ...unCompleteRequestDto,
      });
      this.historyRepository.save(newHistory);
      this.notificationsService.create({
        sender: request.repairman,
        request,
        type: NotificationType.UNCOMPLETED_TASK,
      });
      this.notificationsService.create({
        sender: request.repairman,
        receiver: request.employee,
        request,
        type: NotificationType.UNCOMPLETED_REQUEST,
      });
      return await this.requestRepository.update(id, {
        ...unCompleteRequestDto,
        status: RequestStatus.UNCOMPLETED,
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async reject(id: number, rejectRequestDto: RejectRequestDto) {
    try {
      const request = await this.requestRepository.findOne(id, {
        relations: ['employee', 'facility'],
        where: { isActive: true },
      });
      if (!request) {
        throw new NotFoundException('Không tìm thấy yêu cầu');
      }
      this.facilityRepository.update(request.facility.id, {
        status: FacilityStatus.READY,
      });
      this.notificationsService.create({
        receiver: request.employee,
        request,
        type: NotificationType.REJECTED_REQUEST,
      });
      return await this.requestRepository.update(id, {
        status: RequestStatus.REJECTED,
        ...rejectRequestDto,
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async rejectTask(
    id: number,
    unCompleteRequestDto: UnCompleteRequestDto,
    repairmanId: number,
  ) {
    try {
      const repairman = await this.repairmanRepository.findOne(repairmanId, {
        where: { isActive: true },
      });
      if (!repairman) {
        throw new NotFoundException('Không tìm thấy tài khoản kỹ thuật viên');
      }
      const request = await this.requestRepository.findOne(id, {
        relations: ['facility'],
        where: { isActive: true },
      });
      if (!request) {
        throw new NotFoundException('Không tìm thấy yêu cầu');
      }
      this.facilityRepository.update(request.facility.id, {
        status: FacilityStatus.ERROR,
      });
      const newHistory = this.historyRepository.create({
        request,
        repairman,
        status: HistoryStatus.UNCOMPLETED,
        ...unCompleteRequestDto,
      });
      this.historyRepository.save(newHistory);
      this.notificationsService.create({
        sender: request.repairman,
        request,
        type: NotificationType.REJECTED_TASK,
      });
      return await this.requestRepository.update(id, {
        ...unCompleteRequestDto,
        status: RequestStatus.UNCOMPLETED,
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
