import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { Specialize } from './entities/specialize.entity';

@Injectable()
export class SpecializesService {
  constructor(
    @InjectRepository(Specialize)
    private readonly specializeRepository: Repository<Specialize>,
  ) {}

  async findOneByName(name: string) {
    try {
      return await this.specializeRepository
        .createQueryBuilder('specialize')
        .leftJoin('specialize.facilityType', 'ft')
        .leftJoinAndSelect('specialize.repairman', 'repairman')
        .leftJoinAndSelect('repairman.specializes', 'sp')
        .leftJoinAndSelect('sp.facilityType', 'facilityType')
        .where('ft.name = :name')
        .andWhere('specialize.active = true')
        .setParameters({ name })
        .getMany();
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
