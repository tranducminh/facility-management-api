import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRequestDto {
  @IsNotEmpty()
  @IsString()
  problem: string;
}
