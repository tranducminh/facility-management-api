import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SpecializesService } from './specializes.service';
import { CreateSpecializeDto } from './dto/create-specialize.dto';
import { UpdateSpecializeDto } from './dto/update-specialize.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserRoles } from 'src/common/decorators/user-roles.decorator';

@Controller('specializes')
@UseGuards(AuthGuard, RolesGuard)
export class SpecializesController {
  constructor(private readonly specializesService: SpecializesService) {}

  @Post()
  @UserRoles(UserRole.ADMIN, UserRole.REPAIRMAN)
  create(@Body() createSpecializeDto: CreateSpecializeDto) {
    return this.specializesService.create(createSpecializeDto);
  }

  @Get()
  @UserRoles(UserRole.ADMIN)
  findAll() {
    return this.specializesService.findAll();
  }

  @Get(':id')
  @UserRoles(UserRole.ADMIN, UserRole.REPAIRMAN)
  findOne(@Param('id') id: string) {
    return this.specializesService.findOne(+id);
  }

  @Put(':id')
  @UserRoles(UserRole.ADMIN, UserRole.REPAIRMAN)
  update(
    @Param('id') id: string,
    @Body() updateSpecializeDto: UpdateSpecializeDto,
  ) {
    return this.specializesService.update(+id, updateSpecializeDto);
  }

  @Delete(':id')
  @UserRoles(UserRole.ADMIN, UserRole.REPAIRMAN)
  remove(@Param('id') id: string) {
    return this.specializesService.remove(+id);
  }
}
