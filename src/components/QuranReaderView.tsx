import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Download,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Volume2,
  ListFilter,
  Eye,
  EyeOff,
  Sparkles,
  Users,
  Radio,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AudioTrackRecord, AyahItem } from '../shared/types';
import { ALL_RECITERS_CATALOG, getReciterAudioTracks } from '../data/allRecitersData';
import { getAyahTimestamps, findActiveAyahNumber } from '../data/ayahTimestampsData';

export const QuranReaderView: React.FC = () => {
  const {
    surahs,
    activeSurahNumber,
    activeAyahNumber,
    setActiveAyahNumber,
    openSurah,
    activeSurahDetail,
    isLoadingSurah,
    arabicFontSize,
    setArabicFontSize,
    toggleBookmark,
    isBookmarked,
    playTrack,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    seek,
    togglePlay,
    downloadTrack,
    isDownloaded,
    downloadingIds,
    selectedReciterId,
    setSelectedReciterId,
    loc,
    pauseTrack,
  } = useApp();

  const [showSurahDrawer, setShowSurahDrawer] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [showTranslation, setShowTranslation] = useState(true);
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const ayahAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentSurah = surahs.find((s) => s.number === activeSurahNumber) || surahs[0];
  const activeReciter = ALL_RECITERS_CATALOG.find((r) => r.id === selectedReciterId) || ALL_RECITERS_CATALOG[0];

  // Real-time Ayah Synchronization: compute timestamps and track active ayah
  const isCurrentSurahPlaying = isPlaying && currentTrack?.surahNumber === activeSurahNumber;
  const ayahTimestamps = activeSurahDetail
    ? getAyahTimestamps(
        currentTrack?.reciterId || selectedReciterId,
        activeSurahNumber,
        activeSurahDetail.ayahs,
        duration || 0
      )
    : [];

  useEffect(() => {
    if (isCurrentSurahPlaying && ayahTimestamps.length > 0) {
      const liveAyah = findActiveAyahNumber(ayahTimestamps, currentTime * 1000);
      if (liveAyah && liveAyah !== activeAyahNumber) {
        setActiveAyahNumber(liveAyah);
      }
    }
  }, [currentTime, isCurrentSurahPlaying, ayahTimestamps, activeAyahNumber, setActiveAyahNumber]);

  // Smooth auto-scroll to active ayah without jitter
  useEffect(() => {
    if (autoScrollEnabled && activeAyahNumber && ayahRefs.current[activeAyahNumber]) {
      ayahRefs.current[activeAyahNumber]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeAyahNumber, autoScrollEnabled]);

  useEffect(() => {
    return () => {
      if (ayahAudioRef.current) {
        try {
          ayahAudioRef.current.pause();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleCopyAyah = (ayah: AyahItem) => {
    const textToCopy = `${ayah.arabic}\n\n${loc(ayah.uzbekLatin, ayah.uzbekCyrillic)}\n[${currentSurah.uzbekLatin} surasi, ${ayah.numberInSurah}-oyat]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyahNumber(ayah.numberInSurah);
    setTimeout(() => setCopiedAyahNumber(null), 2000);
  };

  const handlePlayAyahAudio = async (ayah: AyahItem) => {
    // If the full surah is already playing, seek to that ayah's timestamp!
    if (isCurrentSurahPlaying) {
      const ts = ayahTimestamps.find((t) => t.ayahNumber === ayah.numberInSurah);
      if (ts) {
        seek(ts.startTimeMs / 1000);
        return;
      }
    }

    if (ayah.ayahAudioUrl) {
      if (ayahAudioRef.current) {
        try {
          ayahAudioRef.current.pause();
        } catch {
          // ignore
        }
      }
      const audioObj = new Audio(ayah.ayahAudioUrl);
      ayahAudioRef.current = audioObj;
      try {
        const p = audioObj.play();
        if (p !== undefined) {
          await p;
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('[AyahAudio] Play warning:', err);
        }
      }
    }
  };

  const handlePlayFullSurah = () => {
    if (isPlaying && currentTrack?.surahNumber === activeSurahNumber) {
      pauseTrack();
      return;
    }

    const reciterTracks = getReciterAudioTracks(selectedReciterId);
    const surahTrack = reciterTracks.find((t) => t.surahNumber === activeSurahNumber);

    if (surahTrack && surahTrack.availabilityStatus === 'AVAILABLE') {
      playTrack(surahTrack);
    } else {
      // Fallback to Mishary Alafasy canonical track
      const defaultTracks = getReciterAudioTracks('mishary_alafasy');
      const defaultTrack = defaultTracks.find((t) => t.surahNumber === activeSurahNumber);
      if (defaultTrack) {
        playTrack(defaultTrack);
      }
    }
  };

  const handleAyahClick = (ayah: AyahItem) => {
    setActiveAyahNumber(ayah.numberInSurah);

    // Seek in live full surah if playing
    if (isCurrentSurahPlaying) {
      const ts = ayahTimestamps.find((t) => t.ayahNumber === ayah.numberInSurah);
      if (ts) {
        seek(ts.startTimeMs / 1000);
      }
    }
  };

  const handlePrevSurah = () => {
    if (activeSurahNumber > 1) {
      openSurah(activeSurahNumber - 1);
    }
  };

  const handleNextSurah = () => {
    if (activeSurahNumber < 114) {
      openSurah(activeSurahNumber + 1);
    }
  };

  const isSurahOffline = isDownloaded(selectedReciterId, activeSurahNumber);
  const isSurahDownloading = downloadingIds.includes(`${selectedReciterId}_${activeSurahNumber}`);

  const filteredSurahsList = surahs.filter(
    (s) =>
      s.number.toString().includes(drawerSearch) ||
      s.uzbekLatin.toLowerCase().includes(drawerSearch.toLowerCase()) ||
      s.uzbekCyrillic.toLowerCase().includes(drawerSearch.toLowerCase()) ||
      s.arabicName.includes(drawerSearch)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 w-full max-w-full overflow-hidden">
      {/* Top Controller Bar */}
      <div className="bg-white/95 dark:bg-stone-900/95 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-wrap items-center justify-between gap-3 sticky top-18 z-20 backdrop-blur-md">
        {/* Surah Drawer trigger */}
        <button
          onClick={() => setShowSurahDrawer(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-bold text-sm transition"
        >
          <ListFilter className="w-4 h-4 text-emerald-600" />
          <span>
            {activeSurahNumber}. {loc(currentSurah.uzbekLatin, currentSurah.uzbekCyrillic)}
          </span>
          <span className="text-xs text-stone-400 font-normal">
            ({currentSurah.ayahCount} {loc('oyat', 'оят')})
          </span>
        </button>

        {/* Reciter Selector Dropdown */}
        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-xl border border-stone-200 dark:border-stone-700">
          <Users className="w-3.5 h-3.5 text-emerald-600" />
          <select
            value={selectedReciterId}
            onChange={(e) => setSelectedReciterId(e.target.value)}
            className="bg-transparent text-xs font-bold text-stone-800 dark:text-stone-200 focus:outline-hidden cursor-pointer"
          >
            {ALL_RECITERS_CATALOG.map((rec) => (
              <option key={rec.id} value={rec.id} className="dark:bg-stone-900">
                {loc(rec.nameLatin, rec.nameCyrillic)} {rec.verifiedSurahCount === 114 ? '(114 sura)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Audio trigger for full surah */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayFullSurah}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
              isCurrentSurahPlaying
                ? 'bg-amber-500 text-stone-950 hover:bg-amber-400 animate-pulse'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {isCurrentSurahPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>{loc('Pauza', 'Пауза')}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{loc('Audioni tinglash', 'Аудио тинглаш')}</span>
              </>
            )}
          </button>

          {/* Translation Toggle */}
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`p-1.5 rounded-lg border transition ${
              showTranslation
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : 'text-stone-400 border-stone-200 dark:border-stone-800'
            }`}
            title="Oʻzbekcha tarjimani koʻrsatish / yashirish"
          >
            {showTranslation ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Font Size Adjuster */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setArabicFontSize(Math.max(20, arabicFontSize - 2))}
              className="px-2 py-0.5 rounded hover:bg-white dark:hover:bg-stone-700 font-bold"
              title="Shriftni kichraytirish"
            >
              A-
            </button>
            <span className="px-1 text-[11px] font-mono text-stone-500">{arabicFontSize}</span>
            <button
              onClick={() => setArabicFontSize(Math.min(48, arabicFontSize + 2))}
              className="px-2 py-0.5 rounded hover:bg-white dark:hover:bg-stone-700 font-bold"
              title="Shriftni kattalashtirish"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Surah Header Card with Islamic Ornament */}
      <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-semibold">
            <span>{currentSurah.revelationType}</span>
            <span>·</span>
            <span>{currentSurah.ayahCount} {loc('oyat', 'оят')}</span>
            <span>·</span>
            <span>{currentSurah.juzStart}-juz</span>
          </div>

          <h1 className="font-arabic text-4xl sm:text-5xl text-amber-300 font-normal py-1">
            {currentSurah.arabicName}
          </h1>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {currentSurah.number}. {loc(currentSurah.uzbekLatin, currentSurah.uzbekCyrillic)}
          </h2>

          <p className="text-sm text-emerald-200 max-w-md mx-auto">
            {loc(currentSurah.meaningLatin, currentSurah.meaningCyrillic)}
          </p>

          {/* Real-time synchronization active indicator */}
          {isCurrentSurahPlaying && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-amber-500/40 text-amber-300 text-xs font-semibold animate-pulse shadow-sm">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {loc('Oyatlar audio bilan real vaqtda sinxronlanmoqda...', 'Оятлар аудио билан реал вақтда синхронланмоқда...')}
              </span>
            </div>
          )}

          {/* Bismillah (except Surah 9 At-Tawbah and Surah 1 where it is Ayah 1) */}
          {activeSurahNumber !== 9 && activeSurahNumber !== 1 && (
            <div className="pt-4 pb-2">
              <div className="inline-block py-2 px-6 rounded-2xl bg-emerald-950/60 border border-amber-500/20 text-amber-200 font-arabic text-2xl sm:text-3xl">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoadingSurah && (
        <div className="space-y-4 py-8">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 animate-pulse space-y-4"
            >
              <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded w-3/4 ml-auto" />
              <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-full" />
              <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Ayahs List with Real-Time Audio Synchronization */}
      {!isLoadingSurah && activeSurahDetail && (
        <div className="space-y-4">
          {activeSurahDetail.ayahs.map((ayah) => {
            const isBookmarkedAyah = isBookmarked(activeSurahNumber, ayah.numberInSurah);
            const isCurrentAyahActive = activeAyahNumber === ayah.numberInSurah;

            return (
              <div
                key={ayah.number}
                ref={(el) => {
                  ayahRefs.current[ayah.numberInSurah] = el;
                }}
                onClick={() => handleAyahClick(ayah)}
                className={`rounded-2xl p-5 sm:p-6 border transition-all cursor-pointer ${
                  isCurrentAyahActive
                    ? 'active-ayah-sync border-amber-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-amber-500/40 shadow-lg'
                    : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/40'
                }`}
              >
                {/* Ayah Top Meta & Actions Bar */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100 dark:border-stone-800/80 text-xs">
                  {/* Ayah Number Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs border shadow-2xs transition-colors ${
                        isCurrentAyahActive
                          ? 'bg-amber-500 text-stone-950 border-amber-600'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {ayah.numberInSurah}
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">
                      {activeSurahNumber}:{ayah.numberInSurah}
                    </span>
                    {isCurrentAyahActive && isCurrentSurahPlaying && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[10px] flex items-center gap-1 border border-amber-500/40">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{loc('Oʻqilmoqda', 'Ўқилмоқда')}</span>
                      </span>
                    )}
                    {ayah.sajda && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold text-[10px]">
                        {loc('Sajda oyati', 'Сажда ояти')}
                      </span>
                    )}
                  </div>

                  {/* Ayah Quick Actions */}
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Play single ayah audio */}
                    <button
                      onClick={() => handlePlayAyahAudio(ayah)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                      title={loc('Shu oyatdan tinglash', 'Шу оятдан тинглаш')}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Bookmark single ayah */}
                    <button
                      onClick={() =>
                        toggleBookmark({
                          type: 'ayah',
                          surahNumber: activeSurahNumber,
                          ayahNumberInSurah: ayah.numberInSurah,
                          arabicSnippet: ayah.arabic.slice(0, 50) + '...',
                          uzbekSnippetCyrillic: ayah.uzbekCyrillic.slice(0, 60) + '...',
                        })
                      }
                      className={`p-1.5 rounded-lg transition ${
                        isBookmarkedAyah
                          ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                      title="Xatchoʻpga saqlash"
                    >
                      {isBookmarkedAyah ? (
                        <BookmarkCheck className="w-4 h-4 fill-current" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    {/* Copy ayah */}
                    <button
                      onClick={() => handleCopyAyah(ayah)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                      title="Nusxalash"
                    >
                      {copiedAyahNumber === ayah.numberInSurah ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Arabic Text with Tajwid spacing and RTL display */}
                <div
                  dir="rtl"
                  className="font-arabic text-stone-900 dark:text-stone-100 leading-loose text-right tracking-wide select-text py-2"
                  style={{ fontSize: `${arabicFontSize}px` }}
                >
                  {ayah.arabic}
                </div>

                {/* Uzbek Meaning Translation */}
                {showTranslation && (
                  <div className="pt-3 mt-3 border-t border-stone-100 dark:border-stone-800/60 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400 mr-1.5">
                      {ayah.numberInSurah}.
                    </span>
                    {loc(ayah.uzbekLatin, ayah.uzbekCyrillic)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Surah Navigation Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-stone-200 dark:border-stone-800">
        <button
          onClick={handlePrevSurah}
          disabled={activeSurahNumber <= 1}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 dark:hover:bg-stone-800 transition shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{loc('Oldingi sura', 'Олдинги сура')}</span>
        </button>

        <span className="text-xs text-stone-400 font-mono">
          {activeSurahNumber} / 114
        </span>

        <button
          onClick={handleNextSurah}
          disabled={activeSurahNumber >= 114}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 dark:hover:bg-stone-800 transition shadow-2xs"
        >
          <span>{loc('Keyingi sura', 'Кейинги сура')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Surah Drawer Modal */}
      {showSurahDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base">
                {loc('Surani tanlang (114 sura)', 'Сурани танланг (114 сура)')}
              </h3>
              <button
                onClick={() => setShowSurahDrawer(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                {loc('Yopish', 'Ёпиш')}
              </button>
            </div>

            <input
              type="text"
              value={drawerSearch}
              onChange={(e) => setDrawerSearch(e.target.value)}
              placeholder={loc('Sura nomi yoki raqami...', 'Сура номи ёки рақами...')}
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />

            <div className="overflow-y-auto flex-1 space-y-1.5 pr-1 divide-y divide-stone-100 dark:divide-stone-800/40">
              {filteredSurahsList.map((s) => (
                <button
                  key={s.number}
                  onClick={() => {
                    openSurah(s.number);
                    setShowSurahDrawer(false);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-left transition ${
                    s.number === activeSurahNumber
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xs font-mono font-bold text-stone-500">
                      {s.number}
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">
                        {loc(s.uzbekLatin, s.uzbekCyrillic)}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {s.revelationType} · {s.ayahCount} oyat
                      </div>
                    </div>
                  </div>
                  <span className="font-arabic text-base text-emerald-700 dark:text-emerald-400">
                    {s.arabicName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
