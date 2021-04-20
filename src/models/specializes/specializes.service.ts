import { Injectable } from '@nestjs/common';
import { CreateSpecializeDto } from './dto/create-specialize.dto';
import { UpdateSpecializeDto } from './dto/update-specialize.dto';

@Injectable()
export class SpecializesService {
  create(createSpecializeDto: CreateSpecializeDto) {
    return 'This action adds a new specialize';
  }

  findAll() {
    return `This action returns all specializes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} specialize`;
  }

  update(id: number, updateSpecializeDto: UpdateSpecializeDto) {
    return `This action updates a #${id} specialize`;
  }

  remove(id: number) {
    return `This action removes a #${id} specialize`;
  }
}
