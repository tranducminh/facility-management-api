import {
  Controller,
  Get,
  Param,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRoles } from 'src/common/decorators/user-roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('histories')
@UseGuards(AuthGuard, RolesGuard)
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @Get(':id')
  @UserRoles(UserRole.ADMIN, UserRole.REPAIRMAN)
  async findOne(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      history: await this.historiesService.findOne(+id),
    });
  }
}
