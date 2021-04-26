import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  problem: string;

  @IsNotEmpty()
  @IsNumber()
  facilityId: number;
}
