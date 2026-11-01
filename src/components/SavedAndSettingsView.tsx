import React from 'react';
import {
  Bookmark,
  Trash2,
  BookOpen,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Type,
  Smartphone,
  Send,
  Database,
  Info,
  CheckCircle2,
  Bell,
  BellRing,
  Clock,
  TestTube,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CANONICAL_SURAH_CATALOG } from '../shared/surahCatalog';
import { useDailyNotifications } from '../hooks/useDailyNotifications';

export const SavedView: React.FC = () => {
  const { bookmarks, toggleBookmark, openSurah, loc } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold">
          <Bookmark className="w-3.5 h-3.5" />
          <span>{loc('Xatchoʻplar', 'Хатчўплар')}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
          {loc('Saqlangan sura va oyatlar', 'Сақланган сура ва оятлар')}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {loc(
            'Qurʼon oʻqish jarayonida belgilab qoʻygan suralaringiz va alohida oyatlaringiz.',
            'Қуръон ўқиш жараёнида белгилаб қўйган сураларингиз ва алоҳида оятларингиз.'
          )}
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 border border-stone-200 dark:border-stone-800 text-center space-y-3">
          <Bookmark className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            {loc('Hozircha saqlanganlar yoʻq', 'Ҳозирча сақланганлар йўқ')}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {loc(
              'Qurʼon oʻqish vaqtida oyat yonidagi xatchoʻp tugmasini bosib, uni bu yerga saqlashingiz mumkin.',
              'Қуръон ўқиш вақтида оят ёнидаги хатчўп тугмасини босиб, уни бу ерга сақлашингиз мумкин.'
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => {
            const surah = CANONICAL_SURAH_CATALOG[b.surahNumber - 1];
            return (
              <div
                key={b.id}
                className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 shadow-2xs hover:border-emerald-500/40 transition"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                    {b.surahNumber}
                  </span>

                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                      {b.surahNumber}. {loc(surah.uzbekLatin, surah.uzbekCyrillic)}
                      {b.ayahNumberInSurah ? ` — ${b.ayahNumberInSurah}-${loc('oyat', 'оят')}` : ''}
                    </h4>
                    <p className="text-xs text-stone-400 truncate">
                      {b.uzbekSnippetCyrillic || surah.arabicName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openSurah(b.surahNumber, b.ayahNumberInSurah)}
                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition"
                    title="Ochish"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      toggleBookmark({
                        type: b.type,
                        surahNumber: b.surahNumber,
                        ayahNumberInSurah: b.ayahNumberInSurah,
                        arabicSnippet: b.arabicSnippet,
                        uzbekSnippetCyrillic: b.uzbekSnippetCyrillic,
                      })
                    }
                    className="p-2 rounded-xl text-stone-400 hover:text-red-600 transition"
                    title="Oʻchirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const SettingsView: React.FC = () => {
  const {
    script,
    setScript,
    theme,
    setTheme,
    arabicFontSize,
    setArabicFontSize,
    loc,
  } = useApp();

  const {
    settings: notifSettings,
    toggleEnabled,
    updateTime,
    sendTestNotification,
  } = useDailyNotifications();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
        <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
          {loc('Sozlamalar va maʼlumot', 'Созламалар ва маълумот')}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {loc('Ilovaning koʻrinishi, shrift oʻlchami va ekotizim tafsilotlari.', 'Илованинг кўриниши, шрифт ўлчами ва экотизим тафсилотлари.')}
        </p>
      </div>

      {/* Daily Notifications Section */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              {notifSettings.enabled ? (
                <BellRing className="w-4 h-4 text-emerald-600" />
              ) : (
                <Bell className="w-4 h-4 text-stone-400" />
              )}
              {loc('Kunlik bildirishnomalar', 'Кунлик билдиришномалар')}
            </h4>
            <p className="text-xs text-stone-500">
              {loc('Har kuni oyat, hadis va zikr eslatmasi', 'Ҳар куни оят, ҳадис ва зикр эслатмаси')}
            </p>
          </div>
          <button
            onClick={toggleEnabled}
            className={`relative w-12 h-6 rounded-full transition shrink-0 ${
              notifSettings.enabled
                ? 'bg-emerald-600'
                : 'bg-stone-300 dark:bg-stone-700'
            }`}
            title="Bildirishnomani yoqish"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                notifSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {notifSettings.enabled && notifSettings.permission === 'granted' && (
          <div className="space-y-4">
            {([
              { key: 'ayahTime' as const, label: loc('Kun oyati vaqti', 'Кун ояти вақти'), icon: BookOpen },
              { key: 'hadithTime' as const, label: loc('Kun hadisi vaqti', 'Кун ҳадиси вақти'), icon: Info },
              { key: 'zikrTime' as const, label: loc('Kun zikri vaqti', 'Кун зикри вақти'), icon: Sparkles },
            ]).map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    {item.label}
                  </span>
                </div>
                <input
                  type="time"
                  value={notifSettings[item.key]}
                  onChange={(e) => updateTime(item.key, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-mono font-bold text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            ))}

            <button
              onClick={sendTestNotification}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900 transition border border-emerald-200/50 dark:border-emerald-800/40 w-full justify-center"
            >
              <TestTube className="w-4 h-4" />
              {loc('Sinov bildirishnomasi yuborish', 'Синов билдиришномаси юбориш')}
            </button>
          </div>
        )}

        {notifSettings.enabled && notifSettings.permission !== 'granted' && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            {loc(
              'Bildirishnoma ruxsati berilmagan. Iltimos, brauzer sozlamalarida ruxsat bering.',
              'Билдиришнома рухсати берилмаган. Илтимос, браузер созламаларида рухсат беринг.'
            )}
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
        {/* Script Selection */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {loc('Oʻzbek yozuvi', 'Ўзбек ёзуви')}
            </h4>
            <p className="text-xs text-stone-500">
              {loc('Lotin yoki kirill alifbosini tanlang', 'Лотин ёки кирилл алифбосини танланг')}
            </p>
          </div>

          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setScript('lat')}
              className={`px-3 py-1.5 rounded-lg transition ${
                script === 'lat'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              Lotin
            </button>
            <button
              onClick={() => setScript('cyr')}
              className={`px-3 py-1.5 rounded-lg transition ${
                script === 'cyr'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              Кирилл
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {loc('Mavzu rejimi', 'Мавзу режими')}
            </h4>
            <p className="text-xs text-stone-500">
              {loc('Kun yoki tun koʻrinishi', 'Кун ёки тун кўриниши')}
            </p>
          </div>

          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                theme === 'light'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{loc('Kun', 'Кун')}</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                theme === 'dark'
                  ? 'bg-stone-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span>{loc('Tun', 'Тун')}</span>
            </button>
          </div>
        </div>

        {/* Arabic Font Size Slider */}
        <div className="space-y-3 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                {loc('Arabcha matn oʻlchami', 'Арабча матн ўлчами')}
              </h4>
              <p className="text-xs text-stone-500">
                {loc('Qurʼon oyatlarining oʻqilish qulayligi uchun', 'Қуръон оятларининг ўқилиш қулайлиги учун')}
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {arabicFontSize} px
            </span>
          </div>

          <input
            type="range"
            min={20}
            max={44}
            value={arabicFontSize}
            onChange={(e) => setArabicFontSize(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />

          <div
            dir="rtl"
            className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 font-arabic text-center text-emerald-900 dark:text-emerald-200"
            style={{ fontSize: `${arabicFontSize}px` }}
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </div>
        </div>

        {/* Companion Projects Info */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            {loc('Ekotizim loyihalari', 'Экотизим лойиҳалари')}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Android ilovasi</span>
              </div>
              <p className="text-stone-500">
                Paket: <code className="font-mono text-emerald-700 dark:text-emerald-400">com.quronapp.android</code>
              </p>
              <p className="text-stone-400 text-[11px]">
                Jetpack Compose · ExoPlayer Media3 · Room Database
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                <Send className="w-4 h-4 text-sky-600" />
                <span>Telegram Audio Bot</span>
              </div>
              <p className="text-stone-500">
                Kanal: <code className="font-mono text-sky-600">@Odiljonqori_mp3</code>
              </p>
              <p className="text-stone-400 text-[11px]">
                Inline query · Webhook qabuli · Suralar ulashish
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
