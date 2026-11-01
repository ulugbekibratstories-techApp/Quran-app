import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type {
  UzbekScript,
  ThemeMode,
  SurahSummary,
  SurahDetail,
  AudioTrackRecord,
  BookmarkItem,
  ReadingProgress,
  ListeningProgress,
  ReciterProfile,
} from '../shared/types';
import { CANONICAL_SURAH_CATALOG } from '../shared/surahCatalog';
import { getUIString, localizeText, UIStringKey } from '../shared/i18n';
import {
  saveAudioOffline,
  getOfflineTrackBySurah,
  getAllOfflineTracks,
  deleteOfflineTrack,
  OfflineStoredTrack,
} from '../services/offlineAudioDb';
import { YASSER_DOSARI_RECITER_PROFILE } from '../data/yasserDosariData';
import { ALL_RECITERS_CATALOG } from '../data/allRecitersData';
import { getSurahDetail } from '../services/quranData';

export type AppView =
  | 'home'
  | 'quran'
  | 'audio'
  | 'reciters'
  | 'downloads'
  | 'videos'
  | 'saved'
  | 'settings'
  | 'admin'
  | 'prayer'
  | 'daily'
  | 'asmaulHusna'
  | 'hifzTajwid';

interface AppContextType {
  script: UzbekScript;
  setScript: (s: UzbekScript) => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  view: AppView;
  setView: (v: AppView) => void;

  // Active Surah & Ayah state
  activeSurahNumber: number;
  setActiveSurahNumber: (n: number) => void;
  activeAyahNumber: number | null;
  setActiveAyahNumber: (n: number | null) => void;
  openSurah: (surahNumber: number, ayahNumber?: number) => void;

  // Surahs Catalog
  surahs: SurahSummary[];
  activeSurahDetail: SurahDetail | null;
  isLoadingSurah: boolean;

  // Audio Player State
  currentTrack: AudioTrackRecord | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  repeatMode: 'none' | 'one' | 'all';
  sleepTimerRemaining: number | null;
  playTrack: (track: AudioTrackRecord) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setPlaybackRate: (rate: number) => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  startSleepTimer: (minutes: number) => void;
  clearSleepTimer: () => void;
  nextTrack: () => void;
  prevTrack: () => void;

  // Offline Audio
  offlineTracks: OfflineStoredTrack[];
  downloadTrack: (track: AudioTrackRecord) => Promise<boolean>;
  removeDownload: (id: string) => Promise<void>;
  isDownloaded: (reciterId: string, surahNumber: number) => boolean;
  downloadingIds: string[];

  // Reciters
  reciters: ReciterProfile[];
  selectedReciterId: string;
  setSelectedReciterId: (id: string) => void;

  // Bookmarks & Progress
  bookmarks: BookmarkItem[];
  toggleBookmark: (item: Omit<BookmarkItem, 'id' | 'createdAt'>) => void;
  isBookmarked: (surahNumber: number, ayahNumberInSurah?: number) => boolean;
  readingProgress: ReadingProgress;
  setReadingProgress: (rp: ReadingProgress) => void;
  listeningProgress: ListeningProgress | null;

  // Settings
  arabicFontSize: number;
  setArabicFontSize: (size: number) => void;

