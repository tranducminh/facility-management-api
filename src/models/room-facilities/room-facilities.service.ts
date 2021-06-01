import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError } from 'src/common/helpers/catch-error';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Repository } from 'typeorm';
import { FacilityType } from '../facility-types/entities/facility-type.entity';
import { Room } from '../rooms/entities/room.entity';
import { CreateRoomFacilityDto } from './dto/create-room-facility.dto';
import { RoomFacility } from './entities/room-facility.entity';

@Injectable()
@UseGuards(AuthGuard, RolesGuard)
export class RoomFacilitiesService {
  constructor(
    @InjectRepository(RoomFacility)
    private readonly roomFacilityRepository: Repository<RoomFacility>,
    @InjectRepository(FacilityType)
    private readonly facilityTypeRepository: Repository<FacilityType>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}
  async create(createRoomFacilityDto: CreateRoomFacilityDto) {
    try {
      const room = await this.roomRepository.findOne(
        createRoomFacilityDto.roomId,
      );
      if (!room) {
        throw new NotFoundException('Không tìm thấy phòng');
      }

      const facilityType = await this.facilityTypeRepository.findOne({
        name: 'node',
      });
      const roomFacility = this.roomFacilityRepository.create({
        name: createRoomFacilityDto.name,
        room,
        facilityType,
      });
      return await this.roomFacilityRepository.save(roomFacility);
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async remove(id: number) {
    try {
      await this.roomFacilityRepository.update(id, {
        room: null,
        facilityType: null,
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
