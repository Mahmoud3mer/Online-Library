import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStreamEventDTO {
  @IsString()
  @IsNotEmpty()
  streamTitle: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
