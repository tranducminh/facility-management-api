import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}
  async findOne(id: number) {
    return await this.historyRepository.findOne(id, {
      where: { isActive: true },
    });
  }
}
