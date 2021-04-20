import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecializeDto } from './create-specialize.dto';

export class UpdateSpecializeDto extends PartialType(CreateSpecializeDto) {}
