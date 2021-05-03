import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { BooleanStatus } from 'src/common/enums/boolean-status.enum';

export class FilterEmployeeDto extends PartialType(PaginationQueryDto) {
  @IsOptional()
  hasRoom?: BooleanStatus;
}
