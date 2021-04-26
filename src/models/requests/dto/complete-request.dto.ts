import { IsNotEmpty, IsString } from 'class-validator';

export class CompleteRequestDto {
  @IsNotEmpty()
  @IsString()
  solution: string;
}
