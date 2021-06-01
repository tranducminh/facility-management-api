import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto } from 'src/common/dto/change-password.dto';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { catchError } from 'src/common/helpers/catch-error';
import { uploadFileBase64 } from 'src/common/helpers/upload-file';
import { Repository } from 'typeorm';
import { AuthenticationService } from '../authentication/authentication.service';
import { Employee } from '../employees/entities/employee.entity';
import { FacilityType } from '../facility-types/entities/facility-type.entity';
import { History } from '../histories/entities/history.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Request } from '../requests/entities/request.entity';
import { Specialize } from '../specializes/entities/specialize.entity';
import { CreateRepairmanDto } from './dto/create-repairman.dto';
import { LoginRepairmanDto } from './dto/login-repairman.dto';
import { UpdateRepairmanAdminDto } from './dto/update-repairman-admin.dto';
import { UpdateRepairmanMyselfDto } from './dto/update-repairman-myself.dto';
import { Repairman } from './entities/repairman.entity';

@Injectable()
export class RepairmanService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(Repairman)
    private readonly repairmanRepository: Repository<Repairman>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(FacilityType)
    private readonly facilityTypeRepository: Repository<FacilityType>,
    @InjectRepository(Specialize)
    private readonly specializeRepository: Repository<Specialize>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createRepairmanDto: CreateRepairmanDto) {
    try {
      const existEmployee = await this.employeeRepository.findOne({
        identity: createRepairmanDto.identity,
        isActive: true,
      });
      const existRepairman = await this.repairmanRepository.findOne({
        identity: createRepairmanDto.identity,
        isActive: true,
      });
      if (existRepairman || existEmployee) {
        throw new BadRequestException('Mã nhân viên đã tồn tại');
      }
      const hashPassword = await this.authenticationService.generateHashPassword(
        createRepairmanDto.identity,
      );
      const { identity, name, unit, facilityTypes } = createRepairmanDto;
      const newRepairman = this.repairmanRepository.create({
        identity,
        name,
        unit,
        hashPassword,
      });
      const saveRepairman = await this.repairmanRepository.save(newRepairman);
      if (!saveRepairman) {
        throw new NotFoundException(
          'Tạo tài khoản kỹ thuật viên không thành công',
        );
      }
      const types = await this.facilityTypeRepository.find();
      for (let i = 0; i < types.length; i++) {
        const typeName = types[i].name;
        const active = facilityTypes.includes(typeName);
        const newSpecialize = this.specializeRepository.create({
          active,
          repairman: saveRepairman,
          facilityType: await this.facilityTypeRepository.findOne({
            name: typeName,
          }),
        });
        this.specializeRepository.save(newSpecialize);
      }
      return saveRepairman;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAll(
    limit_?: number,
    offset_?: number,
    specialize?: string,
  ): Promise<{ repairman: Repairman[]; totalPage: number }> {
    try {
      const limit = limit_ || 20;
      const offset = offset_ || 1;
      if (!specialize) {
        const [repairman, count] = await this.repairmanRepository.findAndCount({
          where: { isActive: true },
          skip: (offset - 1) * limit,
          take: limit,
          relations: ['specializes', 'specializes.facilityType'],
        });
        return {
          repairman,
          totalPage: Math.ceil(count / limit),
        };
      }
      const [repairman, count] = await this.repairmanRepository
        .createQueryBuilder('repairman')
        .leftJoinAndSelect('repairman.specializes', 's')
        .leftJoinAndSelect('s.facilityType', 'ft')
        .where('ft.name = :specialize')
        .andWhere('repairman.isActive = true')
        .leftJoinAndSelect('repairman.specializes', 'specialize')
        .leftJoinAndSelect('specialize.facilityType', 'facilityType')
        .skip((offset - 1) * limit)
        .limit(limit)
        .orderBy('repairman.created_at', 'DESC')
        .setParameters({ specialize })
        .getManyAndCount();
      return {
        repairman,
        totalPage: Math.ceil(count / limit),
      };
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findOne(id: string) {
    try {
      const repairman = await this.repairmanRepository
        .createQueryBuilder('repairman')
        .leftJoinAndSelect('repairman.specializes', 'specialize')
        .leftJoinAndSelect('specialize.facilityType', 'facilityType')
        .leftJoinAndSelect('repairman.requests', 'request')
        .leftJoinAndSelect('request.employee', 'employee')
        .leftJoinAndSelect('repairman.histories', 'history')
        .leftJoinAndSelect('history.request', 'requestHis')
        .leftJoinAndSelect('requestHis.employee', 'employeeHis')
        .leftJoinAndSelect('employeeHis.room', 'roomHis')
        .leftJoinAndSelect('roomHis.floor', 'floorHis')
        .leftJoinAndSelect('floorHis.building', 'buildingHis')
        .leftJoinAndSelect('requestHis.facility', 'facilityHis')
        .leftJoinAndSelect('facilityHis.configuration', 'configurationHis')
        .leftJoinAndSelect('facilityHis.facilityType', 'facilityTypeHis')
        .leftJoinAndSelect('requestHis.replacements', 'replacementsHis')
        .where('repairman.identity = :identity')
        .andWhere('repairman.isActive = true')
        .setParameters({ identity: id })
        .getOne();
      if (!repairman) {
        throw new NotFoundException('Không tìm thấy tài khoản kỹ thuật viên');
      }
      return repairman;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findMe(id: number) {
    try {
      const repairman = await this.repairmanRepository.findOne(id, {
        where: { isActive: true },
        relations: ['specializes', 'specializes.facilityType'],
      });
      if (!repairman) {
        throw new NotFoundException('Không tìm thấy tài khoản kỹ thuật viên');
      }
      return repairman;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findMyRequest(id: number) {
    try {
      return await this.repairmanRepository
        .createQueryBuilder('repairman')
        .leftJoinAndSelect('repairman.specializes', 'specialize')
        .leftJoinAndSelect('specialize.facilityType', 'facilityType')
        .leftJoinAndSelect('repairman.requests', 'request')
        .leftJoinAndSelect('request.employee', 'employee')
        .leftJoinAndSelect('employee.room', 'room')
        .leftJoinAndSelect('room.floor', 'floor')
        .leftJoinAndSelect('floor.building', 'building')
        .leftJoinAndSelect('request.facility', 'facility')
        .leftJoinAndSelect('facility.facilityType', 'facilityTypeFac')
        .leftJoinAndSelect('facility.configuration', 'configuration')
        .where('repairman.id = :id')
        .andWhere('repairman.isActive = true')
        .setParameters({ id })
        .orderBy('request.updated_at', 'DESC')
        .getOne();
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findMyHistory(id: number) {
    try {
      return await this.repairmanRepository
        .createQueryBuilder('repairman')
        .leftJoinAndSelect('repairman.specializes', 'specialize')
        .leftJoinAndSelect('specialize.facilityType', 'facilityType')
        .leftJoinAndSelect('repairman.histories', 'history')
        .leftJoinAndSelect('history.request', 'request')
        .leftJoinAndSelect('request.employee', 'employee')
        .leftJoinAndSelect('employee.room', 'room')
        .leftJoinAndSelect('room.floor', 'floor')
        .leftJoinAndSelect('floor.building', 'building')
        .leftJoinAndSelect('request.facility', 'facility')
        .leftJoinAndSelect('facility.configuration', 'configuration')
        .leftJoinAndSelect('facility.facilityType', 'facilityTypeFac')
        .leftJoinAndSelect('request.replacements', 'replacements')
        .where('repairman.id = :id')
        .andWhere('repairman.isActive = true')
        .setParameters({ id })
        .orderBy('history.created_at', 'DESC')
        .getOne();
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async login(
    loginRepairmanDto: LoginRepairmanDto,
  ): Promise<{
    token: string;
    repairman: Repairman;
  }> {
    const { identity, password } = loginRepairmanDto;
    const repairman = await this.repairmanRepository.findOne({
      identity,
      isActive: true,
    });
    if (!repairman) {
      throw new NotFoundException('Không tìm thấy tài khoản kỹ thuật viên');
    }
    const isAuth = await this.authenticationService.isMatchPassword(
      password,
      repairman.hashPassword,
    );
    if (!isAuth) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }
    return {
      repairman,
      token: this.authenticationService.generateAuthToken(
        repairman.id,
        UserRole.REPAIRMAN,
        repairman.channel,
      ),
    };
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    const repairman = await this.repairmanRepository.findOne(id);
    if (!repairman) {
      throw new NotFoundException('Không tìm thấy kỹ thuật viên');
    }
    const { oldPassword, newPassword } = changePasswordDto;
    const isAuth = await this.authenticationService.isMatchPassword(
      oldPassword,
      repairman.hashPassword,
    );
    if (!isAuth) {
      throw new UnauthorizedException('Mật khẩu hiện tại không chính xác');
    }
    repairman.hashPassword = await this.authenticationService.generateHashPassword(
      newPassword,
    );
    return await this.repairmanRepository.save(repairman);
  }

  async updateMyself(
    id: number,
    updateRepairmanMyselfDto: UpdateRepairmanMyselfDto,
  ) {
    try {
      const { specializes, ...data } = updateRepairmanMyselfDto;
      specializes.forEach((specialize) => {
        this.specializeRepository.update(specialize.id, {
          active: specialize.active,
          description: specialize.description,
        });
      });
      if (updateRepairmanMyselfDto.avatar) {
        const avatar = await uploadFileBase64(
          updateRepairmanMyselfDto.avatar || '',
        );
        await this.repairmanRepository.update(id, {
          ...data,
          avatar,
        });
        const repairman = await this.repairmanRepository.findOne(id);
        return repairman;
      }
      const { dateOfBirth, email, phone } = updateRepairmanMyselfDto;
      return await this.repairmanRepository.update(id, {
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
    updateRepairmanAdminDto: UpdateRepairmanAdminDto,
  ) {
    try {
      const existEmployee = await this.employeeRepository.findOne({
        identity: updateRepairmanAdminDto.identity,
        isActive: true,
      });
      const existRepairman = await this.repairmanRepository.findOne({
        identity: updateRepairmanAdminDto.identity,
        isActive: true,
      });
      if ((existRepairman && existRepairman.id !== id) || existEmployee) {
        throw new BadRequestException('Mã nhân viên đã tồn tại');
      }
      const { specializes, ...data } = updateRepairmanAdminDto;
      const repairman = await this.repairmanRepository.findOne(id);
      if (!repairman) {
        throw new NotFoundException('Không tìm thấy tài khoản kỹ thuật viên');
      }
      this.notificationsService.create({
        receiver: repairman,
        type: NotificationType.UPDATED_PROFILE,
      });
      specializes.forEach((specialize) => {
        this.specializeRepository.update(specialize.id, {
          active: specialize.active,
          description: specialize.description,
        });
      });
      if (updateRepairmanAdminDto.avatar) {
        const avatar = await uploadFileBase64(
          updateRepairmanAdminDto.avatar || '',
        );
        return await this.repairmanRepository.update(id, {
          ...data,
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
      } = updateRepairmanAdminDto;

      return await this.repairmanRepository.update(id, {
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
      const repairman = await this.repairmanRepository.findOne(id, {
        relations: ['histories', 'requests', 'specializes'],
      });
      if (!repairman) {
        throw new NotFoundException('Không tìm thấy tài khoản kỹ thuật viên');
      }
      repairman.histories.forEach((history) => {
        this.historyRepository.update(history.id, { isActive: false });
      });
      repairman.requests.forEach((request) => {
        this.requestRepository.update(request.id, {
          status: RequestStatus.PENDING,
          repairman: null,
        });
      });
      repairman.specializes.forEach((specialize) => {
        this.specializeRepository.update(specialize.id, {
          isActive: false,
          facilityType: null,
        });
      });
      await this.repairmanRepository.update(repairman.id, { isActive: false });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
