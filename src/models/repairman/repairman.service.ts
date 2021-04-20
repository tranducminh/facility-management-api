import { Injectable } from '@nestjs/common';
import { CreateRepairmanDto } from './dto/create-repairman.dto';
import { UpdateRepairmanDto } from './dto/update-repairman.dto';

@Injectable()
export class RepairmanService {
  create(createRepairmanDto: CreateRepairmanDto) {
    return 'This action adds a new repairman';
  }

  findAll() {
    return `This action returns all repairman`;
  }

  findOne(id: number) {
    return `This action returns a #${id} repairman`;
  }

  update(id: number, updateRepairmanDto: UpdateRepairmanDto) {
    return `This action updates a #${id} repairman`;
  }

  remove(id: number) {
    return `This action removes a #${id} repairman`;
  }
}
