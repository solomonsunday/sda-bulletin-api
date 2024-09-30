import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsString } from 'class-validator';

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
  lessonMemoryVerse: string;

  @IsString()
  @IsOptional()
  onLineZoomLink: string;

  @IsString()
  @IsOptional()
  midweekPrayerZoomLink: string

  @IsString()
  @IsOptional()
  earlyMorningPrayerZoomLink: string

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
  specialFeature: string;

  @IsString()
  @IsOptional()
  annnouncementClosingRemarkBy: string;

  @IsString()
  @IsOptional()
  ssClosingPrayerBy: string;

  @IsString()
  @IsOptional()
  ssClosingHymnBy: string;

  @IsString()
  @IsOptional()
  ssClosingHymnNo: string;

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
  divineServiceOpeningHymnNo: string;

  @IsString()
  @IsOptional()
  sermonTitle: string;

  @IsString()
  @IsOptional()
  preacher: string;

  @IsString()
  @IsOptional()
  divineServiceOpeningHymnBy: string;
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
  scripturalReadingBibleVerse: string;
  @IsString()
  @IsOptional()
  scripturalReadingBibleVerseBy: string;
  @IsString()
  @IsOptional()
  hymnOfConcecrationNo: string;
  @IsString()
  @IsOptional()
  hymnOfConcecrationNoBy: string;
  @IsString()
  @IsOptional()
  divineServiceClosingHymnNo: string;
  @IsString()
  @IsOptional()
  divineServiceClosingHymnBy: string;
  @IsString()
  @IsOptional()
  benediction: string;
  @IsString()
  @IsOptional()
  doxology: string;

  //   pastor's desk
  @IsString()
  @IsOptional()
  pastorDeskBibleVerse: string;
  @IsString()
  @IsOptional()
  pastorDeskBibleVerseDescription: string;

  //   announcement
  @IsArray()
  @IsOptional()
  announcementIds: string[];

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}

export class UpdateBulletinDto extends PartialType(CreateBulletinDto) {}
