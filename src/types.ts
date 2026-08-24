export type RevelationType = 'مكية' | 'مدنية';

export interface Ayah {
  number: number;
  text: string;
  textClean: string; // without tashkeel for searching
  translation: string;
  translations?: Record<string, string>; // multi-language translations (e.g. en, fr, ur, tr, id, es, de, ru, bn, fa, sw, zh)
  tafsir: string;
  audioKey: string; // e.g. "078001"
}

export interface Surah {
  id: number;
  name: string;
  englishName: string;
  englishTranslation: string;
  revelationType: RevelationType;
  numberOfAyahs: number;
  pageNumber: number;
  theme: string;
  virtue?: string;
  ayahs: Ayah[];
}

export interface Reciter {
  id: string;
  name: string;
  subname: string;
  serverSubpath: string;
  quality: string;
  style?: string; // مرتل، مجود، معلم، رواية ورش، إلخ
  country?: string;
}

export type ViewMode = 'mushaf' | 'verse-by-verse' | 'verse' | 'memorize' | 'virtues';

export type ThemeColor = 'gray-orange' | 'dark-gray' | 'slate' | 'charcoal';

export interface Bookmark {
  surahId: number;
  ayahNumber: number;
  timestamp: number;
  note?: string;
}

export type HifzStatus = 'not_started' | 'learning' | 'memorized' | 'needs_review';

export interface HifzRecord {
  [surahId: number]: {
    status: HifzStatus;
    lastReviewed?: number;
    notes?: string;
    completedAyahs?: number[];
  };
}

export type RepeatScope = 'ayah' | 'surah' | 'range';

export interface HifzRangeConfig {
  fromAyah: number;
  toAyah: number;
  repeatPerAyah: number;
  repeatRangeCount: number; // 1, 3, 5, -1 (infinity)
  currentRangeIteration: number;
}

export interface PlayerState {
  isPlaying: boolean;
  currentSurahId: number;
  currentAyahIndex: number;
  reciterId: string;
  repeatScope: RepeatScope;
  repeatCount: number; // 1, 2, 3, 5, 7, 10, -1 (infinity)
  currentRepeatIteration: number;
  pauseDuration: number; // 0, 1, 2, 3 seconds
  hifzRange: HifzRangeConfig | null;
  playbackSpeed: number;
  autoScroll: boolean;
}
