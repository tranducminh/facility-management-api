import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoomFacilityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  roomId: number;
}
