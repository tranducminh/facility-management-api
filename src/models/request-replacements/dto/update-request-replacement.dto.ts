import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestReplacementDto } from './create-request-replacement.dto';

export class UpdateRequestReplacementDto extends PartialType(CreateRequestReplacementDto) {}
