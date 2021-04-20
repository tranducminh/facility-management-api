import { Test, TestingModule } from '@nestjs/testing';
import { RepairmanService } from './repairman.service';

describe('RepairmanService', () => {
  let service: RepairmanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepairmanService],
    }).compile();

    service = module.get<RepairmanService>(RepairmanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
