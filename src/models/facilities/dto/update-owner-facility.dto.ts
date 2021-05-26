import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateOwnerFacilityDto {
  @IsNumber()
  @IsNotEmpty()
  employeeId: number;
}
