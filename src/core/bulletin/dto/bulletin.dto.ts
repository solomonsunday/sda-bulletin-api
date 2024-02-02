import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

export class CreateBulletinDto {
  // welcome
  @IsString()
  @IsOptional()
  themeForTheQuarter: string;
  @IsString()
  @IsOptional()
  topicForTheWeek: string;
  @IsString()
  @IsOptional()
  lessonMemoryTest: string;
  @IsString()
  @IsOptional()
  onLineZoomLink: string;

  // sabbath school
  @IsString()
  @IsOptional()
  singspirationTime: string;
  @IsString()
  @IsOptional()
  songLeader: string;
  @IsString()
  @IsOptional()
  openingPrayerBy: string;
  @IsString()
  @IsOptional()
  openningRemarkBy: string;
  @IsString()
  @IsOptional()
  openingHymn: string;
  @IsString()
  @IsOptional()
  openingHymnBy: string;
  @IsString()
  @IsOptional()
  keepingOnCourseBy: string;
  @IsString()
  @IsOptional()
  missionSpotlightBy: string;
  @IsString()
  @IsOptional()
  lessonIntroductionBy: string;
  @IsString()
  @IsOptional()
  unitActivities: string;
  @IsString()
  @IsOptional()
  lessonSummaryBy: string;
  @IsString()
  @IsOptional()
  friendTimeBy: string;
  @IsString()
  @IsOptional()
  annnouncementClosingRemarkBy: string;
  @IsString()
  @IsOptional()
  closingPrayerBy: string;

  //   divine service dto
  @IsString()
  @IsOptional()
  prelude: string;

  @IsString()
  @IsOptional()
  callToWorshipHymnNo: string;

  @IsString()
  @IsOptional()
  callToWorshipBy: string;

  @IsString()
  @IsOptional()
  invocation: string;

  @IsString()
  @IsOptional()
  divinceServiceOpeningHymnNo: string;
  @IsString()
  @IsOptional()
  divinceServiceOpeningHymnBy: string;
  @IsString()
  @IsOptional()
  pastoralPrayer: string;
  @IsString()
  @IsOptional()
  pastoralPrayerBy: string;
  @IsString()
  @IsOptional()
  stewardshipBy: string;
  @IsString()
  @IsOptional()
  musicalSelectionBy: string;
  @IsString()
  @IsOptional()
  spiritualReadingBibleVerse: string;
  @IsString()
  @IsOptional()
  spiritualReadingBibleVerseBy: string;
  @IsString()
  @IsOptional()
  hymnOfConcecrationNo: string;
  @IsString()
  @IsOptional()
  hymnOfConcecrationNoBy: string;
  @IsString()
  @IsOptional()
  divinceServiceClosingHymnNo: string;
  @IsString()
  @IsOptional()
  divinceServiceClosingHymnBy: string;
  @IsString()
  @IsOptional()
  benediction: string;
  @IsString()
  @IsOptional()
  doxology: string;

  //   announcement
  @IsString()
  @IsOptional()
  announcementDescription: string[];

  //   pastor's desk
  @IsString()
  @IsOptional()
  pastorDeskBibleVerse: string;
  @IsString()
  @IsOptional()
  pastorDeskBibleVerseDescription: string;
}

export class UpdateBulletinDto extends PartialType(CreateBulletinDto) {}
