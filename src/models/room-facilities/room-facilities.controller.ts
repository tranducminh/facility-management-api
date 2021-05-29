import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
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
  async create(
    @Body() createRoomFacilityDto: CreateRoomFacilityDto,
    @Res() res,
  ) {
    return res.status(HttpStatus.OK).json({
      roomFacility: await this.roomFacilitiesService.create(
        createRoomFacilityDto,
      ),
      message: 'Tạo nút mạng thành công',
    });
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
  async remove(@Param('id') id: string, @Res() res) {
    await this.roomFacilitiesService.remove(+id);
    return res.status(HttpStatus.OK).json({
      message: 'Xóa nút mạng thành công',
    });
  }
}
