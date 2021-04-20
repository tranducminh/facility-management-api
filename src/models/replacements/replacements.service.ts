import { Injectable } from '@nestjs/common';
import { CreateReplacementDto } from './dto/create-replacement.dto';
import { UpdateReplacementDto } from './dto/update-replacement.dto';

@Injectable()
export class ReplacementsService {
  create(createReplacementDto: CreateReplacementDto) {
    return 'This action adds a new replacement';
  }

  findAll() {
    return `This action returns all replacements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} replacement`;
  }

  update(id: number, updateReplacementDto: UpdateReplacementDto) {
    return `This action updates a #${id} replacement`;
  }

  remove(id: number) {
    return `This action removes a #${id} replacement`;
  }
}
