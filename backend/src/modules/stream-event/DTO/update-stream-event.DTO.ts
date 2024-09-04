import { IsString, IsNotEmpty, IsIn, IsUrl, IsDate } from 'class-validator';

export class UpdateStreamEventStatusDTO {
  @IsString()
  @IsIn(['Pending', 'Approved', 'Declined'])
  status: string;

  @IsUrl()
  @IsNotEmpty()
  youtubeUrl: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  adminId: string;
}
