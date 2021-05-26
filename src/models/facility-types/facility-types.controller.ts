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
import { FacilityTypesService } from './facility-types.service';
@Controller('facility-types')
@UseGuards(AuthGuard, RolesGuard)
export class FacilityTypesController {
  constructor(private readonly facilityTypesService: FacilityTypesService) {}

  @Get(':name')
  @UserRoles(UserRole.ADMIN)
  async findOne(@Param('name') name: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      facilityType: await this.facilityTypesService.findOneByName(name),
    });
  }
}
