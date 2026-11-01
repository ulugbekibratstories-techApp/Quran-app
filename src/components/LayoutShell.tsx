import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  Headphones,
  Users,
  Video,
  Download,
  Bookmark,
  Settings,
  ShieldCheck,
  Sun,
  Moon,
  WifiOff,
  Compass,
  Sparkles,
  Heart,
  Brain,
  Menu,
  X,
  Clock,
} from 'lucide-react';
import { useApp, AppView } from '../context/AppContext';
import { LogoMark } from './LogoMark';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const LayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { view, setView, script, setScript, theme, setTheme, loc, offlineTracks } = useApp();
  const isOnline = useOnlineStatus();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryNavItems: { id: AppView; labelLat: string; labelCyr: string; icon: React.ElementType }[] = [
    { id: 'home', labelLat: 'Bosh sahifa', labelCyr: 'Бош саҳифа', icon: Home },
    { id: 'quran', labelLat: 'Qurʼon', labelCyr: 'Қуръон', icon: BookOpen },
    { id: 'audio', labelLat: 'Audio 114', labelCyr: 'Аудио 114', icon: Headphones },
    { id: 'prayer', labelLat: 'Namoz & Qibla', labelCyr: 'Намоз & Қибла', icon: Clock },
    { id: 'daily', labelLat: 'Maʼnaviy', labelCyr: 'Маънавий', icon: Sparkles },
    { id: 'asmaulHusna', labelLat: '99 Ism', labelCyr: '99 Исм', icon: Heart },
    { id: 'hifzTajwid', labelLat: 'Hifz & Tajvid', labelCyr: 'Ҳифз & Тажвид', icon: Brain },
    { id: 'reciters', labelLat: 'Qorilar', labelCyr: 'Қорилар', icon: Users },
    { id: 'videos', labelLat: 'Video', labelCyr: 'Видео', icon: Video },
    { id: 'downloads', labelLat: 'Yuklangan', labelCyr: 'Юкланган', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <button
            onClick={() => {
              setView('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center text-left focus:outline-hidden group"
          >
            <LogoMark size={38} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-emerald-900/10 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-300'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{loc(item.labelLat, item.labelCyr)}</span>
                  {item.id === 'downloads' && offlineTracks.length > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-600 text-white font-mono">
                      {offlineTracks.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Utility Switchers */}
          <div className="flex items-center gap-2">
            {/* Lotin / Kirill switch */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs font-semibold">
              <button
                onClick={() => setScript('lat')}
                className={`px-2 py-1 rounded-md transition ${
                  script === 'lat'
                    ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Lot
              </button>
              <button
                onClick={() => setScript('cyr')}
                className={`px-2 py-1 rounded-md transition ${
                  script === 'cyr'
                    ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Кир
              </button>
            </div>

            {/* Kun / Tun Theme switch */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition"
              title={theme === 'light' ? 'Tun rejimiga oʻtish' : 'Kun rejimiga oʻtish'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-stone-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Settings button */}
            <button
              onClick={() => setView('settings')}
              className={`p-2 rounded-lg transition border border-stone-200 dark:border-stone-700 ${
                view === 'settings'
                  ? 'bg-emerald-800 text-white'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title="Sozlamalar"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Admin entry button */}
            <button
              onClick={() => setView('admin')}
              className={`p-2 rounded-lg transition border border-stone-200 dark:border-stone-700 ${
                view === 'admin'
                  ? 'bg-emerald-800 text-white'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title="Admin boshqaruv paneli"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Offline indicator banner */}
        {!isOnline && (
          <div className="bg-amber-600 dark:bg-amber-700 text-white text-xs px-4 py-1.5 flex items-center justify-center gap-2 font-medium">
            <WifiOff className="w-3.5 h-3.5" />
            <span>
              {loc(
                'Oflayn rejim — keshdagi suralar va yuklab olingan audiolar ishlamoqda',
                'Офлайн режим — кешдаги суралар ва юклаб олинган аудиолар ишламоқда'
              )}
            </span>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-36 md:pb-24">{children}</main>

      {/* Mobile Drawer Menu (opened from "Koʻproq" in bottom bar) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end xl:hidden">
          <div className="bg-white dark:bg-stone-900 rounded-t-3xl p-6 border-t border-stone-200 dark:border-stone-800 max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-lg">
                {loc('Barcha boʻlimlar', 'Барча бўлимлар')}
              </h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'prayer', labelLat: 'Namoz va Qibla', labelCyr: 'Намоз ва Қибла', icon: Clock },
                { id: 'daily', labelLat: 'Maʼnaviy & Poster', labelCyr: 'Маънавий & Постер', icon: Sparkles },
                { id: 'asmaulHusna', labelLat: 'Asmaul Husna (99)', labelCyr: 'Асмоул Ҳусна (99)', icon: Heart },
                { id: 'hifzTajwid', labelLat: 'Hifz & Tajvid', labelCyr: 'Ҳифз & Тажвид', icon: Brain },
                { id: 'reciters', labelLat: 'Qorilar', labelCyr: 'Қорилар', icon: Users },
                { id: 'videos', labelLat: 'Video darslar', labelCyr: 'Видео дарслар', icon: Video },
                { id: 'downloads', labelLat: 'Yuklanganlar', labelCyr: 'Юкланганлар', icon: Download },
                { id: 'saved', labelLat: 'Saqlanganlar', labelCyr: 'Сақланганлар', icon: Bookmark },
                { id: 'settings', labelLat: 'Sozlamalar', labelCyr: 'Созламалар', icon: Settings },
                { id: 'admin', labelLat: 'Admin paneli', labelCyr: 'Админ панели', icon: ShieldCheck },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id as AppView);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold'
                        : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700/60 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-stone-700 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold">{loc(item.labelLat, item.labelCyr)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 shadow-lg px-2 py-1">
        <div className="flex items-center justify-around">
          {[
            { id: 'home', labelLat: 'Bosh sahifa', labelCyr: 'Асосий', icon: Home },
            { id: 'quran', labelLat: 'Qurʼon', labelCyr: 'Қуръон', icon: BookOpen },
            { id: 'audio', labelLat: 'Audio', labelCyr: 'Аудио', icon: Headphones },
            { id: 'prayer', labelLat: 'Namoz', labelCyr: 'Намоз', icon: Clock },
            { id: 'menu', labelLat: 'Koʻproq', labelCyr: 'Кўпроқ', icon: Menu },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = item.id === 'menu' ? mobileMenuOpen : view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'menu') {
                    setMobileMenuOpen(!mobileMenuOpen);
                  } else {
                    setView(item.id as AppView);
                    setMobileMenuOpen(false);
                  }
                }}
                className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] mt-0.5">{loc(item.labelLat, item.labelCyr)}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
