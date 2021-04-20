import { PartialType } from '@nestjs/mapped-types';
import { CreateReplacementDto } from './create-replacement.dto';

export class UpdateReplacementDto extends PartialType(CreateReplacementDto) {}
