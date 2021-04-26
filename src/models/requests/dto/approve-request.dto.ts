import { IsNotEmpty, IsNumber } from 'class-validator';

export class ApproveRequestDto {
  @IsNotEmpty()
  @IsNumber()
  repairmanId: number;
}
