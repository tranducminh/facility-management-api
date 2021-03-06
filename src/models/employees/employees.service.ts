import {
  BadRequestException,
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
import { FacilityStatus } from 'src/common/enums/facility-status.enum';
import { ChangePasswordDto } from 'src/common/dto/change-password.dto';
import { Repairman } from '../repairman/entities/repairman.entity';

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
    @InjectRepository(Repairman)
    private readonly repairmanRepository: Repository<Repairman>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      const existEmployee = await this.employeeRepository.findOne({
        identity: createEmployeeDto.identity,
        isActive: true,
      });
      const existRepairman = await this.repairmanRepository.findOne({
        identity: createEmployeeDto.identity,
        isActive: true,
      });
      if (existRepairman || existEmployee) {
        throw new BadRequestException('M?? nh??n vi??n ???? t???n t???i');
      }
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
        throw new NotFoundException('T???o t??i kho???n c??n b??? kh??ng th??nh c??ng');
      }
      return saveEmployee;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAllWithLimit(
    limit?: number,
    offset?: number,
    hasRoom?: BooleanStatus,
  ): Promise<{ employees: Employee[]; totalPage: number }> {
    try {
      const totalCount = await this.employeeRepository.count({
        isActive: true,
      });
      if (!hasRoom) {
        return {
          employees: await this.employeeRepository.find({
            where: { isActive: true },
            skip: (offset - 1) * limit,
            take: limit,
            order: { firstName: 'ASC' },
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
              'firstName',
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

  async findAll(hasRoom: BooleanStatus): Promise<Employee[]> {
    try {
      if (!hasRoom) {
        return await this.employeeRepository.find({
          where: { isActive: true },
          order: { firstName: 'ASC' },
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
            'firstName',
          ],
          relations: [
            'room',
            'room.floor',
            'room.floor.building',
            'facilities',
            'facilities.facilityType',
          ],
        });
      }
      return await this.employeeRepository.find({
        where: { hasRoom, isActive: true },
        order: { firstName: 'ASC' },
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
          'firstName',
        ],
        relations: [
          'room',
          'room.floor',
          'room.floor.building',
          'facilities',
          'facilities.facilityType',
        ],
      });
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
        throw new NotFoundException('Kh??ng t??m th???y c??n b???');
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
      const existEmployee = await this.employeeRepository.findOne({
        identity: updateEmployeeAdminDto.identity,
        isActive: true,
      });
      const existRepairman = await this.repairmanRepository.findOne({
        identity: updateEmployeeAdminDto.identity,
        isActive: true,
      });

      if (existRepairman || (existEmployee && existEmployee.id !== id)) {
        throw new BadRequestException('M?? nh??n vi??n ???? t???n t???i');
      }
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
        throw new NotFoundException('Kh??ng t??m th???y c??n b???');
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
      throw new NotFoundException('Kh??ng t??m th???y t??i kho???n');
    }
    const isAuth = await this.authenticationService.isMatchPassword(
      password,
      employee.hashPassword,
    );
    if (!isAuth) {
      throw new UnauthorizedException('M???t kh???u kh??ng ch??nh x??c');
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
      throw new NotFoundException('Kh??ng t??m th???y c??n b???');
    }
    const { oldPassword, newPassword } = changePasswordDto;
    const isAuth = await this.authenticationService.isMatchPassword(
      oldPassword,
      employee.hashPassword,
    );
    if (!isAuth) {
      throw new UnauthorizedException('M???t kh???u hi???n t???i kh??ng ch??nh x??c');
    }
    employee.hashPassword = await this.authenticationService.generateHashPassword(
      newPassword,
    );
    return await this.employeeRepository.save(employee);
  }

  async findMe(id: number) {
    try {
      const employee = await this.employeeRepository.findOne(id, {
        where: { isActive: true },
        relations: ['room', 'room.floor', 'room.floor.building'],
      });
      if (!employee) {
        throw new NotFoundException('Kh??ng t??m th???y t??i kho???n');
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
        throw new NotFoundException('Kh??ng t??m th???y t??i kho???n');
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
        throw new NotFoundException('Kh??ng t??m th???y t??i kho???n');
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
        throw new NotFoundException('Kh??ng t??m th???y ph??ng c???n c???p nh???t');
      }
      const employee = await this.employeeRepository.findOne({
        identity: employeeIdentity,
        isActive: true,
      });
      if (!employee) {
        throw new NotFoundException('Kh??ng t??m th???y t??i kho???n c???n c???p nh???t');
      }
      employee.room = room;
      employee.hasRoom = BooleanStatus.TRUE;
      const updatedEmployee = await this.employeeRepository.save(employee);
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
        throw new NotFoundException('Kh??ng t??m th???y t??i kho???n c???n c???p nh???t');
      }
      employee.room = null;
      employee.hasRoom = BooleanStatus.FALSE;
      const updatedEmployee = await this.employeeRepository.save(employee);
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
