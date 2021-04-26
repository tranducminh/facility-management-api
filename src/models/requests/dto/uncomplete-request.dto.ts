import { IsNotEmpty, IsString } from 'class-validator';

export class UnCompleteRequestDto {
  @IsNotEmpty()
  @IsString()
  uncompletedReason: string;
}
