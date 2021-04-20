import { Test, TestingModule } from '@nestjs/testing';
import { SpecializesController } from './specializes.controller';
import { SpecializesService } from './specializes.service';

describe('SpecializesController', () => {
  let controller: SpecializesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecializesController],
      providers: [SpecializesService],
    }).compile();

    controller = module.get<SpecializesController>(SpecializesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
