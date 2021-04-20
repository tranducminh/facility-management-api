import { Test, TestingModule } from '@nestjs/testing';
import { ReplacementsController } from './replacements.controller';
import { ReplacementsService } from './replacements.service';

describe('ReplacementsController', () => {
  let controller: ReplacementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReplacementsController],
      providers: [ReplacementsService],
    }).compile();

    controller = module.get<ReplacementsController>(ReplacementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
