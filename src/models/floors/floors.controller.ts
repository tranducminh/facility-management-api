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
import { FloorsService } from './floors.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';

@Controller('floors')
export class FloorsController {
  constructor(private readonly floorsService: FloorsService) {}

  @Post()
  async create(@Body() createFloorDto: CreateFloorDto, @Res() res) {
    return res.status(HttpStatus.OK).json({
      floor: await this.floorsService.create(createFloorDto),
      message: 'Create new floor successfully',
    });
  }

  @Get()
  findAll() {
    return this.floorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.floorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFloorDto: UpdateFloorDto) {
    return this.floorsService.update(+id, updateFloorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.floorsService.remove(+id);
  }
}
