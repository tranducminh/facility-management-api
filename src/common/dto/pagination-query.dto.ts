import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsNumber({}, { message: 'pagination limit must be a number' })
  @IsOptional()
  @Min(1, { message: 'pagination limit must greater than 1' })
  @Type(() => Number)
  limit: number = parseInt(process.env.DEFAULT_LIMIT_PAGINATION);

  @IsNumber({}, { message: 'pagination offset must be a number' })
  @IsOptional()
  @Min(1, { message: 'pagination offset must greater than 1' })
  @Type(() => Number)
  offset: number = parseInt(process.env.DEFAULT_OFFSET_PAGINATION);
}
