import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FloorsService } from './floors.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRoles } from 'src/common/decorators/user-roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('floors')
@UseGuards(AuthGuard, RolesGuard)
export class FloorsController {
  constructor(private readonly floorsService: FloorsService) {}

  @Post()
  @UserRoles(UserRole.ADMIN)
  async create(@Body() createFloorDto: CreateFloorDto, @Res() res) {
    return res.status(HttpStatus.OK).json({
      floor: await this.floorsService.create(createFloorDto),
      message: 'Tạo tầng thành công',
    });
  }

  @Delete(':id')
  @UserRoles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @Res() res) {
    await this.floorsService.remove(+id);
    return res.status(HttpStatus.OK).json({
      message: 'Xóa tầng thành công',
    });
  }
}
