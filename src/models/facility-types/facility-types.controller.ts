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
import { FacilityTypesService } from './facility-types.service';
import { CreateFacilityTypeDto } from './dto/create-facility-type.dto';
import { UpdateFacilityTypeDto } from './dto/update-facility-type.dto';

@Controller('facility-types')
export class FacilityTypesController {
  constructor(private readonly facilityTypesService: FacilityTypesService) {}

  @Post()
  create(@Body() createFacilityTypeDto: CreateFacilityTypeDto) {
    return this.facilityTypesService.create(createFacilityTypeDto);
  }

  @Get()
  findAll() {
    return this.facilityTypesService.findAll();
  }

  @Get(':name')
  async findOne(@Param('name') name: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      facilityType: await this.facilityTypesService.findOneByName(name),
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFacilityTypeDto: UpdateFacilityTypeDto,
  ) {
    return this.facilityTypesService.update(+id, updateFacilityTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facilityTypesService.remove(+id);
  }
}
