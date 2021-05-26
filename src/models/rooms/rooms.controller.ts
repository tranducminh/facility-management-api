import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRoles } from 'src/common/decorators/user-roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('rooms')
@UseGuards(AuthGuard, RolesGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UserRoles(UserRole.ADMIN)
  async create(@Body() createRoomDto: CreateRoomDto, @Res() res) {
    return res.status(HttpStatus.OK).json({
      room: await this.roomsService.create(createRoomDto),
      message: 'Tạo phòng thành công',
    });
  }

  @Get()
  @UserRoles(UserRole.ADMIN)
  async findAll(@Res() res) {
    return res.status(HttpStatus.OK).json({
      rooms: await this.roomsService.findAll(),
    });
  }

  @Get(':id')
  @UserRoles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async findOne(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      room: await this.roomsService.findOne(+id),
    });
  }

  @Delete(':id')
  @UserRoles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @Res() res) {
    await this.roomsService.remove(+id);
    return res.status(HttpStatus.OK).json({
      message: 'Xóa phòng thành công',
    });
  }
}
