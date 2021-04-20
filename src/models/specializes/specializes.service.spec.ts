import { Test, TestingModule } from '@nestjs/testing';
import { SpecializesService } from './specializes.service';

describe('SpecializesService', () => {
  let service: SpecializesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecializesService],
    }).compile();

    service = module.get<SpecializesService>(SpecializesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
