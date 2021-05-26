import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoomFacilitiesService } from './room-facilities.service';
import { CreateRoomFacilityDto } from './dto/create-room-facility.dto';
import { UpdateRoomFacilityDto } from './dto/update-room-facility.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRoles } from 'src/common/decorators/user-roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('room-facilities')
@UserRoles(UserRole.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class RoomFacilitiesController {
  constructor(private readonly roomFacilitiesService: RoomFacilitiesService) {}

  @Post()
  create(@Body() createRoomFacilityDto: CreateRoomFacilityDto) {
    return this.roomFacilitiesService.create(createRoomFacilityDto);
  }

  @Get()
  findAll() {
    return this.roomFacilitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomFacilitiesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomFacilityDto: UpdateRoomFacilityDto,
  ) {
    return this.roomFacilitiesService.update(+id, updateRoomFacilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomFacilitiesService.remove(+id);
  }
}
