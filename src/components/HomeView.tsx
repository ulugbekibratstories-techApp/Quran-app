import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Headphones,
  Sparkles,
  ArrowRight,
  Play,
  Share2,
  CheckCircle2,
  Smartphone,
  Send,
  Youtube,
  Clock,
  Compass,
  Heart,
  Brain,
  Calendar,
  Layers,
  ChevronRight,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CANONICAL_SURAH_CATALOG } from '../shared/surahCatalog';
import { AudioTrackRecord } from '../shared/types';
import { YASSER_DOSARI_AUDIO_COLLECTION } from '../data/yasserDosariData';
import { getTodayAyah, getTodayDua, UZBEKISTAN_PRAYER_TIMES } from '../data/islamicData';

export const HomeView: React.FC = () => {
  const {
    surahs,
    openSurah,
    playTrack,
    setView,
    readingProgress,
    currentTrack,
    isPlaying,
    togglePlay,
    pauseTrack,
    loc,
    script,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const todayAyah = useMemo(() => getTodayAyah(currentDateStr), [currentDateStr]);
  const todayDua = useMemo(() => getTodayDua(currentDateStr), [currentDateStr]);

  // Daily featured surah based on day of year
  const todaySurah = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const surahIdx = (dayOfYear % 114) + 1;
    return surahs.find((s) => s.number === surahIdx) || surahs[0];
  }, [surahs]);

  // Search filter
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return surahs
      .filter(
        (s) =>
          s.number.toString() === q ||
          s.uzbekLatin.toLowerCase().includes(q) ||
          s.uzbekCyrillic.toLowerCase().includes(q) ||
          s.meaningLatin.toLowerCase().includes(q) ||
          s.meaningCyrillic.toLowerCase().includes(q) ||
          s.arabicName.includes(q)
      )
      .slice(0, 8);
  }, [searchQuery, surahs]);

  // Popular surahs
  const popularSurahNumbers = [1, 36, 67, 18, 56, 55, 112, 2];
  const popularSurahs = surahs.filter((s) => popularSurahNumbers.includes(s.number));

  // Tashkent prayer times preview
  const toshkentTimes = UZBEKISTAN_PRAYER_TIMES.Toshkent;

  const handlePlaySurahAudio = (surahNumber: number) => {
    if (currentTrack?.surahNumber === surahNumber && isPlaying) {
      pauseTrack();
      return;
    }
    const surah = surahs.find((s) => s.number === surahNumber);
    if (!surah) return;
    const pad = String(surahNumber).padStart(3, '0');
    const track: AudioTrackRecord = {
      id: `mishary_alafasy_${surahNumber}`,
      reciterId: 'mishary_alafasy',
      surahNumber: surah.number,
      arabicSurahName: surah.arabicName,
      uzbekSurahLatin: surah.uzbekLatin,
      uzbekSurahCyrillic: surah.uzbekCyrillic,
      titleLatin: `${surah.number}. ${surah.uzbekLatin} surasi`,
      titleCyrillic: `${surah.number}. ${surah.uzbekCyrillic} сураси`,
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-in fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none bg-repeat"
          style={{
            backgroundImage: `radial-gradient(#f59e0b 1px, transparent 1px), radial-gradient(#10b981 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/70 border border-amber-500/30 text-amber-300 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-arabic text-sm">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {loc(
              'Muqaddas Qurʼoni Karim mutolaasi va tasdiqlangan tilovatlar',
              'Муқаддас Қуръони Карим мутолааси ва тасдиқланган тиловатлар'
            )}
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            {loc(
              'Asl Usmoniy yozuvidagi 114 ta sura, Shayx Muhammad Sodiq Muhammad Yusuf hazratlarining moʻtabar oʻzbekcha tarjimasi, 13 nafar buyuk qori tilovatlari, namoz vaqtlari va maʼnaviy vositalar.',
              'Асл Усмоний ёзувидаги 114 та сура, Шайх Муҳаммад Содиқ Муҳаммад Юсуф ҳазратларининг мўътабар ўзбекча таржимаси, 13 нафар буюк қори тиловатлари, намоз вақтлари ва маънавий воситалар.'
            )}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-emerald-900/60 backdrop-blur-xs border border-emerald-700/50 rounded-xl p-3">
              <div className="text-xl font-extrabold text-amber-400">114</div>
              <div className="text-xs text-emerald-200">{loc('Toʻliq sura', 'Тўлиқ сура')}</div>
            </div>
            <div className="bg-emerald-900/60 backdrop-blur-xs border border-emerald-700/50 rounded-xl p-3">
              <div className="text-xl font-extrabold text-amber-400">6 236</div>
              <div className="text-xs text-emerald-200">{loc('Tasdiqlangan oyat', 'Тасдиқланган оят')}</div>
            </div>
            <div className="bg-emerald-900/60 backdrop-blur-xs border border-emerald-700/50 rounded-xl p-3">
              <div className="text-xl font-extrabold text-amber-400">30 Juz</div>
              <div className="text-xs text-emerald-200">{loc('Usmoniy tartib', 'Усмоний тартиб')}</div>
            </div>
            <div className="bg-emerald-900/60 backdrop-blur-xs border border-emerald-700/50 rounded-xl p-3">
              <div className="text-xl font-extrabold text-emerald-300">100%</div>
              <div className="text-xs text-emerald-200">{loc('Oflayn yuklab olish', 'Офлайн юклаб олиш')}</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => openSurah(1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>{loc('Fotiha surasini oʻqish', 'Фотиҳа сурасини ўқиш')}</span>
            </button>
            <button
              onClick={() => setView('audio')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold text-sm border border-emerald-700 transition active:scale-95"
            >
              <Headphones className="w-4 h-4" />
              <span>{loc('114 sura audiolari', '114 сура аудиолари')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Fast Search Section */}
      <section className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={loc(
              'Sura nomi yoki raqami bilan qidiring (masalan: Yosin, 36, Baqara, Ixlos)...',
              'Сура номи ёки рақами билан қидиринг (масалан: Ёсин, 36, Бақара, Ихлос)...'
            )}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-stone-900 dark:text-stone-100 placeholder-stone-400 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm transition"
          />
        </div>

        {/* Live Search Results Dropdown */}
        {filteredSurahs.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl z-20 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800 animate-in fade-in">
            {filteredSurahs.map((surah) => (
              <div
                key={surah.number}
                className="flex items-center justify-between p-3.5 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition group cursor-pointer"
                onClick={() => {
                  setSearchQuery('');
                  openSurah(surah.number);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                    {surah.number}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {loc(surah.uzbekLatin, surah.uzbekCyrillic)}
                    </h5>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {loc(surah.meaningLatin, surah.meaningCyrillic)} · {surah.ayahCount} {loc('oyat', 'оят')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-arabic text-lg text-emerald-800 dark:text-emerald-300">
                    {surah.arabicName}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySurahAudio(surah.number);
                    }}
                    className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 transition"
                    title="Tinglash"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* QUICK SPIRITUAL WIDGETS ROW: Namoz vaqtlari preview + Kun Oyati */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Namoz vaqtlari widget preview */}
        <div
          onClick={() => setView('prayer')}
          className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-emerald-500/50 transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {loc('Namoz vaqtlari · Toshkent', 'Намоз вақтлари · Тошкент')}
            </span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>{loc('Qibla va Tasbeh', 'Қибла ва Тасбеҳ')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 text-center py-2">
            {[
              { name: 'Bomdod', time: toshkentTimes.fajr },
              { name: 'Peshin', time: toshkentTimes.dhuhr },
              { name: 'Asr', time: toshkentTimes.asr },
              { name: 'Shom', time: toshkentTimes.maghrib },
              { name: 'Xufton', time: toshkentTimes.isha },
            ].map((p, i) => (
              <div key={i} className="bg-stone-50 dark:bg-stone-800/70 p-2 rounded-xl">
                <span className="text-[10px] text-stone-500 block">{p.name}</span>
                <span className="text-xs font-extrabold font-mono text-stone-900 dark:text-stone-100">
                  {p.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Kun Oyati widget preview */}
        <div
          onClick={() => setView('daily')}
          className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-2xl p-5 border border-emerald-800/40 shadow-xs hover:border-amber-500/50 transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {loc('Kun Oyati', 'Кун Ояти')}
            </span>
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>{loc('Poster Studio', 'Постер Студио')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <p className="font-arabic text-lg text-amber-100 text-right leading-relaxed line-clamp-1">
            {todayAyah.arabicText}
          </p>

          <p className="text-xs text-emerald-100/90 line-clamp-2 mt-2">
            «{script === 'cyr' ? todayAyah.uzbekCyrillic : todayAyah.uzbekLatin}»
          </p>

          <div className="flex items-center justify-between pt-2 text-[11px] text-emerald-300">
            <span>
              {script === 'cyr' ? todayAyah.surahCyrillic : todayAyah.surahLatin}, {todayAyah.ayahNumber}-oyat
            </span>
            <span className="text-amber-400 font-semibold">{loc('Rasmli post tayyorlash →', 'Расмли пост тайёрлаш →')}</span>
          </div>
        </div>
      </section>

      {/* SHAYKH YASSER AL-DOSARI SPOTLIGHT ROW */}
      <section className="bg-gradient-to-br from-stone-900 to-emerald-950 text-white rounded-3xl p-6 border border-emerald-800/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center font-arabic text-xl shrink-0 shadow-md">
              ياسر
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  {loc('Bosh qori', 'Бош қори')}
                </span>
                <span className="text-xs text-emerald-400">· {loc('Masjidul Harom imomi — 114 sura', 'Масжидул Ҳаром имоми — 114 сура')}</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {loc('Shayx Yosir ad-Dusari tilovatlari', 'Шайх Ёсир ад-Дусарий тиловатлари')}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setView('audio')}
            className="px-4 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto border border-emerald-600/40 transition"
          >
            <span>{loc('Barcha 114 sura', 'Барча 114 сура')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal scrollable recitations shelf */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {YASSER_DOSARI_AUDIO_COLLECTION.slice(0, 4).map((track) => (
            <div
              key={track.id}
              className="bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-700/50 rounded-2xl p-4 transition flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-arabic text-xl text-amber-300">
                  {track.arabicSurahName}
                </span>
                <span className="text-[11px] text-emerald-300 font-mono">
                  #{track.surahNumber}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white">
                  {script === 'cyr' ? track.titleCyrillic : track.titleLatin}
                </h4>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">
                  {track.sourceName}
                </p>
              </div>

              <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between">
                <button
                  onClick={() => playTrack(track)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{loc('Tinglash', 'Тинглаш')}</span>
                </button>
                <button
                  onClick={() => openSurah(track.surahNumber)}
                  className="text-xs text-emerald-300 hover:text-white"
                >
                  {loc('Mutolaa', 'Мутолаа')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR SURAHS GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
              {loc('Koʻp oʻqiladigan suralar', 'Кўп ўқиладиган суралар')}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {loc('Tezkor mutolaa va tinglash uchun tanlangan suralar', 'Тезкор мутолаа ва тинглаш учун танланган суралар')}
            </p>
          </div>
          <button
            onClick={() => setView('quran')}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>{loc('Barcha 114 sura', 'Барча 114 сура')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {popularSurahs.map((surah) => (
            <div
              key={surah.number}
              onClick={() => openSurah(surah.number)}
              className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs group-hover:scale-105 transition">
                  {surah.number}
                </span>
                <span className="font-arabic text-emerald-800 dark:text-emerald-300 text-lg">
                  {surah.arabicName}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                  {loc(surah.uzbekLatin, surah.uzbekCyrillic)}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                  {loc(surah.meaningLatin, surah.meaningCyrillic)}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400">
                <span>{surah.ayahCount} {loc('oyat', 'оят')} · {surah.revelationType}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlaySurahAudio(surah.number);
                  }}
                  className="p-1 rounded-md text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                  title="Audioni tinglash"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK ACCESS TO 99 NAMES, HIFZ, AND POSTER STUDIO */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Asmaul Husna Card */}
        <div
          onClick={() => setView('asmaulHusna')}
          className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-emerald-500/50 transition cursor-pointer flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {loc('Asmaul Husna — 99 Ism', 'Асмоул Ҳусна — 99 Исм')}
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {loc('Allohning goʻzal ismlari, arabcha matni, sharhlari va zikr hisoblagichi.', 'Аллоҳнинг гўзал исмлари, арабча матни, шарҳлари ва зикр ҳисоблагичи.')}
            </p>
          </div>
        </div>

        {/* Hifz & Tajwid Card */}
        <div
          onClick={() => setView('hifzTajwid')}
          className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-emerald-500/50 transition cursor-pointer flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {loc('Hifz & Xatm Rejasi', 'Ҳифз & Хатм Режаси')}
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {loc('Oyatma-oyat yodlash, matnni yashirib oʻzini sinash va 30 juzlik xatm taqvimi.', 'Оятма-оят ёдлаш, матнни яшириб ўзини синаш ва 30 жузлик хатм тақвими.')}
            </p>
          </div>
        </div>

        {/* Poster Studio Card */}
        <div
          onClick={() => setView('daily')}
          className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-emerald-500/50 transition cursor-pointer flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {loc('Poster Studio & Duolar', 'Постер Студио & Дуолар')}
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {loc('Instagram Story va Telegram uchun oyatli nafis vizual kartalar generatori.', 'Instagram Story ва Telegram учун оятли нафис визуал карталар генератори.')}
            </p>
          </div>
        </div>
      </section>

      {/* OFFICIAL CHANNELS & ECOSYSTEM */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Telegram Audio Bot */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {loc('Telegram Audio Bot', 'Телеграм Аудио Бот')}
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              @Odiljonqori_mp3 rasmiy kanali va inline bot orqali suralarni ulashish
            </p>
            <a
              href="https://t.me/Odiljonqori_mp3"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 font-semibold mt-2 hover:underline"
            >
              <span>@Odiljonqori_mp3</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* YouTube Channel */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <Youtube className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {loc('Rasmiy YouTube kanali', 'Расмий YouTube канали')}
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Odiljon qori Ismoiljonovning video tilovatlari va maʼruzalari
            </p>
            <button
              onClick={() => setView('videos')}
              className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-semibold mt-2 hover:underline"
            >
              <span>{loc('Videolarni koʻrish', 'Видеоларни кўриш')}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Install App (PWA / APK) */}
        <div
          onClick={() => setView('downloads')}
          className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-5 border border-emerald-600/40 shadow-xs hover:border-amber-500/50 transition cursor-pointer flex items-start gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-white">
              {loc('Ilovani telefonga yuklash', 'Иловани телефонон юклаш')}
            </h4>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              {loc('Brauzerdan toʻgʻridan-toʻgʻri oʻrnating — 114 sura, 6236 oyat va audio oflayn ishlaydi.', 'Браузердан тўғридан-тўғри ўрнатинг — 114 сура, 6236 оят ва аудио офлайн ишлайди.')}
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold mt-2 group-hover:translate-x-1 transition">
              <Download className="w-3.5 h-3.5" />
              <span>{loc('Yuklab olish', 'Юклаб олиш')}</span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
