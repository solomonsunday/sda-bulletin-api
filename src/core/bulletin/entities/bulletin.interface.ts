import { IBaseEntity } from 'src/common/base.interface';

export interface IBulletin extends IBaseEntity {
  status: 'published' | '';

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
  unitActivities: string;
  lessonSummaryBy: string;
  friendTimeBy: string;
  annnouncementClosingRemarkBy: string;
  closingPrayerBy: string;

  //   divine service dto
  prelude: string;
  callToWorshipHymnNo: string;
  callToWorshipBy: string;
  invocation: string;
  divinceServiceOpeningHymnNo: string;
  divinceServiceOpeningHymnBy: string;
  pastoralPrayer: string;
  pastoralPrayerBy: string;
  stewardshipBy: string;
  musicalSelectionBy: string;
  spiritualReadingBibleVerse: string;
  spiritualReadingBibleVerseBy: string;
  hymnOfConcecrationNo: string;
  hymnOfConcecrationNoBy: string;
  divinceServiceClosingHymnNo: string;
  divinceServiceClosingHymnBy: string;
  benediction: string;
  doxology: string;

  //   pastor's desk
  pastorDeskBibleVerse: string;
  pastorDeskBibleVerseDescription: string;
}
