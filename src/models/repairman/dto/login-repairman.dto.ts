import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRepairmanDto {
  @IsNotEmpty()
  @IsString()
  identity: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
