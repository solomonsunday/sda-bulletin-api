import { IsDateString, IsString } from 'class-validator';

export class CreateSabbathschoolDto {
  @IsDateString()
  singspirationTime: string;

  @IsString()
  songLeader: string;

  @IsString()
  openingPrayerby: string;
  @IsString()
  welcome: string;
  @IsString()
  openningHymn: string;
  @IsString()
  openningHymnBy: string;
  @IsString()
  keepingOnCourseBy: string;
}
