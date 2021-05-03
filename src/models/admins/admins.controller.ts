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
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('/login')
  async login(@Body() loginAdminDto: LoginAdminDto, @Res() res) {
    const result = await this.adminsService.login(loginAdminDto);
    return res.status(HttpStatus.OK).json({
      data: { ...result },
      message: 'Login successfully',
    });
  }

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto, @Res() res) {
    return res.status(HttpStatus.OK).json({
      admin: await this.adminsService.create(createAdminDto),
    });
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async findMe(@Req() req, @Res() res) {
    const admin = await this.adminsService.findMe(req.userId);
    return res.status(HttpStatus.OK).json({
      admin,
      message: `Get profile successfully`,
    });
  }

  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(+id);
  }
}
