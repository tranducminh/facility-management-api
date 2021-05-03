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
  UseGuards,
  Req,
} from '@nestjs/common';
import { RepairmanService } from './repairman.service';
import { CreateRepairmanDto } from './dto/create-repairman.dto';
import { UpdateRepairmanDto } from './dto/update-repairman.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoginRepairmanDto } from './dto/login-repairman.dto';

@Controller('repairman')
export class RepairmanController {
  constructor(private readonly repairmanService: RepairmanService) {}

  @Post('/login')
  async login(@Body() loginRepairmanDto: LoginRepairmanDto, @Res() res) {
    const result = await this.repairmanService.login(loginRepairmanDto);
    return res.status(HttpStatus.OK).json({
      data: { ...result },
      message: 'Login successfully',
    });
  }

  @Post()
  async create(@Body() createRepairmanDto: CreateRepairmanDto, @Res() res) {
    return res.status(HttpStatus.OK).json({
      repairman: await this.repairmanService.create(createRepairmanDto),
    });
  }

  @Get()
  async findAll(@Res() res, @Query('specialize') specialize?: string) {
    return res.status(HttpStatus.OK).json({
      repairman: await this.repairmanService.findAll(specialize),
    });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async findMe(@Res() res, @Req() req) {
    const { userId } = req;
    return res.status(HttpStatus.OK).json({
      repairman: await this.repairmanService.findMe(+userId),
    });
  }

  @Get('me/requests')
  @UseGuards(AuthGuard)
  async findMyRequest(@Param('id') id: string, @Res() res, @Req() req) {
    const { userId } = req;
    return res.status(HttpStatus.OK).json({
      repairman: await this.repairmanService.findMyRequest(+userId),
    });
  }

  @Get('me/histories')
  @UseGuards(AuthGuard)
  async findMyHistory(@Param('id') id: string, @Res() res, @Req() req) {
    const { userId } = req;
    return res.status(HttpStatus.OK).json({
      repairman: await this.repairmanService.findMyHistory(+userId),
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      repairman: await this.repairmanService.findOne(id),
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRepairmanDto: UpdateRepairmanDto,
  ) {
    return this.repairmanService.update(+id, updateRepairmanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repairmanService.remove(+id);
  }
}
