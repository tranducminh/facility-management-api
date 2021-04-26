import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  async create(@Body() createBuildingDto: CreateBuildingDto, @Res() res) {
    return res.status(HttpStatus.OK).json({
      building: await this.buildingsService.create(createBuildingDto),
      message: 'Create building successfully',
    });
  }

  @Get()
  async findAll(@Res() res) {
    return res.status(HttpStatus.OK).json({
      buildings: await this.buildingsService.findAll(),
    });
  }

  @Get(':name')
  async findOne(@Param('name') name: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      building: await this.buildingsService.findOneByName(name),
    });
  }

  @Get(':name/floors')
  async findAllFloor(@Param('name') name: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      floors: await this.buildingsService.findAllFloor(name),
      message: 'Get floors successfully',
    });
  }

  @Get(':name/floors/:floorName')
  async findFloor(
    @Param('name') name: string,
    @Param('floorName') floorName: string,
    @Res() res,
  ) {
    return res.status(HttpStatus.OK).json({
      floor: await this.buildingsService.findFloor(name, floorName),
      message: 'Get floor successfully',
    });
  }

  @Get(':name/floors/:floorName/rooms')
  async findAllRoom(
    @Param('name') name: string,
    @Param('floorName') floorName: string,
    @Res() res,
  ) {
    return res.status(HttpStatus.OK).json({
      rooms: await this.buildingsService.findFloor(name, floorName),
      message: 'Get rooms successfully',
    });
  }

  @Get(':name/floors/:floorName/rooms/:roomName')
  async findRoom(
    @Param('name') name: string,
    @Param('floorName') floorName: string,
    @Param('roomName') roomName: string,
    @Res() res,
  ) {
    return res.status(HttpStatus.OK).json({
      room: await this.buildingsService.findRoom(name, floorName, roomName),
      message: 'Get room successfully',
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBuildingDto: UpdateBuildingDto,
  ) {
    return this.buildingsService.update(+id, updateBuildingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buildingsService.remove(+id);
  }
}
