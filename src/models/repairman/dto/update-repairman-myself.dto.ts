import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateRepairmanMyselfDto {
  @IsOptional()
  dateOfBirth?: Date;

  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @Matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/)
  @IsOptional()
  phone?: string;

  @IsOptional()
  @Matches(
    /^data:(?:image|application|text|audio|video)\/(?:gif|png|jpeg|bmp|webp|tiff|svg+xml|plain|ttf|vnd.oasis.opendocument.text|pdf|msword|csv|zip|x-tar|rar|vnd.ms-powerpoint|vnd.openxmlformats-officedocument.presentationml.presentation|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|mpeg|webm|wav|json|html)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/,
    {
      each: true,
      message: 'avatar không đúng định dạng',
    },
  )
  avatar?: string;

  @IsOptional()
  specializes?: Specialize[];
}

class Specialize {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @IsNotEmpty()
  @IsString()
  description: string;
}
