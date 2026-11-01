import React, { useState, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  Share2,
  Download,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Calendar,
  X,
  Palette,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getTodayAyah,
  getTodayDua,
  getTodayHadith,
} from '../data/islamicData';

export const DailySpiritualView: React.FC = () => {
  const { openSurah, toggleBookmark, isBookmarked, loc, playTrack } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAyah = getTodayAyah(todayStr);
  const todayDua = getTodayDua(todayStr);
  const todayHadith = getTodayHadith(todayStr);

  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [posterModalContent, setPosterModalContent] = useState<{
    title: string;
    arabic: string;
    uzbek: string;
    reference: string;
  } | null>(null);
  const [posterFormat, setPosterFormat] = useState<'story' | 'post' | 'square'>('square');

  const posterCanvasRef = useRef<HTMLDivElement | null>(null);

  const handleCopyText = (type: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handlePlayAyahAudio = (audioUrl?: string) => {
    if (todayAyah) {
      playTrack({
        id: `daily_ayah_${todayAyah.surahNumber}_${todayAyah.ayahNumber}`,
        reciterId: 'mishary_alafasy',
        surahNumber: todayAyah.surahNumber,
        arabicSurahName: todayAyah.surahArabic,
        uzbekSurahLatin: todayAyah.surahLatin,
        uzbekSurahCyrillic: todayAyah.surahCyrillic,
        titleLatin: `${todayAyah.surahLatin} ${todayAyah.ayahNumber}-oyat`,
        titleCyrillic: `${todayAyah.surahCyrillic} ${todayAyah.ayahNumber}-оят`,
        audioUrl:
          audioUrl ||
          todayAyah.audioUrl ||
          `https://everyayah.com/data/Alafasy_128kbps/${String(todayAyah.surahNumber).padStart(3, '0')}${String(todayAyah.ayahNumber).padStart(3, '0')}.mp3`,
        sourceName: 'EveryAyah Hafs',
        sourceChannelOrUrl: 'https://everyayah.com',
        format: 'mp3',
        rightsStatus: 'VERIFIED_AUTHORIZED',
        availabilityStatus: 'AVAILABLE',
        status: 'APPROVED',
        category: 'Tilovat',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const isAyahBookmarked = isBookmarked(todayAyah.surahNumber, todayAyah.ayahNumber);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 animate-in fade-in">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/40 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>{todayStr} · {loc('Har kungi maʼnaviy ulush', 'Ҳар кунги маънавий улуш')}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {loc('Kun oyati, duosi va hadisi', 'Кун ояти, дуоси ва ҳадиси')}
        </h1>

        <p className="text-xs sm:text-sm text-emerald-200 max-w-xl">
          {loc(
            'Har kuni avtomatik yangilanuvchi, tasdiqlangan va manbasi aniq boʻlgan Qurʼon oyati, maʼsur duo va sahih hadislar toʻplami.',
            'Ҳар куни автоматик янгиланувчи, тасдиқланган ва манбаси аниқ бўлган Қуръон ояти, маъсур дуо ва саҳиҳ ҳадислар тўплами.'
          )}
        </p>
      </div>

      {/* 1. KUN OYATI CARD (Large Editorial Design) */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-500/30 shadow-xl relative overflow-hidden space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-xs shadow-sm">
              ✨
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
              {loc('Kun oyati', 'Кун ояти')}
            </span>
          </div>

          <span className="text-xs text-emerald-300 font-medium">
            {todayAyah.surahLatin} surasi, {todayAyah.ayahNumber}-oyat
          </span>
        </div>

        {/* Big Arabic Verse Text */}
        <div
          dir="rtl"
          className="font-arabic text-2xl sm:text-4xl text-amber-200 leading-[2.2] text-right font-normal select-text"
        >
          {todayAyah.arabicText}
          <span className="inline-flex items-center justify-center mx-2 text-amber-400 text-xl align-middle">
            ۝{todayAyah.ayahNumber}
          </span>
        </div>

        {/* Uzbek Translation */}
        <div className="pt-2 text-stone-200 text-sm sm:text-base leading-relaxed border-t border-emerald-800/60">
          <p>{loc(todayAyah.uzbekLatin, todayAyah.uzbekCyrillic)}</p>
          <span className="text-[11px] text-emerald-400/80 block mt-1.5">
            Tarjima: {todayAyah.translationSource}
          </span>
        </div>

        {/* Ayah Actions */}
        <div className="pt-3 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {todayAyah.audioUrl && (
              <button
                onClick={() => handlePlayAyahAudio(todayAyah.audioUrl)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{loc('Tinglash', 'Тинглаш')}</span>
              </button>
            )}

            <button
              onClick={() => openSurah(todayAyah.surahNumber, todayAyah.ayahNumber)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold transition border border-emerald-700"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{loc('Mushafda ochish', 'Мусҳaфда очиш')}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                setPosterModalContent({
                  title: 'KUN OYATI',
                  arabic: todayAyah.arabicText,
                  uzbek: loc(todayAyah.uzbekLatin, todayAyah.uzbekCyrillic),
                  reference: `${todayAyah.surahLatin} surasi, ${todayAyah.ayahNumber}-oyat`,
                })
              }
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-semibold transition"
              title="Rasm qilib ulashish"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{loc('Rasm tayyorlash', 'Расм тайёрлаш')}</span>
            </button>

            <button
              onClick={() =>
                toggleBookmark({
                  type: 'ayah',
                  surahNumber: todayAyah.surahNumber,
                  ayahNumberInSurah: todayAyah.ayahNumber,
                  arabicSnippet: todayAyah.arabicText.slice(0, 50) + '...',
                  uzbekSnippetCyrillic: todayAyah.uzbekCyrillic.slice(0, 60) + '...',
                })
              }
              className={`p-2 rounded-xl transition ${
                isAyahBookmarked
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-emerald-800 text-white hover:bg-emerald-700'
              }`}
              title="Xatchoʻpga olish"
            >
              {isAyahBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            </button>

            <button
              onClick={() =>
                handleCopyText(
                  'ayah',
                  `${todayAyah.arabicText}\n\n${loc(todayAyah.uzbekLatin, todayAyah.uzbekCyrillic)}\n[${todayAyah.surahLatin} surasi, ${todayAyah.ayahNumber}-oyat]`
                )
              }
              className="p-2 rounded-xl bg-emerald-800 text-white hover:bg-emerald-700 transition"
              title="Nusxalash"
            >
              {copiedType === 'ayah' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </section>

      {/* 2. KUN DUOSI & KUN HADISI GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KUN DUOSI CARD */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {loc('Kun duosi', 'Кун дуоси')}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold">
                {todayDua.category}
              </span>
            </div>

            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {loc(todayDua.titleLatin, todayDua.titleCyrillic)}
            </h3>

            {/* Arabic Dua */}
            <div dir="rtl" className="font-arabic text-xl text-emerald-950 dark:text-amber-300 leading-relaxed text-right py-1">
              {todayDua.arabicText}
            </div>

            {/* Transliteration */}
            <p className="text-xs italic text-stone-500 dark:text-stone-400 font-sans">
              &quot;{todayDua.transliterationLatin}&quot;
            </p>

            {/* Meaning */}
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {loc(todayDua.uzbekLatin, todayDua.uzbekCyrillic)}
            </p>

            <div className="text-[11px] text-stone-400 pt-1">
              {loc('Manba:', 'Манба:')} {todayDua.sourceReference} · {todayDua.authenticityGrade}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
            <button
              onClick={() =>
                setPosterModalContent({
                  title: 'KUN DUOSI',
                  arabic: todayDua.arabicText,
                  uzbek: loc(todayDua.uzbekLatin, todayDua.uzbekCyrillic),
                  reference: todayDua.sourceReference,
                })
              }
              className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{loc('Rasm qilish', 'Расм қилиш')}</span>
            </button>

            <button
              onClick={() =>
                handleCopyText(
                  'dua',
                  `${todayDua.arabicText}\n\n${loc(todayDua.uzbekLatin, todayDua.uzbekCyrillic)}\n[${todayDua.sourceReference}]`
                )
              }
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
              title="Nusxalash"
            >
              {copiedType === 'dua' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* KUN HADISI CARD */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {loc('Kun hadisi', 'Кун ҳадиси')}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-semibold">
                {todayHadith.collection}
              </span>
            </div>

            {/* Arabic Hadith */}
            <div dir="rtl" className="font-arabic text-xl text-stone-900 dark:text-stone-100 leading-relaxed text-right py-1">
              {todayHadith.arabicText}
            </div>

            {/* Uzbek Meaning */}
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {loc(todayHadith.uzbekLatin, todayHadith.uzbekCyrillic)}
            </p>

            <div className="text-[11px] text-stone-400 pt-1 space-y-0.5">
              <div>{todayHadith.narratorLatin}</div>
              <div className="font-semibold text-emerald-700 dark:text-emerald-400">
                {todayHadith.collection}, {todayHadith.hadithNumber} ({todayHadith.authenticityGrade})
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
            <button
              onClick={() =>
                setPosterModalContent({
                  title: 'KUN HADISI',
                  arabic: todayHadith.arabicText,
                  uzbek: loc(todayHadith.uzbekLatin, todayHadith.uzbekCyrillic),
                  reference: `${todayHadith.collection}, ${todayHadith.hadithNumber}`,
                })
              }
              className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold hover:underline"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{loc('Rasm qilish', 'Расм қилиш')}</span>
            </button>

            <button
              onClick={() =>
                handleCopyText(
                  'hadith',
                  `${todayHadith.arabicText}\n\n${loc(todayHadith.uzbekLatin, todayHadith.uzbekCyrillic)}\n[${todayHadith.collection}, ${todayHadith.hadithNumber}]`
                )
              }
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
              title="Nusxalash"
            >
              {copiedType === 'hadith' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </section>

      {/* 3. POSTER STUDIO MODAL (Shareable Card Generator) */}
      {posterModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative space-y-5 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                  {loc('Poster Studio — Ulashish uchun rasm', 'Poster Studio — Улашиш учун расм')}
                </h3>
              </div>
              <button
                onClick={() => setPosterModalContent(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold">
              <button
                onClick={() => setPosterFormat('square')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  posterFormat === 'square'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                }`}
              >
                Kvadrat (1:1)
              </button>
              <button
                onClick={() => setPosterFormat('post')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  posterFormat === 'post'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                }`}
              >
                Instagram Post (4:5)
              </button>
              <button
                onClick={() => setPosterFormat('story')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  posterFormat === 'story'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                }`}
              >
                Story (9:16)
              </button>
            </div>

            {/* Real Rendered High-Resolution Visual Card Container */}
            <div
              ref={posterCanvasRef}
              className={`w-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 border-amber-500/40 shadow-2xl relative overflow-hidden mx-auto transition-all ${
                posterFormat === 'story'
                  ? 'aspect-[9/16] max-h-[520px]'
                  : posterFormat === 'post'
                  ? 'aspect-[4/5] max-h-[460px]'
                  : 'aspect-square max-h-[400px]'
              }`}
            >
              {/* Islamic geometric pattern backdrop */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#fbbf24 1.5px, transparent 1.5px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                  {posterModalContent.title}
                </span>
                <span className="text-xs font-bold text-emerald-300 font-sans tracking-tight">
                  QUR’ON APP
                </span>
              </div>

              {/* Center Arabic & Uzbek Content */}
              <div className="relative z-10 my-auto space-y-4 text-center">
                <div
                  dir="rtl"
                  className="font-arabic text-xl sm:text-2xl text-amber-200 leading-[2.1] font-normal"
                >
                  {posterModalContent.arabic}
                </div>

                <div className="text-xs sm:text-sm text-stone-100 font-sans leading-relaxed px-2">
                  {posterModalContent.uzbek}
                </div>
              </div>

              {/* Card Footer */}
              <div className="relative z-10 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-[11px] text-emerald-300/90 font-medium">
                <span>{posterModalContent.reference}</span>
                <span>{todayStr}</span>
              </div>
            </div>

            {/* Actions: Download & Native Share */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: `QUR’ON APP — ${posterModalContent.title}`,
                        text: `${posterModalContent.arabic}\n\n${posterModalContent.uzbek}\n[${posterModalContent.reference}]\n\nQUR’ON APP orqali ulashildi.`,
                      })
                      .catch(console.error);
                  } else {
                    handleCopyText(
                      'modal',
                      `${posterModalContent.arabic}\n\n${posterModalContent.uzbek}\n[${posterModalContent.reference}]`
                    );
                  }
                }}
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Share2 className="w-4 h-4" />
                <span>{loc('Ijtimoiy tarmoqqa ulashish', 'Ижтимоий тармоққа улашиш')}</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="p-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 rounded-xl transition"
                title="Chop etish / PDF saqlash"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
