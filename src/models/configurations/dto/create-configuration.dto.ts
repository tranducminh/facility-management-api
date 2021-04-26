import { IsOptional, IsString } from 'class-validator';

export class CreateConfigurationDto {
  @IsOptional()
  @IsString()
  cpu?: string;

  @IsOptional()
  @IsString()
  mainboard?: string;

  @IsOptional()
  @IsString()
  psu?: string;

  @IsOptional()
  @IsString()
  ram?: string;

  @IsOptional()
  @IsString()
  vga?: string;

  @IsOptional()
  @IsString()
  hardDrive?: string;

  @IsOptional()
  @IsString()
  opticalDrive?: string;

  @IsOptional()
  @IsString()
  monitor?: string;

  @IsOptional()
  @IsString()
  mouse?: string;

  @IsOptional()
  @IsString()
  keyboard?: string;

  @IsOptional()
  @IsString()
  headPhone?: string;

  @IsOptional()
  @IsString()
  webcam?: string;

  @IsOptional()
  @IsString()
  cardReader?: string;

  @IsOptional()
  @IsString()
  fanCase?: string;

  // printers
  @IsOptional()
  @IsString()
  resolution?: string;

  @IsOptional()
  @IsString()
  printSpeed?: string;

  @IsOptional()
  @IsString()
  paperSize?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  duplexPrint?: string;

  @IsOptional()
  @IsString()
  communication?: string;

  @IsOptional()
  @IsString()
  printInk?: string;

  //node
  @IsOptional()
  @IsString()
  nodeName?: string;
}
