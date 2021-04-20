import { PartialType } from '@nestjs/mapped-types';
import { CreateFacilityTypeDto } from './create-facility-type.dto';

export class UpdateFacilityTypeDto extends PartialType(CreateFacilityTypeDto) {}
