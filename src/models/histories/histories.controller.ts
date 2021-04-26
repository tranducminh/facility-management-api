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
import { HistoriesService } from './histories.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';

@Controller('histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @Post()
  create(@Body() createHistoryDto: CreateHistoryDto) {
    return this.historiesService.create(createHistoryDto);
  }

  @Get()
  findAll() {
    return this.historiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      history: await this.historiesService.findOne(+id),
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoryDto: UpdateHistoryDto) {
    return this.historiesService.update(+id, updateHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historiesService.remove(+id);
  }
}
