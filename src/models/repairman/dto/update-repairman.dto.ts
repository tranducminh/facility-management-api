import { PartialType } from '@nestjs/mapped-types';
import { CreateRepairmanDto } from './create-repairman.dto';

export class UpdateRepairmanDto extends PartialType(CreateRepairmanDto) {}
