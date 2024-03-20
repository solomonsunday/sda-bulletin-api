import { IBaseEntity } from 'src/common/base.interface';
import { IAnnouncement } from 'src/core/announcement/entities/announcement.interface';

export interface IBulletin extends IBaseEntity {
  status: BulletinStatusType;

  // welcome
  themeForTheQuarter: string;
  topicForTheWeek: string;
  lessonMemoryTest: string;
  onLineZoomLink: string;

  // sabbath school
  singspirationTime: string;
  songLeader: string;
  openingPrayerBy: string;
  openningRemarkBy: string;
  openingHymn: string;
  openingHymnBy: string;
  keepingOnCourseBy: string;
  missionSpotlightBy: string;
  lessonIntroductionBy: string;
  specialFeature: string;
  unitActivities: string;
  lessonSummaryBy: string;
  friendTimeBy: string;
  annnouncementClosingRemarkBy: string;
  ssClosingPrayerBy: string;
  ssClosingHymnNo: string;
  ssClosingHymnBy: string;

  //   divine service dto
  prelude: string;
  callToWorshipHymnNo: string;
  callToWorshipBy: string;
  invocation: string;
  divineServiceOpeningHymnNo: string;
  divineServiceOpeningHymnBy: string;
  pastoralPrayer: string;
  pastoralPrayerBy: string;
  stewardshipBy: string;
  musicalSelectionBy: string;
  spiritualReadingBibleVerse: string;
  spiritualReadingBibleVerseBy: string;
  sermonTitle: string;
  preacher: string;
  hymnOfConcecrationNo: string;
  hymnOfConcecrationNoBy: string;
  divinceServiceClosingHymnNo: string;
  divinceServiceClosingHymnBy: string;
  benediction: string;
  doxology: string;
  startDate: string;
  endDate: string;

  //   pastor's desk
  pastorDeskBibleVerse: string;
  pastorDeskBibleVerseDescription: string;

  announcementIds: string[];
  announcements?: IAnnouncement[];
}
export enum BulletinStatusEnum {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export interface QueryParamDto {
  limit: number;
  start_date: string;
  end_date: string;
  search: string;
  next_page_token: string;
}
export type BulletinStatusType = `${BulletinStatusEnum}`;
