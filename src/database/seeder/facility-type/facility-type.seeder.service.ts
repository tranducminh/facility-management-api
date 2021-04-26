import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityType } from 'src/models/facility-types/entities/facility-type.entity';
import { Repository } from 'typeorm';
import * as facilityTypes from './facility-type.data.json';

@Injectable()
export class FacilityTypeSeederService {
  constructor(
    @InjectRepository(FacilityType)
    private readonly facilityTypeRepository: Repository<FacilityType>,
  ) {}

  async create(): Promise<Promise<FacilityType>[]> {
    try {
      return facilityTypes.map(async (facilityType) => {
        const newFacilityType = this.facilityTypeRepository.create({
          name: facilityType.name,
        });
        return await this.facilityTypeRepository.save(newFacilityType);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
