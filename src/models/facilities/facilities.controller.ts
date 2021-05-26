import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { UpdateOwnerFacilityDto } from './dto/update-owner-facility.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRoles } from 'src/common/decorators/user-roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('facilities')
@UseGuards(AuthGuard, RolesGuard)
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Post()
  @UserRoles(UserRole.ADMIN)
  async create(@Body() createFacilityDto: CreateFacilityDto, @Res() res) {
    return res.status(HttpStatus.OK).json({
      facility: await this.facilitiesService.create(createFacilityDto),
      message: 'Tạo thiết bị thành công',
    });
  }

  @Get('/employee/:id')
  @UserRoles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async findAllByEmployee(@Res() res, @Param('id') id: string) {
    if (id == 'null') {
      return res.status(HttpStatus.OK).json({
        facilities: await this.facilitiesService.findAllByEmployee(null),
      });
    }
    return res.status(HttpStatus.OK).json({
      facilities: await this.facilitiesService.findAllByEmployee(+id),
    });
  }

  @Get()
  @UserRoles(UserRole.ADMIN)
  async findAll(
    @Res() res,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('room_id') roomId?: string,
  ) {
    return res.status(HttpStatus.OK).json({
      facilities: await this.facilitiesService.findAll({
        type,
        status,
        roomId: +roomId,
      }),
    });
  }

  @Get(':id')
  @UserRoles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async findOne(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      facility: await this.facilitiesService.findOne(+id),
    });
  }

  @Put(':id')
  @UserRoles(UserRole.ADMIN, UserRole.REPAIRMAN)
  async update(
    @Param('id') id: string,
    @Body() updateFacilityDto: UpdateFacilityDto,
    @Res() res,
  ) {
    return res.status(HttpStatus.OK).json({
      facility: await this.facilitiesService.update(+id, updateFacilityDto),
      message: 'Cập thiết bi thành công',
    });
  }

  @Delete(':id')
  @UserRoles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @Res() res) {
    await this.facilitiesService.remove(+id);
    return res.status(HttpStatus.OK).json({
      message: 'Xóa thiết bị thành công',
    });
  }

  @Put(':id/owner')
  @UserRoles(UserRole.ADMIN)
  async updateOwner(
    @Param('id') id: string,
    @Body() updateOwnerFacilityDto: UpdateOwnerFacilityDto,
    @Res() res,
  ) {
    const facility = await this.facilitiesService.updateOwner(
      +id,
      updateOwnerFacilityDto.employeeId,
    );
    return res.status(HttpStatus.OK).json({
      facility,
      message: `Bàn giao thiết bị thành công `,
    });
  }

  @Delete(':id/owner')
  @UserRoles(UserRole.ADMIN)
  async removeOwner(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      facility: await this.facilitiesService.removeOwner(+id),
      message: 'Thu hồi thiết bị thành công',
    });
  }
}
