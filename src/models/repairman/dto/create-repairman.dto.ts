import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRepairmanDto {
  @IsNotEmpty()
  @IsString()
  identity: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  unit: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  facilityTypes?: string[];
}
