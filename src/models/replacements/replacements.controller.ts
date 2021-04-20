import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReplacementsService } from './replacements.service';
import { CreateReplacementDto } from './dto/create-replacement.dto';
import { UpdateReplacementDto } from './dto/update-replacement.dto';

@Controller('replacements')
export class ReplacementsController {
  constructor(private readonly replacementsService: ReplacementsService) {}

  @Post()
  create(@Body() createReplacementDto: CreateReplacementDto) {
    return this.replacementsService.create(createReplacementDto);
  }

  @Get()
  findAll() {
    return this.replacementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.replacementsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReplacementDto: UpdateReplacementDto) {
    return this.replacementsService.update(+id, updateReplacementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.replacementsService.remove(+id);
  }
}
