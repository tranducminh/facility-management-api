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
import { UserRoles } from 'src/common/decorators/user-roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';

@Controller('buildings')
@UseGuards(AuthGuard, RolesGuard)
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  @UserRoles(UserRole.ADMIN)
  async create(@Body() createBuildingDto: CreateBuildingDto, @Res() res) {
    return res.status(HttpStatus.OK).json({
      building: await this.buildingsService.create(createBuildingDto),
      message: 'Tạo tòa nhà thành công',
    });
  }

  @Get()
  @UserRoles(UserRole.ADMIN)
  async findAll(@Res() res) {
    return res.status(HttpStatus.OK).json({
      buildings: await this.buildingsService.findAll(),
    });
  }

  @Get(':name')
  @UserRoles(UserRole.ADMIN)
  async findOne(@Param('name') name: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      building: await this.buildingsService.findOneByName(name),
    });
  }

  @Get(':name/floors')
  @UserRoles(UserRole.ADMIN)
  async findAllFloor(@Param('name') name: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      floors: await this.buildingsService.findAllFloor(name),
    });
  }

  @Get(':name/floors/:floorName')
  @UserRoles(UserRole.ADMIN)
  async findFloor(
    @Param('name') name: string,
    @Param('floorName') floorName: string,
    @Res() res,
  ) {
    return res.status(HttpStatus.OK).json({
      floor: await this.buildingsService.findFloor(name, floorName),
    });
  }

  @Get(':name/floors/:floorName/rooms')
  @UserRoles(UserRole.ADMIN)
  async findAllRoom(
    @Param('name') name: string,
    @Param('floorName') floorName: string,
    @Res() res,
  ) {
    return res.status(HttpStatus.OK).json({
      rooms: await this.buildingsService.findFloor(name, floorName),
    });
  }

  @Get(':name/floors/:floorName/rooms/:roomName')
  @UserRoles(UserRole.ADMIN)
  async findRoom(
    @Param('name') name: string,
    @Param('floorName') floorName: string,
    @Param('roomName') roomName: string,
    @Res() res,
  ) {
    return res.status(HttpStatus.OK).json({
      room: await this.buildingsService.findRoom(name, floorName, roomName),
    });
  }

  @Delete(':id')
  @UserRoles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @Res() res) {
    await this.buildingsService.remove(+id);
    return res.status(HttpStatus.OK).json({
      message: 'Xóa tòa nhà thành công',
    });
  }
}
