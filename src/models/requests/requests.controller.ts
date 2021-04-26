import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { CompleteRequestDto } from './dto/complete-request.dto';
import { UnCompleteRequestDto } from './dto/uncomplete-request.dto';
import { RejectRequestDto } from './dto/reject-request.dto';

@Controller('requests')
@UseGuards(AuthGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async create(
    @Body() createRequestDto: CreateRequestDto,
    @Req() req,
    @Res() res,
  ) {
    return await res.status(HttpStatus.OK).json({
      request: await this.requestsService.create(
        createRequestDto,
        +req.employeeId,
      ),
    });
  }

  @Get()
  async findAll(@Res() res, @Query('status') status?: RequestStatus) {
    return res.status(HttpStatus.OK).json({
      requests: await this.requestsService.findAll(status),
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.findOne(+id),
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestsService.update(+id, updateRequestDto);
  }

  @Put(':id/assign')
  async assignRequest(
    @Param('id') id: string,
    @Res() res,
    @Body() approveRequestDto: ApproveRequestDto,
  ) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.assign(+id, approveRequestDto),
    });
  }

  @Put(':id/process')
  async processRequest(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.process(+id),
    });
  }

  @Put(':id/complete')
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
        +req.employeeId,
      ),
    });
  }

  @Put(':id/uncomplete')
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
        +req.employeeId,
      ),
    });
  }

  @Put(':id/delete')
  async deleteRequest(@Param('id') id: string, @Res() res) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.delete(+id),
    });
  }

  @Put(':id/reject')
  async rejectRequest(
    @Param('id') id: string,
    @Res() res,
    @Body() rejectRequestDto: RejectRequestDto,
  ) {
    return res.status(HttpStatus.OK).json({
      request: await this.requestsService.reject(+id, rejectRequestDto),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestsService.remove(+id);
  }
}
