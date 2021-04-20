import { Test, TestingModule } from '@nestjs/testing';
import { RequestReplacementsService } from './request-replacements.service';

describe('RequestReplacementsService', () => {
  let service: RequestReplacementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestReplacementsService],
    }).compile();

    service = module.get<RequestReplacementsService>(RequestReplacementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
