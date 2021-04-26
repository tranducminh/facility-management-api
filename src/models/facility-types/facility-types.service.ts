import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { CreateFacilityTypeDto } from './dto/create-facility-type.dto';
import { UpdateFacilityTypeDto } from './dto/update-facility-type.dto';
import { FacilityType } from './entities/facility-type.entity';

@Injectable()
export class FacilityTypesService {
  constructor(
    @InjectRepository(FacilityType)
    private readonly facilityTypeRepository: Repository<FacilityType>,
  ) {}
  create(createFacilityTypeDto: CreateFacilityTypeDto) {
    return 'This action adds a new facilityType';
  }

  async findAll() {
    try {
      return await this.facilityTypeRepository.find();
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findOneByName(name: string) {
    try {
      return await this.facilityTypeRepository.findOne(
        { name },
        { relations: ['facilities', 'specializes', 'specializes.repairman'] },
      );
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  update(id: number, updateFacilityTypeDto: UpdateFacilityTypeDto) {
    return `This action updates a #${id} facilityType`;
  }

  remove(id: number) {
    return `This action removes a #${id} facilityType`;
  }
}
