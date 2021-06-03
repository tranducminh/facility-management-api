import {
  Controller,
  Get,
  Param,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserRoles } from 'src/common/decorators/user-roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { SpecializesService } from './specializes.service';

@Controller('specializes')
@UseGuards(AuthGuard, RolesGuard)
export class SpecializesController {
  constructor(private readonly specializesService: SpecializesService) {}

  @Get(':name')
  @UserRoles(UserRole.ADMIN)
  async findOne(@Param('name') name: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      specializes: await this.specializesService.findOneByName(name),
    });
  }
}
