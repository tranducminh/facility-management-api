import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      if (!request) {
        throw new NotFoundException('Không tìm thấy yêu cầu');
      }
      const facility = await this.facilityRepository.findOne(facilityId);
      if (!facility) {
        throw new NotFoundException('Không tìm thấy thiết bị');
      }
      const newReplacement = await this.replacementRepository.create({
        ...createReplacementDto,
        request,
        facility,
      });
      const saveReplacement = await this.replacementRepository.save(
        newReplacement,
      );
      if (!saveReplacement) {
        throw new BadRequestException(
          `Thay thế linh kiện ${createReplacementDto.component} không thành công`,
        );
      }
      return saveReplacement;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
