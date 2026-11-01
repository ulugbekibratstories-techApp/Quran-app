export type UzbekScript = 'lat' | 'cyr';
export type ThemeMode = 'light' | 'dark';

export type MediaApprovalStatus =
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ARCHIVED'
  | 'UNAVAILABLE'
  | 'PROCESSING'
  | 'FAILED';

export interface SurahSummary {
  number: number;
  arabicName: string;
  canonicalRefName: string;
  uzbekLatin: string;
  uzbekCyrillic: string;
  meaningLatin: string;
  meaningCyrillic: string;
  ayahCount: number;
  revelationType: 'Makkiy' | 'Madaniy';
  juzStart: number;
}

export interface AyahItem {
  number: number;
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter: number;
  sajda: boolean;
  arabic: string;
  uzbekLatin: string;
  uzbekCyrillic: string;
  ayahAudioUrl: string;
}

export interface SurahDetail extends SurahSummary {
  ayahs: AyahItem[];
  audioTracks: AudioTrackRecord[];
}

export interface ReciterProfile {
  id: string;
  slug: string;
  nameLatin: string;
  nameCyrillic: string;
  arabicName: string;
  countryOriginLatin: string;
  countryOriginCyrillic: string;
  isUzbekReciter: boolean;
  isDefaultFeatured: boolean;
  styleLatin: string;
  styleCyrillic: string;
  bioLatin: string;
  bioCyrillic: string;
  portraitUrl: string | null;
  sourceAttribution: string;
  licenseStatus: string;
  status: MediaApprovalStatus;
  verifiedSurahCount: number;
  expectedSurahCount: number;
  createdAt: string;
}