  // Localization helpers
  t: (key: UIStringKey) => string;
  loc: (latin: string, cyrillic?: string) => string;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_MISHARY_RECITER: ReciterProfile = {
  id: 'mishary_alafasy',
  slug: 'mishary-alafasy',
  nameLatin: 'Shayx Mishariy Roshid Alafasy',
  nameCyrillic: 'Шайх Мишарий Рошид Алафасий',
  arabicName: 'مشاري بن راشد العفاسي',
  countryOriginLatin: 'Quvayt',
  countryOriginCyrillic: 'Қувайт',
  isUzbekReciter: false,
  isDefaultFeatured: true,
  styleLatin: 'Hafs an Asim (Murattal)',
  styleCyrillic: 'Ҳафс ан Осим (Мураттал)',
  bioLatin: 'Dunyo miqyosidagi taniqli qori, toʻliq 114 surani yuqori sifatli va mualliflik tasdiqlangan audio formatida oʻqigan.',
  bioCyrillic: 'Дунё миқёсидаги таниқли қори, тўлиқ 114 сурани юқори сифатли ва муаллифлик тасдиқланган аудио форматида ўқиган.',
  portraitUrl: null,
  sourceAttribution: 'EveryAyah & Quran Central Canonical Archive',
  licenseStatus: 'Verified Open Religious Distribution',
  status: 'APPROVED',
  verifiedSurahCount: 114,
  expectedSurahCount: 114,
  createdAt: '2026-01-01T00:00:00.000Z',
};



export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme & Script
  const [script, setScriptState] = useState<UzbekScript>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('quron_script') as UzbekScript) || 'lat';
    }
    return 'lat';
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quron_theme') as ThemeMode;
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [view, setView] = useState<AppView>('home');
  const [activeSurahNumber, setActiveSurahNumber] = useState<number>(1);
  const [activeAyahNumber, setActiveAyahNumber] = useState<number | null>(null);
  const [activeSurahDetail, setActiveSurahDetail] = useState<SurahDetail | null>(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState<boolean>(false);

  // Settings
  const [arabicFontSize, setArabicFontSizeState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quron_font_size');
      return saved ? parseInt(saved, 10) : 28;
    }
    return 28;
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('quron_bookmarks');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Reading progress
  const [readingProgress, setReadingProgressState] = useState<ReadingProgress>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('quron_reading_prog');
        return saved ? JSON.parse(saved) : { surahNumber: 1, ayahNumberInSurah: 1, updatedAt: new Date().toISOString() };
      } catch {
        return { surahNumber: 1, ayahNumberInSurah: 1, updatedAt: new Date().toISOString() };
      }
    }
    return { surahNumber: 1, ayahNumberInSurah: 1, updatedAt: new Date().toISOString() };
  });

  // Listening progress
  const [listeningProgress, setListeningProgressState] = useState<ListeningProgress | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('quron_listening_prog');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  // Reciters (All 13 Verified Reciters)
  const [reciters] = useState<ReciterProfile[]>(ALL_RECITERS_CATALOG);
  const [selectedReciterId, setSelectedReciterId] = useState<string>('mishary_alafasy');

  // Offline Audio
  const [offlineTracks, setOfflineTracks] = useState<OfflineStoredTrack[]>([]);
  const [downloadingIds, setDownloadingIds] = useState<string[]>([]);
  const [blobUrlMap, setBlobUrlMap] = useState<Map<string, string>>(new Map());

  // HTML5 Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioTrackRecord | null>(null);
  const currentTrackRef = useRef<AudioTrackRecord | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);
  const playbackRateRef = useRef<number>(1);
  const [repeatMode, setRepeatModeState] = useState<'none' | 'one' | 'all'>('none');
  const repeatModeRef = useRef<'none' | 'one' | 'all'>('none');
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const sleepTimerIntervalRef = useRef<number | null>(null);
  const activeSurahNumberRef = useRef<number>(activeSurahNumber);

  useEffect(() => {
    activeSurahNumberRef.current = activeSurahNumber;
  }, [activeSurahNumber]);

  // Sync theme to HTML
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('quron_theme', theme);
  }, [theme]);

  // Sync script
  const setScript = (s: UzbekScript) => {
    setScriptState(s);
    localStorage.setItem('quron_script', s);
  };

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
  };

  const setArabicFontSize = (size: number) => {
    setArabicFontSizeState(size);
    localStorage.setItem('quron_font_size', size.toString());
  };

  const setReadingProgress = (rp: ReadingProgress) => {
    setReadingProgressState(rp);
    localStorage.setItem('quron_reading_prog', JSON.stringify(rp));
  };

  const setRepeatMode = (m: 'none' | 'one' | 'all') => {
    setRepeatModeState(m);
    repeatModeRef.current = m;
  };

  // Safe play helper to prevent "play() request was interrupted by a call to pause()"
  const safePlay = async (audio: HTMLAudioElement): Promise<void> => {
    try {
      const p = audio.play();
      if (p !== undefined) {
        playPromiseRef.current = p;
        await p;
        setIsPlaying(true);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('[Audio] Playback notice:', err?.message || err);
      }
      setIsPlaying(false);
    } finally {
      playPromiseRef.current = null;
    }
  };

  // Safe pause helper that awaits any pending play promise before pausing
  const safePause = async (audio: HTMLAudioElement): Promise<void> => {
    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch {
        // Ignore aborted promise
      }
    }
    try {
      audio.pause();
    } catch {
      // Ignore
    }
    setIsPlaying(false);
  };

  // Load offline tracks on mount
  useEffect(() => {
    getAllOfflineTracks().then((tracks) => {
      setOfflineTracks(tracks);
      const map = new Map<string, string>();
      for (const track of tracks) {
        map.set(track.id, URL.createObjectURL(track.blob));
      }
      setBlobUrlMap(map);
    }).catch(console.error);
  }, []);

  // Initialize Audio element once on mount
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      const active = currentTrackRef.current;
      if (active) {
        const prog: ListeningProgress = {
          reciterId: active.reciterId,
          surahNumber: active.surahNumber,
          positionSeconds: audio.currentTime,
          durationSeconds: audio.duration || 0,
          updatedAt: new Date().toISOString(),
        };
        setListeningProgressState(prog);
        localStorage.setItem('quron_listening_prog', JSON.stringify(prog));
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      if (repeatModeRef.current === 'one') {
        audio.currentTime = 0;
        safePlay(audio);
      } else if (repeatModeRef.current === 'all') {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    const onError = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      safePause(audio);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Load surah detail from bundled client-side Quran data
  useEffect(() => {
    setIsLoadingSurah(true);
    const detail = getSurahDetail(activeSurahNumber);
    setActiveSurahDetail(detail);
    setIsLoadingSurah(false);
  }, [activeSurahNumber]);

  // Audio Controls
  const playTrack = async (track: AudioTrackRecord) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Check if offline blob URL exists
    const offlineId = `${track.reciterId}_${track.surahNumber}`;
    const blobUrl = blobUrlMap.get(offlineId);
    const audioSrc = blobUrl || track.audioUrl;

    if (currentTrackRef.current?.id === track.id && audio.src === audioSrc) {
      if (audio.paused) {
        await safePlay(audio);
      }
      return;
    }

    // Safely pause current playback before switching source
    await safePause(audio);

    setCurrentTrack(track);
    currentTrackRef.current = track;
    audio.src = audioSrc;
    audio.playbackRate = playbackRateRef.current;

    try {
      await safePlay(audio);
    } catch {
      if (track.fallbackAudioUrl && audio.src !== track.fallbackAudioUrl) {
        audio.src = track.fallbackAudioUrl;
        await safePlay(audio);
      }
    }
  };

  const pauseTrack = async () => {
    const audio = audioRef.current;
    if (audio) {
      await safePause(audio);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      await safePause(audio);
    } else if (currentTrackRef.current) {
      await safePlay(audio);
    } else {
      // Play surah 1 by default
      const defaultSurahNum = activeSurahNumberRef.current || 1;
      const surahPad = String(defaultSurahNum).padStart(3, '0');
      const track: AudioTrackRecord = {
        id: `mishary_alafasy_${defaultSurahNum}`,
        reciterId: 'mishary_alafasy',
        surahNumber: defaultSurahNum,
        arabicSurahName: CANONICAL_SURAH_CATALOG[defaultSurahNum - 1].arabicName,
        uzbekSurahLatin: CANONICAL_SURAH_CATALOG[defaultSurahNum - 1].uzbekLatin,
        uzbekSurahCyrillic: CANONICAL_SURAH_CATALOG[defaultSurahNum - 1].uzbekCyrillic,
        titleLatin: `${defaultSurahNum}. ${CANONICAL_SURAH_CATALOG[defaultSurahNum - 1].uzbekLatin} surasi`,
        titleCyrillic: `${defaultSurahNum}. ${CANONICAL_SURAH_CATALOG[defaultSurahNum - 1].uzbekCyrillic} сураси`,
        audioUrl: `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${surahPad}.mp3`,
        fallbackAudioUrl: `https://server8.mp3quran.net/afs/${surahPad}.mp3`,
        sourceName: 'Quranicaudio Canonical',
        sourceChannelOrUrl: 'https://download.quranicaudio.com',
        format: 'mp3',
        rightsStatus: 'VERIFIED_AUTHORIZED',
        availabilityStatus: 'AVAILABLE',
        status: 'APPROVED',
        category: 'Murattal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await playTrack(track);
    }
  };

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    playbackRateRef.current = rate;
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const nextTrack = () => {
    const currentNum = currentTrack ? currentTrack.surahNumber : activeSurahNumber;
    const nextNum = currentNum < 114 ? currentNum + 1 : 1;
    const pad = String(nextNum).padStart(3, '0');
    const surah = CANONICAL_SURAH_CATALOG[nextNum - 1];
    const track: AudioTrackRecord = {
      id: `${currentTrack?.reciterId || 'mishary_alafasy'}_${nextNum}`,
      reciterId: currentTrack?.reciterId || 'mishary_alafasy',
      surahNumber: nextNum,
      arabicSurahName: surah.arabicName,
      uzbekSurahLatin: surah.uzbekLatin,
      uzbekSurahCyrillic: surah.uzbekCyrillic,
      titleLatin: `${nextNum}. ${surah.uzbekLatin} surasi`,
      titleCyrillic: `${nextNum}. ${surah.uzbekCyrillic} сураси`,
      audioUrl: `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${pad}.mp3`,
      fallbackAudioUrl: `https://server8.mp3quran.net/afs/${pad}.mp3`,
      sourceName: 'Quranicaudio Canonical',
      sourceChannelOrUrl: 'https://download.quranicaudio.com',
      format: 'mp3',
      rightsStatus: 'VERIFIED_AUTHORIZED',
      availabilityStatus: 'AVAILABLE',
      status: 'APPROVED',
      category: 'Murattal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    playTrack(track);
  };

  const prevTrack = () => {
    const currentNum = currentTrack ? currentTrack.surahNumber : activeSurahNumber;
    const prevNum = currentNum > 1 ? currentNum - 1 : 114;
    const pad = String(prevNum).padStart(3, '0');
    const surah = CANONICAL_SURAH_CATALOG[prevNum - 1];
    const track: AudioTrackRecord = {
      id: `${currentTrack?.reciterId || 'mishary_alafasy'}_${prevNum}`,
      reciterId: currentTrack?.reciterId || 'mishary_alafasy',
      surahNumber: prevNum,
      arabicSurahName: surah.arabicName,
      uzbekSurahLatin: surah.uzbekLatin,
      uzbekSurahCyrillic: surah.uzbekCyrillic,
      titleLatin: `${prevNum}. ${surah.uzbekLatin} surasi`,
      titleCyrillic: `${prevNum}. ${surah.uzbekCyrillic} сураси`,
      audioUrl: `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${pad}.mp3`,
      fallbackAudioUrl: `https://server8.mp3quran.net/afs/${pad}.mp3`,
      sourceName: 'Quranicaudio Canonical',
      sourceChannelOrUrl: 'https://download.quranicaudio.com',
      format: 'mp3',
      rightsStatus: 'VERIFIED_AUTHORIZED',
      availabilityStatus: 'AVAILABLE',
      status: 'APPROVED',
      category: 'Murattal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    playTrack(track);
  };

  const startSleepTimer = (minutes: number) => {
    if (sleepTimerIntervalRef.current) {
      clearInterval(sleepTimerIntervalRef.current);
    }
    const totalSecs = minutes * 60;
    setSleepTimerRemaining(totalSecs);

    const interval = window.setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          pauseTrack();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    sleepTimerIntervalRef.current = interval;
  };

  const clearSleepTimer = () => {
    if (sleepTimerIntervalRef.current) {
      clearInterval(sleepTimerIntervalRef.current);
      sleepTimerIntervalRef.current = null;
    }
    setSleepTimerRemaining(null);
  };

  // Offline Audio Downloads
  const downloadTrack = async (track: AudioTrackRecord): Promise<boolean> => {
    const trackId = `${track.reciterId}_${track.surahNumber}`;
    if (downloadingIds.includes(trackId)) return false;

    setDownloadingIds((prev) => [...prev, trackId]);
    try {
      // Fetch audio blob
      const res = await fetch(track.audioUrl, { mode: 'cors' }).catch(() => {
        if (track.fallbackAudioUrl) {
          return fetch(track.fallbackAudioUrl, { mode: 'cors' });
        }
        throw new Error('Audio download failed');
      });

      if (!res.ok) throw new Error('Audio fetch HTTP error');
      const blob = await res.blob();

      const surah = CANONICAL_SURAH_CATALOG[track.surahNumber - 1];
      const offlineItem: OfflineStoredTrack = {
        id: trackId,
        reciterId: track.reciterId,
        surahNumber: track.surahNumber,
        surahNameLatin: surah.uzbekLatin,
        surahNameCyrillic: surah.uzbekCyrillic,
        surahNameArabic: surah.arabicName,
        blob,
        mimeType: blob.type || 'audio/mpeg',
        sizeBytes: blob.size,
        savedAt: new Date().toISOString(),
      };

      await saveAudioOffline(offlineItem);

      // Update state
      const blobUrl = URL.createObjectURL(blob);
      setBlobUrlMap((prev) => new Map(prev).set(trackId, blobUrl));
      const all = await getAllOfflineTracks();
      setOfflineTracks(all);
      setDownloadingIds((prev) => prev.filter((id) => id !== trackId));
      return true;
    } catch (err) {
      console.error('Failed to download audio track offline:', err);
      setDownloadingIds((prev) => prev.filter((id) => id !== trackId));
      return false;
    }
  };

  const removeDownload = async (id: string) => {
    await deleteOfflineTrack(id);
    const existingUrl = blobUrlMap.get(id);
    if (existingUrl) {
      URL.revokeObjectURL(existingUrl);
      setBlobUrlMap((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    }
    const all = await getAllOfflineTracks();
    setOfflineTracks(all);
  };

  const isDownloaded = (reciterId: string, surahNumber: number) => {
    const id = `${reciterId}_${surahNumber}`;
    return offlineTracks.some((t) => t.id === id);
  };

  // Bookmarks
  const toggleBookmark = (item: Omit<BookmarkItem, 'id' | 'createdAt'>) => {
    const exists = bookmarks.some(
      (b) =>
        b.surahNumber === item.surahNumber &&
        b.ayahNumberInSurah === item.ayahNumberInSurah &&
        b.type === item.type
    );

    let updated: BookmarkItem[];
    if (exists) {
      updated = bookmarks.filter(
        (b) =>
          !(
            b.surahNumber === item.surahNumber &&
            b.ayahNumberInSurah === item.ayahNumberInSurah &&
            b.type === item.type
          )
      );
    } else {
      const newBm: BookmarkItem = {
        ...item,
        id: `${item.type}_${item.surahNumber}_${item.ayahNumberInSurah || 0}`,
        createdAt: new Date().toISOString(),
      };
      updated = [newBm, ...bookmarks];
    }
    setBookmarks(updated);
    localStorage.setItem('quron_bookmarks', JSON.stringify(updated));
  };

  const isBookmarked = (surahNumber: number, ayahNumberInSurah?: number) => {
    if (ayahNumberInSurah !== undefined) {
      return bookmarks.some(
        (b) => b.type === 'ayah' && b.surahNumber === surahNumber && b.ayahNumberInSurah === ayahNumberInSurah
      );
    }
    return bookmarks.some((b) => b.type === 'surah' && b.surahNumber === surahNumber);
  };

  const openSurah = (surahNumber: number, ayahNumber?: number) => {
    setActiveSurahNumber(surahNumber);
    setActiveAyahNumber(ayahNumber ?? null);
    setView('quran');
    setReadingProgress({
      surahNumber,
      ayahNumberInSurah: ayahNumber ?? 1,
      updatedAt: new Date().toISOString(),
    });
  };

  // i18n
  const t = (key: UIStringKey): string => getUIString(key, script);
  const loc = (latin: string, cyrillic?: string): string => localizeText(script, latin, cyrillic);

  return (
    <AppContext.Provider
      value={{
        script,
        setScript,
        theme,
        setTheme,
        view,
        setView,
        activeSurahNumber,
        setActiveSurahNumber,
        activeAyahNumber,
        setActiveAyahNumber,
        openSurah,
        surahs: CANONICAL_SURAH_CATALOG,
        activeSurahDetail,
        isLoadingSurah,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        playbackRate,
        repeatMode,
        sleepTimerRemaining,
        playTrack,
        pauseTrack,
        togglePlay,
        seek,
        setPlaybackRate,
        setRepeatMode,
        startSleepTimer,
        clearSleepTimer,
        nextTrack,
        prevTrack,
        offlineTracks,
        downloadTrack,
        removeDownload,
        isDownloaded,
        downloadingIds,
        reciters,
        selectedReciterId,
        setSelectedReciterId,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        readingProgress,
        setReadingProgress,
        listeningProgress,
        arabicFontSize,
        setArabicFontSize,
        t,
        loc,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
