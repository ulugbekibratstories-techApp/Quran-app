import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Brain,
  Award,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  Calendar,
  Layers,
  Smile,
  Volume2,
  ChevronRight,
  Flame,
  Star,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TAJWID_LESSONS } from '../data/islamicData';
import { CANONICAL_SURAH_CATALOG } from '../shared/surahCatalog';
import { TajwidLessonItem } from '../shared/types';
import { getSurahDetail } from '../services/quranData';

type MainTab = 'hifz' | 'khatm' | 'tajwid' | 'kids';

export const HifzAndTajwidView: React.FC = () => {
  const { loc, script, openSurah, playTrack } = useApp();
  const [activeTab, setActiveTab] = useState<MainTab>('hifz');

  // --- HIFZ STATE ---
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(1);
  const [startAyah, setStartAyah] = useState<number>(1);
  const [endAyah, setEndAyah] = useState<number>(7);
  const [isAyahTextHidden, setIsAyahTextHidden] = useState<boolean>(false);
  const [repetitionCount, setRepetitionCount] = useState<number>(3);
  const [currentRepetition, setCurrentRepetition] = useState<number>(1);
  const [isLoopPlaying, setIsLoopPlaying] = useState<boolean>(false);

  // Memorization statuses per surah:ayah
  const [hifzProgress, setHifzProgress] = useState<Record<string, 'memorized' | 'learning' | 'review'>>(() => {
    try {
      const saved = localStorage.getItem('quron_hifz_progress');
      return saved ? JSON.parse(saved) : { '1:1': 'memorized', '1:2': 'memorized', '1:3': 'memorized', '112:1': 'memorized' };
    } catch {
      return {};
    }
  });

  const setAyahHifzStatus = (surah: number, ayah: number, status: 'memorized' | 'learning' | 'review') => {
    const key = `${surah}:${ayah}`;
    const next = { ...hifzProgress, [key]: status };
    setHifzProgress(next);
    localStorage.setItem('quron_hifz_progress', JSON.stringify(next));
  };

  // Selected Surah Metadata
  const currentSurah = useMemo(() => {
    return CANONICAL_SURAH_CATALOG.find((s) => s.number === selectedSurahNum) || CANONICAL_SURAH_CATALOG[0];
  }, [selectedSurahNum]);

  // Adjust ayah range bounds when surah changes
  useEffect(() => {
    setStartAyah(1);
    setEndAyah(Math.min(currentSurah.ayahCount, 7));
  }, [selectedSurahNum, currentSurah]);

  // --- KHATM STATE ---
  const [khatmPlanDays, setKhatmPlanDays] = useState<30 | 15 | 7>(30);
  const [completedJuzs, setCompletedJuzs] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('quron_completed_juzs');
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  const toggleJuzComplete = (juzNum: number) => {
    setCompletedJuzs((prev) => {
      const next = prev.includes(juzNum) ? prev.filter((j) => j !== juzNum) : [...prev, juzNum];
      localStorage.setItem('quron_completed_juzs', JSON.stringify(next));
      return next;
    });
  };

  // --- AYAH TEXT CACHE ---
  const [ayahTexts, setAyahTexts] = useState<Record<number, string[]>>({});

  useEffect(() => {
    const detail = getSurahDetail(selectedSurahNum);
    if (detail && detail.ayahs) {
      setAyahTexts((prev) => ({
        ...prev,
        [selectedSurahNum]: detail.ayahs.map((a) => a.arabic || ''),
      }));
    }
  }, [selectedSurahNum]);

  // --- TAJWID STATE ---
  const [selectedLesson, setSelectedLesson] = useState<TajwidLessonItem>(TAJWID_LESSONS[0]);

  // --- KIDS MODE STATE ---
  const kidsShortSurahs = [1, 114, 113, 112, 110, 108, 107, 106, 105, 103];
  const [kidStars, setKidStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kids_quran_stars');
      return saved ? parseInt(saved, 10) : 12;
    } catch {
      return 12;
    }
  });

  const addKidStar = () => {
    const next = kidStars + 1;
    setKidStars(next);
    localStorage.setItem('kids_quran_stars', next.toString());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-10 border border-emerald-800/40 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/70 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{loc('Qurʼon taʼlimi va maʼnaviy rivojlanish', 'Қуръон таълими ва маънавий ривожланиш')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {loc('Hifz, Xatm va Tajvid Markazi', 'Ҳифз, Хатм ва Тажвид Маркази')}
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            {loc(
              'Qurʼoni Karimni bosqichma-bosqich yod olish, xatm rejasiga muvofiq mutolaa qilish, tajvid qoidalarini mustahkamlash hamda bolalar uchun qulay dasturiy muhit.',
              'Қуръони Каримни босқичма-босқич ёд олиш, хатм режасига мувофиқ мутолаа қилиш, тажвид қоидаларини мустаҳкамлаш ҳамда болалар учун қулай дастурий муҳит.'
            )}
          </p>

          {/* Tab Navigation Pill Bar */}
          <div className="flex flex-wrap gap-2 pt-3">
            {[
              { id: 'hifz', labelLat: 'Hifz (Yodlash)', labelCyr: 'Ҳифз (Ёдлаш)', icon: Brain },
              { id: 'khatm', labelLat: 'Xatm rejasi', labelCyr: 'Хатм режаси', icon: Calendar },
              { id: 'tajwid', labelLat: 'Tajvid qoidalari', labelCyr: 'Тажвид қоидалари', icon: Award },
              { id: 'kids', labelLat: 'Bolalar rejimi', labelCyr: 'Болалар режими', icon: Smile },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as MainTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300/60'
                      : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{loc(tab.labelLat, tab.labelCyr)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===================== TAB 1: HIFZ YODLASH ===================== */}
      {activeTab === 'hifz' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h2 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Brain className="w-5 h-5 text-emerald-600" />
                <span>{loc('Yodlash sozlamalari', 'Ёдлаш созламалари')}</span>
              </h2>

              {/* Surah select */}
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                  {loc('Surani tanlang', 'Сурани танланг')}
                </label>
                <select
                  value={selectedSurahNum}
                  onChange={(e) => setSelectedSurahNum(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-semibold"
                >
                  {CANONICAL_SURAH_CATALOG.map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {script === 'cyr' ? s.uzbekCyrillic : s.uzbekLatin} ({s.ayahCount} {loc('oyat', 'оят')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Ayah Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                    {loc('Boshlangʻich oyat', 'Бошланғич оят')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={currentSurah.ayahCount}
                    value={startAyah}
                    onChange={(e) => setStartAyah(Math.max(1, Math.min(currentSurah.ayahCount, Number(e.target.value))))}
                    className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                    {loc('Yakuniy oyat', 'Якуний оят')}
                  </label>
                  <input
                    type="number"
                    min={startAyah}
                    max={currentSurah.ayahCount}
                    value={endAyah}
                    onChange={(e) => setEndAyah(Math.max(startAyah, Math.min(currentSurah.ayahCount, Number(e.target.value))))}
                    className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-center font-bold"
                  />
                </div>
              </div>

              {/* Repetition target */}
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1.5">
                  {loc('Takrorlash soni (har bir oyat uchun)', 'Такрорлаш сони (ҳар бир оят учун)')}
                </label>
                <div className="flex gap-2">
                  {[1, 3, 5, 10, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setRepetitionCount(num)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        repetitionCount === num
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {num}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Hide / Show Text for Self-Testing */}
              <div className="pt-2">
                <button
                  onClick={() => setIsAyahTextHidden(!isAyahTextHidden)}
                  className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                    isAyahTextHidden
                      ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {isAyahTextHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>
                    {isAyahTextHidden
                      ? loc('Matnni koʻrsatish', 'Матнни кўрсатиш')
                      : loc('Oʻzingizni sinash (matnni yashirish)', 'Ўзингизни синаш (матнни яшириш)')}
                  </span>
                </button>
              </div>

              {/* Go to full reader button */}
              <button
                onClick={() => openSurah(selectedSurahNum, startAyah)}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>{loc('Toʻliq sura mutolaasiga oʻtish', 'Тўлиқ сура мутолаасига ўтиш')}</span>
              </button>
            </div>

            {/* Ayahs Memorization Workspace */}
            <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-lg">
                    {currentSurah.number}. {script === 'cyr' ? currentSurah.uzbekCyrillic : currentSurah.uzbekLatin}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {loc('Tanlangan oraliq', 'Танланган оралиқ')}: {startAyah}-{endAyah} {loc('oyatlar', 'оятлар')}
                  </p>
                </div>
                <span className="font-arabic text-2xl text-emerald-800 dark:text-emerald-300">
                  {currentSurah.arabicName}
                </span>
              </div>

              {/* Ayahs list in range */}
              <div className="space-y-4">
                {Array.from({ length: endAyah - startAyah + 1 }, (_, i) => startAyah + i).map((ayahNum) => {
                  const key = `${selectedSurahNum}:${ayahNum}`;
                  const status = hifzProgress[key];

                  return (
                    <div
                      key={ayahNum}
                      className="p-4 rounded-xl border border-stone-100 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-800/40 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold font-mono">
                          {loc('Oyat', 'Оят')} {ayahNum}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setAyahHifzStatus(selectedSurahNum, ayahNum, 'memorized')}
                            className={`px-2 py-1 rounded-md text-xs font-semibold transition ${
                              status === 'memorized'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                            }`}
                          >
                            ✓ {loc('Yodlandi', 'Ёдланди')}
                          </button>
                          <button
                            onClick={() => setAyahHifzStatus(selectedSurahNum, ayahNum, 'learning')}
                            className={`px-2 py-1 rounded-md text-xs font-semibold transition ${
                              status === 'learning'
                                ? 'bg-amber-600 text-white'
                                : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                            }`}
                          >
                            … {loc('Oʻrganilyapti', 'Ўрганиляпти')}
                          </button>
                        </div>
                      </div>

                      {/* Ayah Content */}
                      {isAyahTextHidden ? (
                        <div className="py-6 text-center bg-stone-200/50 dark:bg-stone-800/60 rounded-lg text-stone-400 text-xs italic">
                          {loc(
                            'Matn yashirilgan — yoddan oʻqing va «Koʻrsatish» tugmasi orqali tekshiring',
                            'Матн яширилган — ёддан ўқинг ва «Кўрсатиш» тугмаси орқали текширинг'
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="font-arabic text-2xl text-right leading-loose text-stone-900 dark:text-stone-100">
                            {ayahTexts[selectedSurahNum]?.[ayahNum - 1] ||
                              `﴿${ayahNum}﴾`}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: KHATM REJASI ===================== */}
      {activeTab === 'khatm' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span>{loc('Qurʼoni Karim Xatm Rejasi', 'Қуръони Карим Хатм Режаси')}</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  {loc(
                    'Rejani tanlang va 30 ta juzni oʻqib borganingiz sari belgilab boring.',
                    'Режани танланг ва 30 та жузни ўқиб борганингиз сари белгилаб боринг.'
                  )}
                </p>
              </div>

              {/* Plan duration switch */}
              <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                {([30, 15, 7] as const).map((days) => (
                  <button
                    key={days}
                    onClick={() => setKhatmPlanDays(days)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      khatmPlanDays === days
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    {days} {loc('kunlik', 'кунлик')}
                  </button>
                ))}
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="bg-emerald-950 text-white p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>{loc('Xatm umumiy holati', 'Хатм умумий ҳолати')}</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {completedJuzs.length} / 30 Juz ({Math.round((completedJuzs.length / 30) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-emerald-900 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(completedJuzs.length / 30) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-emerald-200">
                {khatmPlanDays === 30 && loc('Kunlik meʼyor: har kuni 1 juz mutolaasi', 'Кунлик меъёр: ҳар куни 1 жуз мутолааси')}
                {khatmPlanDays === 15 && loc('Kunlik meʼyor: har kuni 2 juz mutolaasi', 'Кунлик меъёр: ҳар куни 2 жуз мутолааси')}
                {khatmPlanDays === 7 && loc('Kunlik meʼyor: har kuni 4-5 juz mutolaasi', 'Кунлик меъёр: ҳар куни 4-5 жуз мутолааси')}
              </p>
            </div>

            {/* 30 Juz Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 gap-3 pt-2">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => {
                const isDone = completedJuzs.includes(juzNum);
                return (
                  <button
                    key={juzNum}
                    onClick={() => toggleJuzComplete(juzNum)}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300'
                        : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700/60 text-stone-600 dark:text-stone-400 hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-xs font-bold">{juzNum}-{loc('Juz', 'Жуз')}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isDone ? 'bg-emerald-600 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-400'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5 stroke-3" /> : juzNum}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: TAJVID QOIDALARI ===================== */}
      {activeTab === 'tajwid' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lessons List */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-2">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 px-2 pb-2 text-sm border-b border-stone-100 dark:border-stone-800">
              {loc('Tajvid darslari', 'Тажвид дарслари')}
            </h3>

            {TAJWID_LESSONS.map((lesson) => {
              const isSelected = selectedLesson.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full p-3 rounded-xl text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span className="text-xs">
                    {script === 'cyr' ? lesson.titleCyrillic : lesson.titleLatin}
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              );
            })}
          </div>

          {/* Lesson Content Area */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase mb-2">
                {selectedLesson.category}
              </span>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                {script === 'cyr' ? selectedLesson.titleCyrillic : selectedLesson.titleLatin}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {script === 'cyr' ? selectedLesson.summaryCyrillic : selectedLesson.summaryLatin}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700 text-sm leading-relaxed text-stone-800 dark:text-stone-200">
              {script === 'cyr' ? selectedLesson.contentCyrillic : selectedLesson.contentLatin}
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400">
                {loc('Qurʼondan amaliy misollar', 'Қуръондан амалий мисоллар')}
              </h4>

              {selectedLesson.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/60 space-y-2"
                >
                  <p className="font-arabic text-2xl text-right text-emerald-950 dark:text-emerald-300">
                    {ex.arabic}
                  </p>
                  <div className="text-xs text-stone-600 dark:text-stone-400">
                    <span className="font-semibold text-stone-900 dark:text-stone-200">{ex.transliteration}</span> — {ex.ruleExplanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: BOLALAR UCHUN QURʼON ===================== */}
      {activeTab === 'kids' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-stone-950 p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="px-3 py-1 bg-white/30 backdrop-blur-xs rounded-full text-xs font-black uppercase">
                {loc('Qori bolajonlar boʻlimi', 'Қори болажонлар бўлими')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {loc('Kichik qorilar uchun qulay va qiziqarli!', 'Кичик қорилар учун қулай ва қизиқарли!')}
              </h2>
              <p className="text-stone-900 text-xs sm:text-sm font-medium max-w-xl">
                {loc(
                  'Qisqa suralarni oʻqing, yod oling va yulduzchalarni toʻplab, faxriy «Kichik Qori» maqomiga erishing!',
                  'Қисқа сураларни ўқинг, ёд олинг ва юлдузчаларни тўплаб, фахрий «Кичик Қори» мақомига эришинг!'
                )}
              </p>
            </div>

            {/* Stars Counter Card */}
            <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-md text-center min-w-[160px]">
              <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-1">
                <Star className="w-6 h-6 fill-current animate-bounce" />
                <span className="text-2xl font-black font-mono">{kidStars}</span>
              </div>
              <span className="text-[11px] font-bold text-stone-600 uppercase block">
                {loc('Yulduzchalar', 'Юлдузчалар')}
              </span>
              <button
                onClick={addKidStar}
                className="mt-2 text-[10px] px-2.5 py-1 bg-amber-500 text-stone-950 font-bold rounded-lg hover:bg-amber-400 transition"
              >
                +1 {loc('Yulduz olish', 'Юлдуз олиш')}
              </button>
            </div>
          </div>

          {/* Kids Short Surahs Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kidsShortSurahs.map((num) => {
              const surah = CANONICAL_SURAH_CATALOG.find((s) => s.number === num);
              if (!surah) return null;
              return (
                <div
                  key={num}
                  className="bg-white dark:bg-stone-900 border-2 border-amber-200 dark:border-amber-900/40 rounded-2xl p-5 hover:border-amber-400 transition shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        #{surah.number}
                      </span>
                      <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                        {script === 'cyr' ? surah.uzbekCyrillic : surah.uzbekLatin}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {surah.ayahCount} {loc('oyat', 'оят')}
                      </p>
                    </div>
                    <span className="font-arabic text-2xl text-amber-700 dark:text-amber-300">
                      {surah.arabicName}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
                    <button
                      onClick={() => openSurah(surah.number)}
                      className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{loc('Oʻqish', 'Ўқиш')}</span>
                    </button>
                    <button
                      onClick={() => {
                        addKidStar();
                        openSurah(surah.number);
                      }}
                      className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold hover:bg-amber-200 transition"
                      title={loc('Yodlashni boshlash', 'Ёдлашни бошлаш')}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
