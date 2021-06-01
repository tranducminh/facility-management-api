import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { RoomFacilitiesService } from './room-facilities.service';
import { CreateRoomFacilityDto } from './dto/create-room-facility.dto';
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

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    await this.roomFacilitiesService.remove(+id);
    return res.status(HttpStatus.OK).json({
      message: 'Xóa nút mạng thành công',
    });
  }
}
