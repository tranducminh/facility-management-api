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
  Query,
} from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';

@Controller('facilities')
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Post()
  async create(@Body() createFacilityDto: CreateFacilityDto, @Res() res) {
    return res.status(HttpStatus.OK).json({
      facility: await this.facilitiesService.create(createFacilityDto),
    });
  }

  @Get()
  async findAll(
    @Res() res,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('room_id') roomId?: string,
  ) {
    return res.status(HttpStatus.OK).json({
      facilities: await this.facilitiesService.findAll({
        type,
        status,
        roomId: +roomId,
      }),
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      facility: await this.facilitiesService.findOne(+id),
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFacilityDto: UpdateFacilityDto,
  ) {
    return this.facilitiesService.update(+id, updateFacilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facilitiesService.remove(+id);
  }
}
