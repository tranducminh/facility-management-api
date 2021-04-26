import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from 'src/models/buildings/entities/building.entity';
import { Facility } from 'src/models/facilities/entities/facility.entity';
import { FacilityType } from 'src/models/facility-types/entities/facility-type.entity';
import { Floor } from 'src/models/floors/entities/floor.entity';
import { Repository } from 'typeorm';
import * as facilities from './facility.data.json';

@Injectable()
export class FacilitySeederService {
  constructor(
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    @InjectRepository(FacilityType)
    private readonly facilityTypeRepository: Repository<FacilityType>,
  ) {}

  async create(): Promise<Promise<Facility>[]> {
    try {
      return facilities.map(async (facility) => {
        const facilityType = await this.facilityTypeRepository.findOne({
          name: facility.facilityType,
        });
        const newFacility = this.facilityRepository.create({
          name: facility.name,
          origin: facility.origin,
          price: facility.price,
          facilityType,
          configuration: facility.configuration,
        });
        return await this.facilityRepository.save(newFacility);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
