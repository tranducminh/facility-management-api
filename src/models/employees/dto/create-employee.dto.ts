import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  identity: string;

  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString()
  name: string;

  @IsOptional()
  dateOfBirth?: Date;

  @IsNotEmpty()
  @IsString()
  unit: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @Matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/)
  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsNumber()
  roomId?: number;
}
