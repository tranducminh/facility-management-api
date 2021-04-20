import { Test, TestingModule } from '@nestjs/testing';
import { RoomFacilitiesService } from './room-facilities.service';

describe('RoomFacilitiesService', () => {
  let service: RoomFacilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomFacilitiesService],
    }).compile();

    service = module.get<RoomFacilitiesService>(RoomFacilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
