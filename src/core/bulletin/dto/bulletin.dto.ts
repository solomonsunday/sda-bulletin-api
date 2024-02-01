import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateBulletinDto {
  // welcome
  @IsString()
  themeForTheQuarter: string;
  @IsString()
  topicForTheWeek: string;
  @IsString()
  lessonMemoryTest: string;
  @IsString()
  onLineZoomLink: string;

  // sabbath school
  @IsString()
  singspirationTime: string;
  @IsString()
  songLeader: string;
  @IsString()
  openingPrayerBy: string;
  @IsString()
  openningRemarkBy: string;
  @IsString()
  openingHymn: string;
  @IsString()
  openingHymnBy: string;
  @IsString()
  keepingOnCourseBy: string;
  @IsString()
  missionSpotlightBy: string;
  @IsString()
  lessonIntroductionBy: string;
  @IsString()
  unitActivities: string;
  @IsString()
  lessonSummaryBy: string;
  @IsString()
  friendTimeBy: string;
  @IsString()
  annnouncementClosingRemarkBy: string;
  @IsString()
  closingPrayerBy: string;

  //   divine service dto
  @IsString()
  prelude: string;
  @IsString()
  callToWorshipHymnNo: string;
  @IsString()
  callToWorshipBy: string;
  @IsString()
  invocation: string;
  @IsString()
  divinceServiceOpeningHymnNo: string;
  @IsString()
  divinceServiceOpeningHymnBy: string;
  @IsString()
  pastoralPrayer: string;
  @IsString()
  pastoralPrayerBy: string;
  @IsString()
  stewardshipBy: string;
  @IsString()
  musicalSelectionBy: string;
  @IsString()
  spiritualReadingBibleVerse: string;
  @IsString()
  spiritualReadingBibleVerseBy: string;
  @IsString()
  hymnOfConcecrationNo: string;
  @IsString()
  hymnOfConcecrationNoBy: string;
  @IsString()
  divinceServiceClosingHymnNo: string;
  @IsString()
  divinceServiceClosingHymnBy: string;
  @IsString()
  benediction: string;
  @IsString()
  doxology: string;

  //   announcement
  @IsString()
  announcementDescription: string[];

  //   pastor's desk
  @IsString()
  pastorDeskBibleVerse: string;
  @IsString()
  pastorDeskBibleVerseDescription: string;
}

export class UpdateBulletinDto extends PartialType(CreateBulletinDto) {}
