import { Test, TestingModule } from '@nestjs/testing';
import { RoomFacilitiesController } from './room-facilities.controller';
import { RoomFacilitiesService } from './room-facilities.service';

describe('RoomFacilitiesController', () => {
  let controller: RoomFacilitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomFacilitiesController],
      providers: [RoomFacilitiesService],
    }).compile();

    controller = module.get<RoomFacilitiesController>(RoomFacilitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
