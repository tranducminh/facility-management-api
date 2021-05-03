import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { AuthenticationService } from '../authentication/authentication.service';
import { FacilityType } from '../facility-types/entities/facility-type.entity';
import { Specialize } from '../specializes/entities/specialize.entity';
import { CreateRepairmanDto } from './dto/create-repairman.dto';
import { LoginRepairmanDto } from './dto/login-repairman.dto';
import { UpdateRepairmanDto } from './dto/update-repairman.dto';
import { Repairman } from './entities/repairman.entity';

@Injectable()
export class RepairmanService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(Repairman)
    private readonly repairmanRepository: Repository<Repairman>,
    @InjectRepository(FacilityType)
    private readonly facilityTypeRepository: Repository<FacilityType>,
    @InjectRepository(Specialize)
    private readonly specializeRepository: Repository<Specialize>,
  ) {}

  async create(createRepairmanDto: CreateRepairmanDto) {
    try {
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
      for (let i = 0; i < facilityTypes.length; i++) {
        const typeName = facilityTypes[i];
        const newSpecialize = this.specializeRepository.create({
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

  async findAll(specialize?: string) {
    try {
      if (!specialize) {
        return await this.repairmanRepository.find({
          relations: ['specializes', 'specializes.facilityType'],
        });
      }
      return await this.repairmanRepository
        .createQueryBuilder('repairman')
        .leftJoinAndSelect('repairman.specializes', 's')
        .leftJoinAndSelect('s.facilityType', 'ft')
        .where('ft.name = :specialize')
        .leftJoinAndSelect('repairman.specializes', 'specialize')
        .leftJoinAndSelect('specialize.facilityType', 'facilityType')
        .orderBy('repairman.created_at', 'DESC')
        .setParameters({ specialize })
        .getMany();
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.repairmanRepository.findOne(
        { identity: id },
        {
          relations: [
            'specializes',
            'specializes.facilityType',
            'requests',
            'requests.employee',
            'histories',
            'histories.request',
            'histories.request.employee',
            'histories.request.employee.room',
            'histories.request.employee.room.floor',
            'histories.request.employee.room.floor.building',
            'histories.request.facility',
            'histories.request.facility.configuration',
            'histories.request.facility.facilityType',
            'histories.request.replacements',
          ],
        },
      );
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findMe(id: number) {
    try {
      return await this.repairmanRepository.findOne(id, {
        relations: ['specializes', 'specializes.facilityType'],
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findMyRequest(id: number) {
    try {
      return await this.repairmanRepository.findOne(id, {
        relations: [
          'specializes',
          'specializes.facilityType',
          'requests',
          'requests.employee',
          'requests.employee.room',
          'requests.employee.room.floor',
          'requests.employee.room.floor.building',
          'requests.facility',
          'requests.facility.facilityType',
          'requests.facility.configuration',
        ],
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findMyHistory(id: number) {
    try {
      return await this.repairmanRepository.findOne(id, {
        relations: [
          'specializes',
          'specializes.facilityType',
          'histories',
          'histories.request',
          'histories.request.employee',
          'histories.request.employee.room',
          'histories.request.employee.room.floor',
          'histories.request.employee.room.floor.building',
          'histories.request.facility',
          'histories.request.facility.configuration',
          'histories.request.facility.facilityType',
          'histories.request.replacements',
        ],
      });
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
    });
    if (!repairman) {
      throw new NotFoundException('Repairman not found');
    }
    const isAuth = await this.authenticationService.isMatchPassword(
      password,
      repairman.hashPassword,
    );
    if (!isAuth) {
      throw new UnauthorizedException('Password is incorrect');
    }
    return {
      repairman,
      token: this.authenticationService.generateAuthToken(
        repairman.id,
        'repairman',
      ),
    };
  }

  update(id: number, updateRepairmanDto: UpdateRepairmanDto) {
    return `This action updates a #${id} repairman`;
  }

  remove(id: number) {
    return `This action removes a #${id} repairman`;
  }
}