export interface AudioTrackRecord {
  id: string;
  reciterId: string;
  surahNumber: number;
  arabicSurahName: string;
  uzbekSurahLatin: string;
  uzbekSurahCyrillic: string;
  titleLatin: string;
  titleCyrillic: string;
  audioUrl: string;
  fallbackAudioUrl?: string;
  sourceName: string;
  sourceChannelOrUrl: string;
  telegramMessageId?: number;
  format: 'mp3' | 'm4a' | 'aac';
  durationSeconds?: number;
  fileSizeBytes?: number;
  rightsStatus: 'VERIFIED_AUTHORIZED' | 'PENDING_PERMISSION' | 'RESTRICTED';
  availabilityStatus: 'AVAILABLE' | 'UNAVAILABLE';
  status: MediaApprovalStatus;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoMediaRecord {
  id: string;
  youtubeVideoId: string;
  titleLatin: string;
  titleCyrillic: string;
  descriptionLatin: string;
  descriptionCyrillic: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelHandle: string;
  publishedAt: string;
  sourceUrl: string;
  category: string;
  reciterId?: string;
  surahNumber?: number;
  availabilityStatus: 'AVAILABLE' | 'UNAVAILABLE';
  status: MediaApprovalStatus;
  createdAt: string;
}

export interface ReciterValidationReport {
  reciterId: string;
  reciterNameLatin: string;
  reciterNameCyrillic: string;
  expectedSurahs: number;
  uniqueSurahsFound: number;
  validAudioRecordingsFound: number;
  missingSurahNumbers: number[];
  duplicateSurahNumbers: number[];
  duplicateUrlsCount: number;
  invalidOrUnavailableUrls: { surahNumber: number; url: string; reason: string }[];
  rightsVerifiedCount: number;
  isComplete114: boolean;
  liveProbedSample?: { surahNumber: number; status: number; ok: boolean; contentType: string | null }[];
  checkedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorEmail: string;
  action: string;
  targetType: 'AUDIO' | 'VIDEO' | 'RECITER' | 'SYNC' | 'SETTINGS' | 'AUTH';
  targetId: string;
  details: string;
  createdAt: string;
}

export interface BookmarkItem {
  id: string;
  type: 'surah' | 'ayah';
  surahNumber: number;
  ayahNumberInSurah?: number;
  arabicSnippet: string;
  uzbekSnippetCyrillic: string;
  createdAt: string;
}

export interface ReadingProgress {
  surahNumber: number;
  ayahNumberInSurah: number;
  updatedAt: string;
}

export interface ListeningProgress {
  reciterId: string;
  surahNumber: number;
  positionSeconds: number;
  durationSeconds: number;
  updatedAt: string;
}

export interface SearchResultPayload {
  query: string;
  surahs: SurahSummary[];
  ayahs: {
    surahNumber: number;
    surahLatin: string;
    surahCyrillic: string;
    surahArabic: string;
    numberInSurah: number;
    arabic: string;
    uzbekLatin: string;
    uzbekCyrillic: string;
  }[];
}

export interface PlatformHealthStatus {
  status: 'ok';
  appName: string;
  quranDataset: {
    arabicSource: string;
    translationAuthor: string;
    translationIdentifier: string;
    numberingConvention: string;
    expectedSurahs: number;
    actualSurahs: number;
    expectedAyahs: number;
    actualAyahs: number;
    verified: boolean;
  };
  integrations: {
    telegramBotConfigured: boolean;
    telegramWebhookSecretConfigured: boolean;
    telegramSourceChannel: string;
    youtubeApiConfigured: boolean;
    youtubeChannelHandle: string;
    adminSecretConfigured: boolean;
  };
  counts: {
    approvedReciters: number;
    approvedAudioTracks: number;
    pendingMediaCount: number;
    approvedVideos: number;
  };
  database?: {
    configured: boolean;
    projectId: string;
    databaseId: string;
    storageBucket: string;
  };
}

export interface DailyAyahRecord {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  surahLatin: string;
  surahCyrillic: string;
  surahArabic: string;
  arabicText: string;
  uzbekLatin: string;
  uzbekCyrillic: string;
  translationSource: string;
  audioUrl?: string;
  dateKey: string;
}

export interface DailyDuaRecord {
  id: string;
  titleLatin: string;
  titleCyrillic: string;
  arabicText: string;
  transliterationLatin: string;
  uzbekLatin: string;
  uzbekCyrillic: string;
  sourceReference: string;
  category: string;
  authenticityGrade: string;
  dateKey: string;
}

export interface DailyHadithRecord {
  id: string;
  arabicText: string;
  uzbekLatin: string;
  uzbekCyrillic: string;
  narratorLatin: string;
  collection: string;
  hadithNumber: string;
  authenticityGrade: string;
  dateKey: string;
}

export interface AsmaulHusnaItem {
  number: number;
  arabic: string;
  transliterationLatin: string;
  transliterationCyrillic: string;
  meaningLatin: string;
  meaningCyrillic: string;
  explanationLatin: string;
  explanationCyrillic: string;
}

export interface PrayerTimesRecord {
  city: string;
  country: string;
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayerName: string;
  nextPrayerCountdown: string;
}

export interface HifzProgressItem {
  surahNumber: number;
  ayahNumber: number;
  status: 'memorized' | 'learning' | 'revision';
  lastReviewedAt: string;
}

export interface KhatmPlanRecord {
  id: string;
  title: string;
  targetDays: number;
  currentDay: number;
  dailyJuzTarget: number;
  completedAyahs: number;
  totalAyahs: number;
  startDate: string;
  targetEndDate: string;
  status: 'active' | 'completed' | 'paused';
}

export interface TajwidLessonItem {
  id: string;
  titleLatin: string;
  titleCyrillic: string;
  category: 'makharij' | 'nun_sakinah' | 'mim_sakinah' | 'madd' | 'qalqalah' | 'waqf';
  summaryLatin: string;
  summaryCyrillic: string;
  contentLatin: string;
  contentCyrillic: string;
  examples: {
    arabic: string;
    transliteration: string;
    ruleExplanation: string;
  }[];
}

// ----------------------------------------------------
// PRAYER TIMES & GLOBAL CITIES TYPES
// ----------------------------------------------------

export type PrayerCalculationMethod =
  | 'uzbekistan' // Oʻzbekiston Musulmonlari Idorasi (Bomdod: 18°, Xufton: 17°, Asr: Hanafiy)
  | 'mwl' // Muslim World League (18°, 17°)
  | 'makkah' // Umm Al-Qura University, Makkah (18.5°, 90 min)
  | 'diyanet' // Turkiya Diyonat Islom Boshqarmasi (18°, 17°)
  | 'karachi' // University of Islamic Sciences, Karachi (18°, 18°)
  | 'isna' // Islamic Society of North America (15°, 15°)
  | 'egypt' // Egyptian General Authority of Survey (19.5°, 17.5°)
  | 'gulf' // Gulf Region / BAA (19.5°, 90 min)
  | 'kuwait' // Kuwait (18°, 17.5°)
  | 'qatar' // Qatar (18°, 90 min)
  | 'singapore' // MUIS Singapore (20°, 18°)
  | 'russia' // Rossiya Musulmonlari Diniy Boshqarmasi (16°, 15°)
  | 'moonsighting'; // Moonsighting Committee (18°, 18°)

export type AsrMadhab = 'hanafi' | 'shafii';
export type HighLatitudeRule = 'middle_of_the_night' | 'one_seventh' | 'angle_based';

export interface GlobalCity {
  id: string;
  nameLatin: string;
  nameCyrillic: string;
  nameArabic: string;
  nameEnglish: string;
  nameRussian: string;
  countryLatin: string;
  countryCyrillic: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string; // IANA timezone e.g. "Asia/Tashkent"
  defaultMethod: PrayerCalculationMethod;
  defaultMadhab: AsrMadhab;
  isOfficialTimetableAvailable?: boolean;
  officialSource?: string;
}

export interface AccuratePrayerTimes {
  date: string; // YYYY-MM-DD
  formattedDate: string;
  hijriDate: string;
  city: string;
  country: string;
  timezone: string;
  coordinates: { latitude: number; longitude: number };
  fajr: string; // Bomdod
  sunrise: string; // Quyosh
  dhuhr: string; // Peshin
  asr: string; // Asr
  maghrib: string; // Shom
  isha: string; // Xufton
  qiblaDegree: number; // Azimuth towards Kaaba in degrees
  sourceType: 'OFFICIAL_LOCAL_TIMETABLE' | 'CALCULATED_ASTRONOMICAL' | 'MANUALLY_ADJUSTED';
  sourceName: string;
  method: PrayerCalculationMethod;
  madhab: AsrMadhab;
  nextPrayer: {
    key: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    nameLatin: string;
    nameCyrillic: string;
    time: string;
    remainingMinutes: number;
    countdownTextLatin: string;
    countdownTextCyrillic: string;
  };
}

// ----------------------------------------------------
// SUPER ADMIN CMS TYPES
// ----------------------------------------------------

export type CMSContentType =
  | 'daily_ayah'
  | 'daily_dua'
  | 'daily_hadith'
  | 'announcement'
  | 'recitation'
  | 'video'
  | 'lesson'
  | 'article';

export type CMSPublicationStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'UNPUBLISHED'
  | 'ARCHIVED'
  | 'REJECTED';

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'CONTENT_ADMIN'
  | 'QURAN_REVIEWER'
  | 'AUDIO_MANAGER'
  | 'VIDEO_MANAGER'
  | 'MODERATOR'
  | 'SUPPORT_MANAGER'
  | 'ANALYST';

export interface CMSItemRecord {
  id: string;
  type: CMSContentType;
  titleLatin: string;
  titleCyrillic: string;
  arabicText?: string;
  contentLatin: string;
  contentCyrillic: string;
  category: string;
  author: string;
  source: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  status: CMSPublicationStatus;
  scheduledPublishAt?: string;
  publishedAt?: string;
  version: number;
  history: {
    version: number;
    changedBy: string;
    changedAt: string;
    reason: string;
    status: CMSPublicationStatus;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface HomeScreenSectionConfig {
  id: string;
  titleLatin: string;
  titleCyrillic: string;
  descriptionLatin: string;
  descriptionCyrillic: string;
  enabled: boolean;
  order: number;
  cardType: 'hero' | 'banner' | 'grid' | 'carousel' | 'list';
  badgeLatin?: string;
  badgeCyrillic?: string;
}

// ----------------------------------------------------
// REAL-TIME AYAH SYNCHRONIZATION TYPES
// ----------------------------------------------------

export interface AyahTimestampRecord {
  reciterId: string;
  surahNumber: number;
  ayahNumber: number;
  startTimeMs: number;
  endTimeMs: number;
  audioSourceId?: string;
  verificationStatus: 'VERIFIED_PLAYABLE' | 'VERIFIED_SOURCE_ONLY' | 'PENDING_REVIEW' | 'SYNC_PENDING';
  syncAccuracy: 'EXACT_MS' | 'ESTIMATED_ALIGNMENT' | 'MANUALLY_VERIFIED';
  lastVerifiedAt: string;
}

