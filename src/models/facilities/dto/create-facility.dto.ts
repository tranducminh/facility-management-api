import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateConfigurationDto } from 'src/models/configurations/dto/create-configuration.dto';

export class CreateFacilityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsNotEmpty()
  @IsString()
  facilityType: string;

  @IsOptional()
  configuration?: CreateConfigurationDto;
}
