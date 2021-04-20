import { Test, TestingModule } from '@nestjs/testing';
import { RequestReplacementsController } from './request-replacements.controller';
import { RequestReplacementsService } from './request-replacements.service';

describe('RequestReplacementsController', () => {
  let controller: RequestReplacementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestReplacementsController],
      providers: [RequestReplacementsService],
    }).compile();

    controller = module.get<RequestReplacementsController>(RequestReplacementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
