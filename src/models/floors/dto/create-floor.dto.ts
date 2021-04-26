import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFloorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  buildingId: number;
}
