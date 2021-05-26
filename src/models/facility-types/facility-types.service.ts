import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { FacilityType } from './entities/facility-type.entity';

@Injectable()
export class FacilityTypesService {
  constructor(
    @InjectRepository(FacilityType)
    private readonly facilityTypeRepository: Repository<FacilityType>,
  ) {}

  async findOneByName(name: string) {
    try {
      return await this.facilityTypeRepository
        .createQueryBuilder('facilityType')
        .leftJoinAndSelect('facilityType.facilities', 'facility')
        .leftJoinAndSelect('facilityType.specializes', 'specialize')
        .leftJoinAndSelect('specialize.repairman', 'repairman')
        .where('facilityType.name = :name')
        .andWhere('facility.isActive = true')
        .setParameters({ name, isActive: true })
        .getOne();
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
