import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { Facility } from '../facilities/entities/facility.entity';
import { Request } from '../requests/entities/request.entity';
import { CreateReplacementDto } from './dto/create-replacement.dto';
import { Replacement } from './entities/replacement.entity';

@Injectable()
export class ReplacementsService {
  constructor(
    @InjectRepository(Replacement)
    private readonly replacementRepository: Repository<Replacement>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
  ) {}

  async create(createReplacementDto: CreateReplacementDto) {
    try {
      const { requestId, facilityId } = createReplacementDto;
      const request = await this.requestRepository.findOne(requestId);
      const facility = await this.facilityRepository.findOne(facilityId);
      const newReplacement = await this.replacementRepository.create({
        ...createReplacementDto,
        request,
        facility,
      });
      return await this.replacementRepository.save(newReplacement);
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
