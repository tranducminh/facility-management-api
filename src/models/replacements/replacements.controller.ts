import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ReplacementsService } from './replacements.service';
import { CreateReplacementDto } from './dto/create-replacement.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('replacements')
@UseGuards(AuthGuard, RolesGuard)
export class ReplacementsController {
  constructor(private readonly replacementsService: ReplacementsService) {}

  @Post()
  async create(@Body() createReplacementDto: CreateReplacementDto, @Res() res) {
    return res.status(HttpStatus.OK).json({
      replacement: await this.replacementsService.create(createReplacementDto),
    });
  }
}
