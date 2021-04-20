import { IsNotEmpty, IsString } from 'class-validator';

export class LoginEmployeeDto {
  @IsNotEmpty()
  @IsString()
  identity: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
