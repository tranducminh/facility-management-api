import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class FilterRepairmanDto extends PartialType(PaginationQueryDto) {
  @IsOptional()
  specialize?: string;
}
