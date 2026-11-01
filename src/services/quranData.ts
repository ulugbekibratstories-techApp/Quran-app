import type { SurahDetail, AyahItem, AudioTrackRecord } from '../shared/types';
import { CANONICAL_SURAH_CATALOG } from '../shared/surahCatalog';
import { cyrillicToLatin } from '../shared/uzbekScript';
import quranJson from '../../data/quran-verified.json';

interface RawAyah {
  number: number;
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter: number;
  sajda: boolean;
  arabic: string;
  uzbekCyrillic: string;
}

interface RawSurah {
  number: number;
  ayahs: RawAyah[];
}

interface RawQuranData {
  surahs: RawSurah[];
}

const rawQuranData = quranJson as unknown as RawQuranData;

const surahCache = new Map<number, SurahDetail>();

export function getSurahDetail(num: number): SurahDetail | null {
  if (num < 1 || num > 114) return null;
  if (surahCache.has(num)) return surahCache.get(num)!;

  const summary = CANONICAL_SURAH_CATALOG[num - 1];
  const surahData = rawQuranData.surahs.find((s) => s.number === num);
  if (!surahData) return null;

  const pad = String(num).padStart(3, '0');
  const audioTracks: AudioTrackRecord[] = [
    {
      id: `mishary_alafasy_${num}`,
      reciterId: 'mishary_alafasy',
      surahNumber: num,
      arabicSurahName: summary.arabicName,
      uzbekSurahLatin: summary.uzbekLatin,
      uzbekSurahCyrillic: summary.uzbekCyrillic,
      titleLatin: `${num}. ${summary.uzbekLatin} surasi`,
      titleCyrillic: `${num}. ${summary.uzbekCyrillic} сураси`,
      audioUrl: `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${pad}.mp3`,
      fallbackAudioUrl: `https://server8.mp3quran.net/afs/${pad}.mp3`,
      sourceName: 'Quranicaudio Canonical',
      sourceChannelOrUrl: 'https://download.quranicaudio.com',
      format: 'mp3',
      rightsStatus: 'VERIFIED_AUTHORIZED',
      availabilityStatus: 'AVAILABLE',
      status: 'APPROVED',
      category: 'Murattal',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: `yasser_dosari_${num}`,
      reciterId: 'yasser_al_dosari',
      surahNumber: num,
      arabicSurahName: summary.arabicName,
      uzbekSurahLatin: summary.uzbekLatin,
      uzbekSurahCyrillic: summary.uzbekCyrillic,
      titleLatin: `${num}. ${summary.uzbekLatin} surasi`,
      titleCyrillic: `${num}. ${summary.uzbekCyrillic} сураси`,
      audioUrl: `https://server11.mp3quran.net/yasser/${pad}.mp3`,
      fallbackAudioUrl: `https://download.quranicaudio.com/quran/yasser_ad-dussary/${pad}.mp3`,
      sourceName: 'Mp3Quran & Quranicaudio Verified CDN',
      sourceChannelOrUrl: 'https://server11.mp3quran.net/yasser/',
      format: 'mp3',
      rightsStatus: 'VERIFIED_AUTHORIZED',
      availabilityStatus: 'AVAILABLE',
      status: 'APPROVED',
      category: 'Murattal',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  ];

  const ayahs: AyahItem[] = surahData.ayahs.map((a) => {
    const ayahPadSurah = String(num).padStart(3, '0');
    const ayahPadAyah = String(a.numberInSurah).padStart(3, '0');
    return {
      number: a.number,
      numberInSurah: a.numberInSurah,
      juz: a.juz,
      page: a.page,
      hizbQuarter: a.hizbQuarter,
      sajda: Boolean(a.sajda),
      arabic: a.arabic,
      uzbekCyrillic: a.uzbekCyrillic,
      uzbekLatin: cyrillicToLatin(a.uzbekCyrillic),
      ayahAudioUrl: `https://everyayah.com/data/Alafasy_128kbps/${ayahPadSurah}${ayahPadAyah}.mp3`,
    };
  });

  const detail: SurahDetail = {
    ...summary,
    ayahs,
    audioTracks,
  };

  surahCache.set(num, detail);
  return detail;
}

export function searchQuran(query: string): {
  surahs: typeof CANONICAL_SURAH_CATALOG;
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
} {
  const q = query.trim().toLowerCase();
  if (!q) return { surahs: [], ayahs: [] };

  const matchedSurahs = CANONICAL_SURAH_CATALOG.filter(
    (s) =>
      s.number.toString() === q ||
      s.uzbekLatin.toLowerCase().includes(q) ||
      s.uzbekCyrillic.toLowerCase().includes(q) ||
      s.meaningLatin.toLowerCase().includes(q) ||
      s.meaningCyrillic.toLowerCase().includes(q) ||
      s.arabicName.includes(q)
  );

  const matchedAyahs: {
    surahNumber: number;
    surahLatin: string;
    surahCyrillic: string;
    surahArabic: string;
    numberInSurah: number;
    arabic: string;
    uzbekLatin: string;
    uzbekCyrillic: string;
  }[] = [];

  for (const s of rawQuranData.surahs) {
    if (matchedAyahs.length >= 25) break;
    const catalogSurah = CANONICAL_SURAH_CATALOG[s.number - 1];
    for (const a of s.ayahs) {
      if (matchedAyahs.length >= 25) break;
      const lat = cyrillicToLatin(a.uzbekCyrillic).toLowerCase();
      const cyr = a.uzbekCyrillic.toLowerCase();
      const ar = a.arabic;
      if (lat.includes(q) || cyr.includes(q) || ar.includes(q)) {
        matchedAyahs.push({
          surahNumber: s.number,
          surahLatin: catalogSurah.uzbekLatin,
          surahCyrillic: catalogSurah.uzbekCyrillic,
          surahArabic: catalogSurah.arabicName,
          numberInSurah: a.numberInSurah,
          arabic: a.arabic,
          uzbekLatin: cyrillicToLatin(a.uzbekCyrillic),
          uzbekCyrillic: a.uzbekCyrillic,
        });
      }
    }
  }

  return { surahs: matchedSurahs, ayahs: matchedAyahs };
}
