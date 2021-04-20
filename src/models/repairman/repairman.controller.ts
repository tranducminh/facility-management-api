import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepairmanService } from './repairman.service';
import { CreateRepairmanDto } from './dto/create-repairman.dto';
import { UpdateRepairmanDto } from './dto/update-repairman.dto';

@Controller('repairman')
export class RepairmanController {
  constructor(private readonly repairmanService: RepairmanService) {}

  @Post()
  create(@Body() createRepairmanDto: CreateRepairmanDto) {
    return this.repairmanService.create(createRepairmanDto);
  }

  @Get()
  findAll() {
    return this.repairmanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repairmanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepairmanDto: UpdateRepairmanDto) {
    return this.repairmanService.update(+id, updateRepairmanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repairmanService.remove(+id);
  }
}
