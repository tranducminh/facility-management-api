import { Injectable } from '@nestjs/common';
import { CreateRequestReplacementDto } from './dto/create-request-replacement.dto';
import { UpdateRequestReplacementDto } from './dto/update-request-replacement.dto';

@Injectable()
export class RequestReplacementsService {
  create(createRequestReplacementDto: CreateRequestReplacementDto) {
    return 'This action adds a new requestReplacement';
  }

  findAll() {
    return `This action returns all requestReplacements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requestReplacement`;
  }

  update(id: number, updateRequestReplacementDto: UpdateRequestReplacementDto) {
    return `This action updates a #${id} requestReplacement`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestReplacement`;
  }
}
