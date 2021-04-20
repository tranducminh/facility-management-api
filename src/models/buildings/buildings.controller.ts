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
