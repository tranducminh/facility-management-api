import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  Query,
  Put,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { CompleteRequestDto } from './dto/complete-request.dto';
import { UnCompleteRequestDto } from './dto/uncomplete-request.dto';
import { RejectRequestDto } from './dto/reject-request.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRoles } from 'src/common/decorators/user-roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { FilterRequestDto } from './dto/filter-request.dto';

@Controller('requests')
@UseGuards(AuthGuard, RolesGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @UserRoles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async create(
    @Body() createRequestDto: CreateRequestDto,
    @Req() req,
    @Res() res,
  ) {
    return await res.status(HttpStatus.OK).json({
      request: await this.requestsService.create(createRequestDto, +req.userId),
      message: 'Tạo yêu cầu thành công',
    });
  }

  @Get()
  @UserRoles(UserRole.ADMIN)
  async findAll(@Res() res, @Query() params?: FilterRequestDto) {
    return res.status(HttpStatus.OK).json({
      ...(await this.requestsService.findAll(
        params.limit,
        params.offset,
        params.status,
      )),
    });
  }

  @Get(':id')
  @UserRoles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async findOne(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.findOne(+id),
    });
  }

  @Put(':id')
  @UserRoles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async update(
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
    @Res() res,
  ) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.update(+id, updateRequestDto),
      message: 'Cập nhật yêu cầu thành công',
    });
  }

  @Put(':id/assign')
  @UserRoles(UserRole.ADMIN)
  async assignRequest(
    @Param('id') id: string,
    @Res() res,
    @Body() approveRequestDto: ApproveRequestDto,
  ) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.assign(+id, approveRequestDto),
      message: 'Bàn giao yêu cầu thành công',
    });
  }

  @Put(':id/process')
  @UserRoles(UserRole.REPAIRMAN)
  async processRequest(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.process(+id),
      message: 'Bắt đầu nhiệm vụ thành công',
    });
  }

  @Put(':id/complete')
  @UserRoles(UserRole.REPAIRMAN)
  async completeRequest(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Body() completeRequestDto: CompleteRequestDto,
  ) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.complete(
        +id,
        completeRequestDto,
        +req.userId,
      ),
      message: 'Hoàn thành nhiệm vụ thành công',
    });
  }

  @Put(':id/uncomplete')
  @UserRoles(UserRole.REPAIRMAN)
  async unCompleteRequest(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Body() unCompleteRequestDto: UnCompleteRequestDto,
  ) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.unComplete(
        +id,
        unCompleteRequestDto,
        +req.userId,
      ),
      message: 'Đã gửi yêu cầu không thể hoàn thành nhiệm vụ',
    });
  }

  @Put(':id/delete')
  @UserRoles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async deleteRequest(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.delete(+id),
      message: 'Xóa yêu cầu thành công',
    });
  }

  @Put(':id/reject')
  @UserRoles(UserRole.ADMIN)
  async rejectRequest(
    @Param('id') id: string,
    @Res() res,
    @Body() rejectRequestDto: RejectRequestDto,
  ) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.reject(+id, rejectRequestDto),
      message: 'Từ chối yêu cầu thành công',
    });
  }

  @Put(':id/reject-task')
  @UserRoles(UserRole.REPAIRMAN)
  async rejectTask(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Body() unCompleteRequestDto: UnCompleteRequestDto,
  ) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.rejectTask(
        +id,
        unCompleteRequestDto,
        +req.userId,
      ),
      message: 'Từ chối nhiệm vụ thành công',
    });
  }
}
