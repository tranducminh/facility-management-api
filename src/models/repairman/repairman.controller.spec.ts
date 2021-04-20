import { Test, TestingModule } from '@nestjs/testing';
import { RepairmanController } from './repairman.controller';
import { RepairmanService } from './repairman.service';

describe('RepairmanController', () => {
  let controller: RepairmanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepairmanController],
      providers: [RepairmanService],
    }).compile();

    controller = module.get<RepairmanController>(RepairmanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
