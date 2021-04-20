import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpecializesService } from './specializes.service';
import { CreateSpecializeDto } from './dto/create-specialize.dto';
import { UpdateSpecializeDto } from './dto/update-specialize.dto';

@Controller('specializes')
export class SpecializesController {
  constructor(private readonly specializesService: SpecializesService) {}

  @Post()
  create(@Body() createSpecializeDto: CreateSpecializeDto) {
    return this.specializesService.create(createSpecializeDto);
  }

  @Get()
  findAll() {
    return this.specializesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specializesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecializeDto: UpdateSpecializeDto) {
    return this.specializesService.update(+id, updateSpecializeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specializesService.remove(+id);
  }
}
