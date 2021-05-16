import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { BooleanStatus } from 'src/common/enums/boolean-status.enum';
import { catchError } from 'src/common/helpers/catch-error';
import { uploadFileBase64 } from 'src/common/helpers/upload-file';
import { Repository } from 'typeorm';
import { AuthenticationService } from '../authentication/authentication.service';
import { Room } from '../rooms/entities/room.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { UpdateEmployeeAdminDto } from './dto/update-employee-admin.dto';
import { UpdateEmployeeMyselfDto } from './dto/update-employee-myself.dto';
import { Employee } from './entities/employee.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      const hashPassword = await this.authenticationService.generateHashPassword(
        createEmployeeDto.identity,
      );
      let newEmployee;
      if (createEmployeeDto.roomId) {
        const room = await this.roomRepository.findOne(
          createEmployeeDto.roomId,
        );
        newEmployee = this.employeeRepository.create({
          ...createEmployeeDto,
          hashPassword: hashPassword,
          room,
        });
      } else {
        newEmployee = this.employeeRepository.create({
          ...createEmployeeDto,
          hashPassword: hashPassword,
        });
      }
      return await this.employeeRepository.save(newEmployee);
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAll(
    limit_?: number,
    offset_?: number,
    hasRoom?: BooleanStatus,
  ): Promise<{ employees: Employee[]; totalPage: number }> {
    try {
      const limit = limit_ || 20;
      const offset = offset_ || 1;
      const totalCount = await this.employeeRepository.count();
      if (!hasRoom) {
        return {
          employees: await this.employeeRepository.find({
            skip: (offset - 1) * limit,
            take: limit,
            select: [
              'id',
              'identity',
              'name',
              'dateOfBirth',
              'unit',
              'email',
              'avatar',
              'phone',
              'hasRoom',
            ],
            relations: [
              'room',
              'room.floor',
              'room.floor.building',
              'facilities',
              'facilities.facilityType',
            ],
          }),
          totalPage: Math.ceil(totalCount / limit),
        };
      }
      return {
        employees: await this.employeeRepository.find({
          where: { hasRoom },
          skip: (offset - 1) * limit,
          take: limit,
          select: [
            'id',
            'identity',
            'name',
            'dateOfBirth',
            'unit',
            'email',
            'avatar',
            'phone',
            'hasRoom',
          ],
          relations: [
            'room',
            'room.floor',
            'room.floor.building',
            'facilities',
            'facilities.facilityType',
          ],
        }),
        totalPage: Math.ceil(totalCount / limit),
      };
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findOne(id: string): Promise<Employee> {
    try {
      const employee = await this.employeeRepository.findOne(
        {
          identity: id,
        },
        {
          relations: [
            'room',
            'room.floor',
            'room.floor.building',
            'facilities',
            'facilities.facilityType',
            'facilities.configuration',
          ],
        },
      );
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }
      return employee;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async updateMyself(
    id: number,
    updateEmployeeMyselfDto: UpdateEmployeeMyselfDto,
  ) {
    try {
      if (updateEmployeeMyselfDto.avatar) {
        const avatar = await uploadFileBase64(
          updateEmployeeMyselfDto.avatar || '',
        );
        return await this.employeeRepository.update(id, {
          ...updateEmployeeMyselfDto,
          avatar,
        });
      }
      const { dateOfBirth, email, phone } = updateEmployeeMyselfDto;
      return await this.employeeRepository.update(id, {
        dateOfBirth,
        email,
        phone,
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async updateByAdmin(
    id: number,
    updateEmployeeAdminDto: UpdateEmployeeAdminDto,
  ) {
    try {
      if (updateEmployeeAdminDto.avatar) {
        const avatar = await uploadFileBase64(
          updateEmployeeAdminDto.avatar || '',
        );
        return await this.employeeRepository.update(id, {
          ...updateEmployeeAdminDto,
          avatar,
        });
      }
      const {
        identity,
        name,
        dateOfBirth,
        unit,
        email,
        phone,
      } = updateEmployeeAdminDto;
      return await this.employeeRepository.update(id, {
        identity,
        name,
        dateOfBirth,
        unit,
        email,
        phone,
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }

  async login(
    loginEmployeeDto: LoginEmployeeDto,
  ): Promise<{
    employee: Employee;
    token: string;
  }> {
    const { identity, password } = loginEmployeeDto;
    const employee = await this.employeeRepository.findOne({
      identity,
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    const isAuth = await this.authenticationService.isMatchPassword(
      password,
      employee.hashPassword,
    );
    if (!isAuth) {
      throw new UnauthorizedException('Password is incorrect');
    }
    return {
      employee,
      token: this.authenticationService.generateAuthToken(
        employee.id,
        UserRole.EMPLOYEE,
        employee.channel,
      ),
    };
  }

  async findMe(id: number) {
    try {
      return await this.employeeRepository.findOne(id, {
        relations: ['room', 'room.floor', 'room.floor.building'],
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findMyFacilities(id: number) {
    try {
      return await this.employeeRepository.findOne(id, {
        relations: [
          'facilities',
          'facilities.configuration',
          'facilities.facilityType',
          'requests',
          'requests.repairman',
          'requests.repairman.specializes',
        ],
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findMyRequests(id: number) {
    try {
      return await this.employeeRepository.findOne(id, {
        relations: [
          'requests',
          'requests.repairman',
          'requests.repairman.specializes',
          'requests.repairman.specializes.facilityType',
          'requests.facility',
          'requests.facility.facilityType',
          'requests.facility.configuration',
          'requests.replacements',
        ],
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async updateRoom(employeeIdentity: string, roomId: number) {
    try {
      const room = await this.roomRepository.findOne(roomId, {
        relations: ['floor', 'floor.building'],
      });
      const employee = await this.employeeRepository.findOne({
        identity: employeeIdentity,
      });
      const updatedEmployee = await this.employeeRepository.save(
        Object.assign(employee, { room }),
      );
      this.notificationsService.create({
        receiver: employee,
        room,
        type: NotificationType.NEW_ROOM,
      });
      return updatedEmployee;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async removeRoom(employeeIdentity: string) {
    try {
      const employee = await this.employeeRepository.findOne({
        identity: employeeIdentity,
      });
      const updatedEmployee = await this.employeeRepository.save(
        Object.assign(employee, { room: null }),
      );
      this.notificationsService.create({
        receiver: employee,
        type: NotificationType.PENDING_ROOM,
      });
      return updatedEmployee;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
