import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { RequestStatus } from 'src/common/enums/request-status.enum';

export class FilterRequestDto extends PartialType(PaginationQueryDto) {
  @IsOptional()
  status?: RequestStatus;
}
