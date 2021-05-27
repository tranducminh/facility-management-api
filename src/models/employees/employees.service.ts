import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BooleanStatus } from 'src/common/enums/boolean-status.enum';
import { catchError } from 'src/common/helpers/catch-error';
import { uploadFileBase64 } from 'src/common/helpers/upload-file';
import { Repository } from 'typeorm';
import { AuthenticationService } from '../authentication/authentication.service';
import { Room } from '../rooms/entities/room.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { UpdateEmployeeAdminDto } from './dto/update-employee-admin.dto';
import { UpdateEmployeeMyselfDto } from './dto/update-employee-myself.dto';
import { Employee } from './entities/employee.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Facility } from '../facilities/entities/facility.entity';
import { Request } from '../requests/entities/request.entity';
import { Replacement } from '../replacements/entities/replacement.entity';
import { History } from '../histories/entities/history.entity';
import { FacilityStatus } from 'src/common/enums/facility-status.enum';
import { ChangePasswordDto } from 'src/common/dto/change-password.dto';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    @InjectRepository(Replacement)
    private readonly replacementRepository: Repository<Replacement>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
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
      const saveEmployee = await this.employeeRepository.save(newEmployee);
      if (!saveEmployee) {
        throw new NotFoundException('Tạo tài khoản cán bộ không thành công');
      }
      return saveEmployee;
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
            where: { isActive: true },
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
          where: { hasRoom, isActive: true },
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
            'isActive',
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
          isActive: true,
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
        throw new NotFoundException('Không tìm thấy cán bộ');
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
      const employee = await this.employeeRepository.findOne(id, {
        where: { isActive: true },
      });
      this.notificationsService.create({
        receiver: employee,
        type: NotificationType.UPDATED_PROFILE,
      });
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

  async remove(id: number) {
    try {
      const employee = await this.employeeRepository.findOne(id, {
        where: { isActive: true },
        relations: ['facilities', 'requests', 'requests.replacements'],
      });
      if (!employee) {
        throw new NotFoundException('Không tìm thấy cán bộ');
      }
      employee.requests.forEach(async (request) => {
        this.requestRepository.update(request.id, { isActive: false });
        request.replacements.forEach((replacement) => {
          this.replacementRepository.update(replacement.id, {
            isActive: false,
          });
        });
      });
      employee.facilities.forEach((facility) => {
        this.facilityRepository.update(facility.id, {
          employee: null,
          status: FacilityStatus.READY,
        });
      });
      await this.employeeRepository.update(id, { isActive: false, room: null });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
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
      isActive: true,
    });
    if (!employee) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }
    const isAuth = await this.authenticationService.isMatchPassword(
      password,
      employee.hashPassword,
    );
    if (!isAuth) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
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

  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    const employee = await this.employeeRepository.findOne(id);
    if (!employee) {
      throw new NotFoundException('Không tìm thấy cán bộ');
    }
    const { oldPassword, newPassword } = changePasswordDto;
    const isAuth = await this.authenticationService.isMatchPassword(
      oldPassword,
      employee.hashPassword,
    );
    if (!isAuth) {
      throw new UnauthorizedException('Mật khẩu hiện tại không chính xác');
    }
    return await this.employeeRepository.update(id, {
      hashPassword: await this.authenticationService.generateHashPassword(
        newPassword,
      ),
    });
  }

  async findMe(id: number) {
    try {
      const employee = await this.employeeRepository.findOne(id, {
        where: { isActive: true },
        relations: ['room', 'room.floor', 'room.floor.building'],
      });
      if (!employee) {
        throw new NotFoundException('Không tìm thấy tài khoản');
      }
      return employee;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findMyFacilities(id: number) {
    try {
      const employee = await this.employeeRepository.findOne(id, {
        where: { isActive: true },
        relations: [
          'facilities',
          'facilities.configuration',
          'facilities.facilityType',
          'requests',
          'requests.repairman',
          'requests.repairman.specializes',
        ],
      });
      if (!employee) {
        throw new NotFoundException('Không tìm thấy tài khoản');
      }
      return employee;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findMyRequests(id: number) {
    try {
      const employee = await this.employeeRepository.findOne(id, {
        where: { isActive: true },
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
      if (!employee) {
        throw new NotFoundException('Không tìm thấy tài khoản');
      }
      return employee;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async updateRoom(employeeIdentity: string, roomId: number) {
    try {
      const room = await this.roomRepository.findOne(roomId, {
        where: { isActive: true },
        relations: ['floor', 'floor.building'],
      });
      if (!room) {
        throw new NotFoundException('Không tìm thấy phòng cần cập nhật');
      }
      const employee = await this.employeeRepository.findOne({
        identity: employeeIdentity,
        isActive: true,
      });
      if (!employee) {
        throw new NotFoundException('Không tìm thấy tài khoản cần cập nhật');
      }
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
      if (!employee) {
        throw new NotFoundException('Không tìm thấy tài khoản cần cập nhật');
      }
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
