import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReplacementDto {
  @IsString()
  @IsNotEmpty()
  component: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  target: string;

  @IsNumber()
  @IsNotEmpty()
  facilityId: number;

  @IsNumber()
  @IsNotEmpty()
  requestId: number;
}
