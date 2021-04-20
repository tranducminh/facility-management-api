import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequestReplacementsService } from './request-replacements.service';
import { CreateRequestReplacementDto } from './dto/create-request-replacement.dto';
import { UpdateRequestReplacementDto } from './dto/update-request-replacement.dto';

@Controller('request-replacements')
export class RequestReplacementsController {
  constructor(private readonly requestReplacementsService: RequestReplacementsService) {}

  @Post()
  create(@Body() createRequestReplacementDto: CreateRequestReplacementDto) {
    return this.requestReplacementsService.create(createRequestReplacementDto);
  }

  @Get()
  findAll() {
    return this.requestReplacementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestReplacementsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestReplacementDto: UpdateRequestReplacementDto) {
    return this.requestReplacementsService.update(+id, updateRequestReplacementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestReplacementsService.remove(+id);
  }
}
