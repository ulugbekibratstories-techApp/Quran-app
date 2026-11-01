import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Heart,
  Volume2,
  Share2,
  RotateCcw,
  Plus,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ASMAUL_HUSNA } from '../data/islamicData';
import { AsmaulHusnaItem } from '../shared/types';

export const AsmaulHusnaView: React.FC = () => {
  const { loc, script, setView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedName, setSelectedName] = useState<AsmaulHusnaItem | null>(ASMAUL_HUSNA[0]);
  const [favoriteNumbers, setFavoriteNumbers] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('asmaul_husna_favorites');
      return saved ? JSON.parse(saved) : [1, 2, 3];
    } catch {
      return [1, 2, 3];
    }
  });

  const [counters, setCounters] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('asmaul_husna_counters');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [copiedId, setCopiedId] = useState<number | null>(null);

  const toggleFavorite = (num: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteNumbers((prev) => {
      const next = prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num];
      localStorage.setItem('asmaul_husna_favorites', JSON.stringify(next));
      return next;
    });
  };

  const incrementCounter = (num: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCounters((prev) => {
      const next = { ...prev, [num]: (prev[num] || 0) + 1 };
      localStorage.setItem('asmaul_husna_counters', JSON.stringify(next));
      return next;
    });
  };

  const resetCounter = (num: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCounters((prev) => {
      const next = { ...prev, [num]: 0 };
      localStorage.setItem('asmaul_husna_counters', JSON.stringify(next));
      return next;
    });
  };

  const handleShare = (item: AsmaulHusnaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `${item.number}. ${item.arabic} — ${
      script === 'cyr' ? item.transliterationCyrillic : item.transliterationLatin
    }\nMaʼnosi: ${script === 'cyr' ? item.meaningCyrillic : item.meaningLatin}\nSharhi: ${
      script === 'cyr' ? item.explanationCyrillic : item.explanationLatin
    }\n\nQURʼON APP — Odiljon qori`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(item.number);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const filteredNames = useMemo(() => {
    if (!searchQuery.trim()) return ASMAUL_HUSNA;
    const q = searchQuery.toLowerCase().trim();
    return ASMAUL_HUSNA.filter(
      (item) =>
        item.number.toString() === q ||
        item.arabic.includes(q) ||
        item.transliterationLatin.toLowerCase().includes(q) ||
        item.transliterationCyrillic.toLowerCase().includes(q) ||
        item.meaningLatin.toLowerCase().includes(q) ||
        item.meaningCyrillic.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-10 border border-emerald-800/40 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/70 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{loc('Allohning 99 goʻzal ismi', 'Аллоҳнинг 99 гўзал исми')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {loc('Asmaul Husna — Goʻzal Ismlar', 'Асмоул Ҳусна — Гўзал Исмлар')}
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            {loc(
              '«Allohning goʻzal ismlari bordir. Bas, Unga oʻsha ismlar ila duo qilinglar...» (Aʼrof surasi, 180-oyat). Har bir ismning asl arabcha imlosi, talaffuzi, maʼnosi va tafakkur sharhi.',
              '«Аллоҳнинг гўзал исмлари бордир. Бас, Унга ўша исмлар ила дуо қилинглар...» (Аъроф сураси, 180-оят). Ҳар бир исмнинг асл арабча имлоси, талаффузи, маъноси ва тафаккур шарҳи.'
            )}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="bg-emerald-900/60 border border-emerald-700/50 rounded-xl px-4 py-2 text-xs flex items-center gap-2">
              <span className="font-bold text-amber-400 text-sm">99</span>
              <span className="text-emerald-200">{loc('Ismi sharif', 'Исми шариф')}</span>
            </div>
            <div className="bg-emerald-900/60 border border-emerald-700/50 rounded-xl px-4 py-2 text-xs flex items-center gap-2">
              <span className="font-bold text-amber-400 text-sm">{favoriteNumbers.length}</span>
              <span className="text-emerald-200">{loc('Tanlanganlar', 'Танланганлар')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid & Selected Detail Modal / Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Search & Names List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={loc(
                'Ism, maʼnosi yoki tartib raqami boʻyicha izlash (masalan: Rohman, Malik, 1)...',
                'Исм, маъноси ёки тартиб рақами бўйича излаш (масалан: Роҳман, Малик, 1)...'
              )}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredNames.map((item) => {
              const isSelected = selectedName?.number === item.number;
              const isFav = favoriteNumbers.includes(item.number);
              const count = counters[item.number] || 0;

              return (
                <div
                  key={item.number}
                  onClick={() => setSelectedName(item)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500 shadow-md ring-2 ring-emerald-600/20'
                      : 'bg-white dark:bg-stone-900 border-stone-200/90 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-300 font-mono">
                      {item.number}
                    </span>
                    <p className="font-arabic text-2xl text-emerald-950 dark:text-emerald-200 text-right leading-none">
                      {item.arabic}
                    </p>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                      {script === 'cyr' ? item.transliterationCyrillic : item.transliterationLatin}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1">
                      {script === 'cyr' ? item.meaningCyrillic : item.meaningLatin}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => incrementCounter(item.number, e)}
                        className="px-2 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 font-medium flex items-center gap-1"
                        title={loc('Zikr hisoblash', 'Зикр ҳисоблаш')}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{count}</span>
                      </button>
                      {count > 0 && (
                        <button
                          onClick={(e) => resetCounter(item.number, e)}
                          className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                          title={loc('Tozalash', 'Тозалаш')}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => toggleFavorite(item.number, e)}
                        className={`p-1.5 rounded-lg transition ${
                          isFav
                            ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                            : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                        title={loc('Tanlanganlarga qoʻshish', 'Танланганларга қўшиш')}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => handleShare(item, e)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                        title={loc('Ulashish', 'Улашиш')}
                      >
                        {copiedId === item.number ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Detailed Focus View */}
        <div className="space-y-4">
          {selectedName ? (
            <div className="sticky top-24 bg-white dark:bg-stone-900 border border-emerald-800/30 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="text-center space-y-3 pb-6 border-b border-stone-200 dark:border-stone-800">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold">
                  {loc('Tartib raqami', 'Тартиб рақами')}: #{selectedName.number}
                </span>

                <div className="py-2">
                  <p className="font-arabic text-5xl text-emerald-900 dark:text-emerald-300 leading-snug">
                    {selectedName.arabic}
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {script === 'cyr'
                    ? selectedName.transliterationCyrillic
                    : selectedName.transliterationLatin}
                </h2>
              </div>

              {/* Meaning & Explanation */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                    {loc('Maʼnosi', 'Маъноси')}
                  </h4>
                  <p className="text-stone-800 dark:text-stone-200 font-medium text-sm leading-relaxed">
                    {script === 'cyr' ? selectedName.meaningCyrillic : selectedName.meaningLatin}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                    {loc('Batafsil sharhi va tafakkur', 'Батафсил шарҳи ва тафаккур')}
                  </h4>
                  <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-200/60 dark:border-stone-800">
                    {script === 'cyr'
                      ? selectedName.explanationCyrillic
                      : selectedName.explanationLatin}
                  </p>
                </div>
              </div>

              {/* Interactive Zikr Button */}
              <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs text-emerald-200">
                  <span>{loc('Ushbu ism zikri hisoblagichi', 'Ушбу исм зикри ҳисоблагичи')}</span>
                  <span className="font-bold font-mono text-amber-400 text-lg">
                    {counters[selectedName.number] || 0}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => incrementCounter(selectedName.number)}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{loc('Zikr qilish (+1)', 'Зикр қилиш (+1)')}</span>
                  </button>
                  <button
                    onClick={() => resetCounter(selectedName.number)}
                    className="px-3 bg-emerald-800 hover:bg-emerald-700 rounded-xl transition text-emerald-200"
                    title={loc('Qayta boshlash', 'Қайта бошлаш')}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => toggleFavorite(selectedName.number)}
                  className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-semibold"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favoriteNumbers.includes(selectedName.number) ? 'fill-current' : ''
                    }`}
                  />
                  <span>
                    {favoriteNumbers.includes(selectedName.number)
                      ? loc('Tanlanganlarda', 'Танланганларда')
                      : loc('Tanlanganlarga qoʻshish', 'Танланганларга қўшиш')}
                  </span>
                </button>

                <button
                  onClick={() => handleShare(selectedName)}
                  className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 hover:text-emerald-600 font-semibold"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{loc('Matnni nusxalash', 'Матнни нусхалаш')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-stone-100 dark:bg-stone-900 rounded-2xl p-8 text-center text-stone-500">
              {loc('Ismlardan birini tanlang', 'Исмлардан бирини танланг')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
