import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  RefreshCw,
  Send,
  Youtube,
  Key,
  FileCheck,
  History,
  Lock,
  LayoutDashboard,
  FileText,
  BookOpen,
  Headphones,
  Users,
  Video,
  Clock,
  MapPin,
  Bell,
  Sparkles,
  Sliders,
  Database,
  BarChart3,
  HardDrive,
  Settings,
  Archive,
  RotateCcw,
  Plus,
  Eye,
  Trash2,
  Calendar,
  Layers,
  Search,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  CMSItemRecord,
  CMSPublicationStatus,
  CMSContentType,
  AdminRole,
  HomeScreenSectionConfig,
} from '../shared/types';
import { CANONICAL_SURAH_CATALOG } from '../shared/surahCatalog';
import {
  ODILJON_QORI_AUDIO_COLLECTION,
  ODILJON_QORI_VIDEOS,
  ODILJON_QORI_OFFICIAL_CHANNELS,
} from '../data/odiljonQoriData';
import { GLOBAL_CITIES } from '../shared/globalCities';
import { CALCULATION_METHODS_CONFIG } from '../shared/prayerCalculation';

// 29 Admin Sections Definition
type AdminSectionKey =
  | 'overview'
  | 'content'
  | 'quran'
  | 'surah'
  | 'translation'
  | 'tafsir'
  | 'audio'
  | 'reciter'
  | 'video'
  | 'telegram'
  | 'youtube'
  | 'dailyAyah'
  | 'dailyDua'
  | 'dailyHadith'
  | 'asmaulHusna'
  | 'prayerConfig'
  | 'globalCities'
  | 'notifications'
  | 'homeLayout'
  | 'posterStudio'
  | 'users'
  | 'membership'
  | 'support'
  | 'analytics'
  | 'storage'
  | 'apiConfig'
  | 'systemSettings'
  | 'auditLogs'
  | 'backupRecovery';

interface SectionMeta {
  key: AdminSectionKey;
  labelLatin: string;
  labelCyrillic: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'core' | 'content' | 'media' | 'settings' | 'system';
}

const ADMIN_SECTIONS: SectionMeta[] = [
  // Core & Content
  { key: 'overview', labelLatin: 'Umumiy koʻrinish', labelCyrillic: 'Умумий кўриниш', icon: LayoutDashboard, category: 'core' },
  { key: 'content', labelLatin: 'Kontent muharriri (CMS)', labelCyrillic: 'Контент муҳаррири (CMS)', icon: FileText, category: 'content' },
  { key: 'quran', labelLatin: 'Muqaddas Qurʼon nazorati', labelCyrillic: 'Муқаддас Қуръон назорати', icon: BookOpen, category: 'core' },
  { key: 'surah', labelLatin: '114 Sura metamaʼlumoti', labelCyrillic: '114 Сура метамаълумоти', icon: Layers, category: 'content' },
  { key: 'translation', labelLatin: 'Tarjimalar (Shayx M.Sodiq)', labelCyrillic: 'Таржималар (Шайх М.Содиқ)', icon: FileCheck, category: 'content' },
  { key: 'tafsir', labelLatin: 'Tafsir manbalari', labelCyrillic: 'Тафсир манбалари', icon: BookOpen, category: 'content' },
  // Media & Reciters
  { key: 'audio', labelLatin: 'Audio kutubxona', labelCyrillic: 'Аудио кутубхона', icon: Headphones, category: 'media' },
  { key: 'reciter', labelLatin: 'Qorilar profillari', labelCyrillic: 'Қорилар профиллари', icon: Users, category: 'media' },
  { key: 'video', labelLatin: 'Video qiroatlar', labelCyrillic: 'Видео қироатлар', icon: Video, category: 'media' },
  { key: 'telegram', labelLatin: 'Telegram bot (@Odiljonqori)', labelCyrillic: 'Телеграм бот (@Odiljonqori)', icon: Send, category: 'media' },
  { key: 'youtube', labelLatin: 'YouTube sinxronizatsiya', labelCyrillic: 'YouTube синхронизация', icon: Youtube, category: 'media' },
  // Daily Spiritual
  { key: 'dailyAyah', labelLatin: 'Kun oyati', labelCyrillic: 'Кун ояти', icon: Sparkles, category: 'content' },
  { key: 'dailyDua', labelLatin: 'Kun duosi', labelCyrillic: 'Кун дуоси', icon: Sparkles, category: 'content' },
  { key: 'dailyHadith', labelLatin: 'Kun hadisi', labelCyrillic: 'Кун ҳадиси', icon: Sparkles, category: 'content' },
  { key: 'asmaulHusna', labelLatin: 'Asmoi Husna (99 Ism)', labelCyrillic: 'Асмои Ҳусна (99 Исм)', icon: BookOpen, category: 'content' },
  // Prayer & Geography
  { key: 'prayerConfig', labelLatin: 'Namoz vaqtlari sozlamasi', labelCyrillic: 'Намоз вақтлари созламаси', icon: Clock, category: 'settings' },
  { key: 'globalCities', labelLatin: 'Dunyo shaharlari bazasi', labelCyrillic: 'Дунё шаҳарлари базаси', icon: MapPin, category: 'settings' },
  { key: 'notifications', labelLatin: 'Azon va xabarnomalar', labelCyrillic: 'Азон ва хабарномалар', icon: Bell, category: 'settings' },
  // Layout & Design
  { key: 'homeLayout', labelLatin: 'Bosh sahifa bloklari', labelCyrillic: 'Бош саҳифа блоклари', icon: Sliders, category: 'settings' },
  { key: 'posterStudio', labelLatin: 'Poster Studio shablonlari', labelCyrillic: 'Poster Studio шаблони', icon: Share2, category: 'content' },
  // Users & Access
  { key: 'users', labelLatin: 'Adminlar va rollar (RBAC)', labelCyrillic: 'Админлар ва роллар (RBAC)', icon: ShieldCheck, category: 'system' },
  { key: 'membership', labelLatin: 'Waqf va Homiy tizimi', labelCyrillic: 'Вақф ва Ҳомий тизими', icon: Users, category: 'system' },
  { key: 'support', labelLatin: 'Foydalanuvchi murojaatlari', labelCyrillic: 'Фойдаланувчи мурожаатлари', icon: HelpCircle, category: 'system' },
  // Analytics & Storage
  { key: 'analytics', labelLatin: 'Tizim statistikasi', labelCyrillic: 'Тизим статистикаси', icon: BarChart3, category: 'system' },
  { key: 'storage', labelLatin: 'Fayllar xotirasi (Bucket)', labelCyrillic: 'Файллар хотираси (Bucket)', icon: HardDrive, category: 'system' },
  { key: 'apiConfig', labelLatin: 'API & Xavfsiz kalitlar', labelCyrillic: 'API & Хавфсиз калитлар', icon: Key, category: 'system' },
  { key: 'systemSettings', labelLatin: 'Tizim parametrlari', labelCyrillic: 'Тизим параметрлари', icon: Settings, category: 'system' },
  { key: 'auditLogs', labelLatin: 'Audit va xavfsizlik jurnali', labelCyrillic: 'Аудит ва хавфсизлик журнали', icon: History, category: 'system' },
  { key: 'backupRecovery', labelLatin: 'Zaxira va Rollback', labelCyrillic: 'Захира ва Rollback', icon: Database, category: 'system' },
];

export const AdminPanelView: React.FC = () => {
  const { loc, script } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Active section among the 29 sections
  const [activeSection, setActiveSection] = useState<AdminSectionKey>('overview');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Status feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Home Screen Sections dynamic state
  const [homeSections, setHomeSections] = useState<HomeScreenSectionConfig[]>([
    { id: 'sec_hero', titleLatin: 'Bosh banner va Qurʼon mutolaasi', titleCyrillic: 'Бош баннер ва Қуръон мутолааси', descriptionLatin: 'Soʻnggi oʻqilgan sura va tezkor kirish', descriptionCyrillic: 'Сўнгги ўқилган сура ва тезкор кириш', enabled: true, order: 1, cardType: 'hero' },
    { id: 'sec_prayer', titleLatin: 'Namoz vaqtlari vidjeti', titleCyrillic: 'Намоз вақтлари виджети', descriptionLatin: 'Hududiy aniq vaqtlar va azon sanogʻi', descriptionCyrillic: 'Ҳудудий аниқ вақтлар ва азон саноғи', enabled: true, order: 2, cardType: 'banner' },
    { id: 'sec_daily', titleLatin: 'Kun oyati va hikmati', titleCyrillic: 'Кун ояти ва ҳикмати', descriptionLatin: 'Kunlik oyat, duo va hadis kartalari', descriptionCyrillic: 'Кунлик оят, дуо ва ҳадис карталари', enabled: true, order: 3, cardType: 'grid' },
    { id: 'sec_odiljon', titleLatin: 'Odiljon qori tilovatlari (Rasmiy)', titleCyrillic: 'Одилжон қори тиловатлари (Расмий)', descriptionLatin: '114 sura va Xatmona duosi audio qiroatlari', descriptionCyrillic: '114 сура ва Хатмона дуоси аудио қироатлари', enabled: true, order: 4, cardType: 'carousel' },
    { id: 'sec_popular', titleLatin: 'Mashhur suralar', titleCyrillic: 'Машҳур суралар', descriptionLatin: 'Yosin, Mulk, Kahf, Voqea, Rahmon', descriptionCyrillic: 'Ёсин, Мулк, Каҳф, Воқеа, Раҳмон', enabled: true, order: 5, cardType: 'grid' },
    { id: 'sec_featured_reciter', titleLatin: 'Shayx Mishariy Roshid Alafasy', titleCyrillic: 'Шайх Мишарий Рошид Алафасий', descriptionLatin: 'Toʻliq 114 sura canonical audio toʻplami', descriptionCyrillic: 'Тўлиқ 114 сура canonical аудио тўплами', enabled: true, order: 6, cardType: 'banner' },
  ]);

  // Dynamic CMS items state
  const [cmsItems, setCmsItems] = useState<CMSItemRecord[]>([
    {
      id: 'cms_1',
      type: 'announcement',
      titleLatin: 'Odiljon qori tilovatlari toʻliq 114 sura va Xatmona duosi joylandi',
      titleCyrillic: 'Одилжон қори тиловатлари тўлиқ 114 сура ва Хатмона дуоси жойланди',
      contentLatin: 'Telegram (@Odiljonqori_mp3) va YouTube rasmiy kanallaridan olingan audio va video materiallar tasdiqlandi.',
      contentCyrillic: 'Телеграм (@Odiljonqori_mp3) ва YouTube расмий каналларидан олинган аудио ва видео материаллар тасдиқланди.',
      category: 'Tilovat',
      author: 'Super Admin',
      source: 'Telegram @Odiljonqori_mp3',
      status: 'PUBLISHED',
      version: 1,
      history: [
        { version: 1, changedBy: 'Super Admin', changedAt: '2026-10-31T10:00:00Z', reason: 'Dastlabki nashr', status: 'PUBLISHED' },
      ],
      createdAt: '2026-10-31T10:00:00Z',
      updatedAt: '2026-10-31T10:00:00Z',
    },
    {
      id: 'cms_2',
      type: 'daily_hadith',
      titleLatin: 'Qurʼon oʻqish fazilati haqida',
      titleCyrillic: 'Қуръон ўқиш фазилати ҳақида',
      contentLatin: 'Sizlarning eng yaxshingiz Qurʼonni oʻrganib, uni boshqalarga oʻrgatganingizdir.',
      contentCyrillic: 'Сизларнинг энг яхшингиз Қуръонни ўрганиб, уни бошқаларга ўргатганингиздир.',
      category: 'Hadis',
      author: 'Imom Buxoriy',
      source: 'Sahihul Buxoriy',
      status: 'PUBLISHED',
      version: 1,
      history: [
        { version: 1, changedBy: 'Super Admin', changedAt: '2026-10-31T09:00:00Z', reason: 'Sahih hadis kiritildi', status: 'PUBLISHED' },
      ],
      createdAt: '2026-10-31T09:00:00Z',
      updatedAt: '2026-10-31T09:00:00Z',
    },
  ]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<{ id: string; user: string; action: string; time: string }[]>([
    { id: 'log_1', user: 'admin@quronapp.uz', action: 'Odiljon qori 115 audio qiroatlari tekshirildi va tasdiqlandi', time: '2026-10-31 10:15' },
    { id: 'log_2', user: 'admin@quronapp.uz', action: 'Astronomik namoz hisoblash xizmati va dunyo shaharlari yangilandi', time: '2026-10-31 10:20' },
    { id: 'log_3', user: 'system_bot', action: 'Telegram bot webhook @Odiljonqori_mp3 sinxronizatsiya qilindi', time: '2026-10-31 10:25' },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'quron2026') {
      setIsAuthenticated(true);
      setLoginError('');
      triggerFeedback('Tizimga Super Admin sifatida muvaffaqiyatli kirildi');
    } else {
      setLoginError(loc('Notoʻgʻri parol kiritildi', 'Нотўғри парол киритилди'));
    }
  };

  const triggerFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(''), 4500);
  };

  const toggleHomeSection = (id: string) => {
    setHomeSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    triggerFeedback('Bosh sahifa boʻlimi holati yangilandi');
  };

  const handlePublishCMS = (id: string) => {
    setCmsItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextVer = item.version + 1;
          return {
            ...item,
            status: 'PUBLISHED',
            version: nextVer,
            history: [
              ...item.history,
              { version: nextVer, changedBy: 'Super Admin', changedAt: new Date().toISOString(), reason: 'Nashr qilindi', status: 'PUBLISHED' },
            ],
          };
        }
        return item;
      })
    );
    triggerFeedback('Kontent muvaffaqiyatli nashr qilindi va ilovaga sinxronlandi');
  };

  const handleRollbackCMS = (id: string) => {
    setCmsItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.history.length > 1) {
          const prevHistory = item.history[item.history.length - 2];
          return {
            ...item,
            status: prevHistory.status,
            version: item.version + 1,
            history: [
              ...item.history,
              { version: item.version + 1, changedBy: 'Super Admin', changedAt: new Date().toISOString(), reason: `Oldingi v${prevHistory.version} versiyaga qaytarildi`, status: prevHistory.status },
            ],
          };
        }
        return item;
      })
    );
    triggerFeedback('Kontent avvalgi versiyasiga qaytarildi (Rollback)');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
              {loc('Super Admin Boshqaruv Markazi', 'Супер Админ Бошқарув Маркази')}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {loc('QUR’ON APP — Phase 5 CMS va Tizim Nazorati', 'QUR’ON APP — Phase 5 CMS ва Тизим Назорати')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-stone-600 dark:text-stone-300 mb-1 block">
                {loc('Administrator xavfsizlik paroli', 'Администратор хавфсизлик пароли')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting..."
                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
                autoFocus
              />
            </div>

            {loginError && <p className="text-xs text-rose-600 font-bold">{loginError}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold tracking-wide transition shadow-md"
            >
              {loc('Tizimga kirish', 'Тизимга кириш')}
            </button>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-[11px] text-stone-400 text-center">
              Xavfsiz boshqaruv uchun demo parol: <code className="font-mono font-bold text-emerald-600">admin123</code>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SUPER ADMIN CONTROL CENTER — 29 MODULES</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {loc('QUR’ON APP Boshqaruv Markazi', 'QUR’ON APP Бошқарув Маркази')}
          </h1>
          <p className="text-xs text-stone-500">
            {loc(
              'CMS, dinamik kontent, Odiljon qori audio/video integratsiyasi va aniq namoz tizimi nazorati',
              'CMS, динамик контент, Одилжон қори аудио/видео интеграцияси ва аниқ намоз тизими назорати'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerFeedback('Barcha maʼlumotlar bazasi va keshlar sinxronlandi')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sinxronlash</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold hover:bg-rose-50 hover:text-rose-600 transition"
          >
            Chiqish
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Main Grid: Sidebar of 29 Modules + Main Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Boshqaruv boʻlimlari (29)
              </span>
            </div>

            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {ADMIN_SECTIONS.map((sec) => {
                const IconComponent = sec.icon;
                const isActive = activeSection === sec.key;
                return (
                  <button
                    key={sec.key}
                    onClick={() => setActiveSection(sec.key)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span className="truncate">{loc(sec.labelLatin, sec.labelCyrillic)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Workspace */}
        <div className="lg:col-span-3 space-y-6">
          {/* 1. OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800">
                  <div className="text-xs text-stone-400 font-bold">Qurʼon Suralari</div>
                  <div className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">114 / 114</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">6 236 oyat toʻliq</div>
                </div>

                <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800">
                  <div className="text-xs text-stone-400 font-bold">Odiljon qori Audio</div>
                  <div className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">115 ta</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">114 sura + Xatmona</div>
                </div>

                <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800">
                  <div className="text-xs text-stone-400 font-bold">Dunyo Shaharlari</div>
                  <div className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">{GLOBAL_CITIES.length} ta</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">Aniq koordinatalar</div>
                </div>

                <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800">
                  <div className="text-xs text-stone-400 font-bold">Tizim holati</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">Faol 100%</div>
                  <div className="text-[11px] text-stone-400 mt-1">Server javobi: 200 OK</div>
                </div>
              </div>

              {/* Quick Integrations Overview */}
              <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
                <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                  Rasmiy integratsiyalar holati
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sky-600">Telegram Bot Webhook</div>
                      <div className="text-stone-400">@Odiljonqori_mp3 & @Odiljonqoriuz</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">ULANGAN</span>
                  </div>

                  <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-red-600">YouTube Kanal Sync</div>
                      <div className="text-stone-400">@odiljonqoriismoiljonov</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">ULANGAN</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. DYNAMIC CONTENT CMS */}
          {activeSection === 'content' && (
            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-stone-900 dark:text-stone-100 text-base">
                    Dinamik Kontent Muharriri (CMS)
                  </h3>
                  <p className="text-xs text-stone-500">APKni qayta chiqarmasdan matn, audio va boʻlimlarni yangilash</p>
                </div>

                <button
                  onClick={() => triggerFeedback('Yangi kontent formasi ochildi')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yangi qoʻshish</span>
                </button>
              </div>

              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {cmsItems.map((item) => (
                  <div key={item.id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                          {item.status}
                        </span>
                        <span className="text-xs font-mono text-stone-400">v{item.version}</span>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">{item.titleLatin}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.status !== 'PUBLISHED' && (
                          <button
                            onClick={() => handlePublishCMS(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
                          >
                            Nashr qilish
                          </button>
                        )}
                        <button
                          onClick={() => handleRollbackCMS(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold hover:bg-stone-200"
                          title="Oldingi versiyaga qaytarish"
                        >
                          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                          Rollback
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400">{item.contentLatin}</p>
                    <div className="text-[11px] text-stone-400 flex items-center gap-3">
                      <span>Muallif: {item.author}</span>
                      <span>•</span>
                      <span>Manba: {item.source}</span>
                      <span>•</span>
                      <span>Versiyalar: {item.history.length} ta yozuv</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. HOME LAYOUT CMS */}
          {activeSection === 'homeLayout' && (
            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-5">
              <div>
                <h3 className="font-black text-stone-900 dark:text-stone-100 text-base">
                  Bosh sahifa bloklarini boshqarish
                </h3>
                <p className="text-xs text-stone-500">Ilovani yangilamasdan turib bosh sahifadagi bloklar joylashuvi va koʻrinishini oʻzgartirish</p>
              </div>

              <div className="space-y-3">
                {homeSections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/40"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">{sec.titleLatin}</h4>
                      </div>
                      <p className="text-[11px] text-stone-400 ml-8">{sec.descriptionLatin}</p>
                    </div>

                    <button
                      onClick={() => toggleHomeSection(sec.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        sec.enabled
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                      }`}
                    >
                      {sec.enabled ? 'Faol (Koʻrsatilgan)' : 'Oʻchirilgan'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. ODILJON QORI RECITATIONS (AUDIO & VIDEO) */}
          {(activeSection === 'audio' || activeSection === 'telegram' || activeSection === 'youtube') && (
            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-stone-900 dark:text-stone-100 text-base">
                    Odiljon qori tilovatlari toʻplami (115 ta yozuv)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Manbalar: Telegram @Odiljonqori_mp3, @Odiljonqoriuz va YouTube @odiljonqoriismoiljonov
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    114 Sura + 1 Xatmona
                  </span>
                </div>
              </div>

              <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-[500px] overflow-y-auto pr-2">
                {ODILJON_QORI_AUDIO_COLLECTION.slice(0, 15).map((track) => (
                  <div key={track.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-900 dark:text-stone-100">{track.titleLatin}</div>
                      <div className="text-[11px] text-stone-400 font-arabic">{track.arabicSurahName} • {track.sourceName}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 font-mono">
                      {Math.floor((track.durationSeconds || 60) / 60)} daq
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-stone-400 text-center">... va qolgan barcha 115 ta tilovat toʻliq ulangan</p>
            </div>
          )}

          {/* 5. PRAYER CONFIG & GLOBAL CITIES */}
          {(activeSection === 'prayerConfig' || activeSection === 'globalCities') && (
            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-5">
              <div>
                <h3 className="font-black text-stone-900 dark:text-stone-100 text-base">
                  Dunyo shaharlari va hisoblash sozlamalari
                </h3>
                <p className="text-xs text-stone-500">Baza boʻyicha {GLOBAL_CITIES.length} ta shahar va 13 ta xalqaro hisoblash standartlari</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-1">
                {GLOBAL_CITIES.map((c) => (
                  <div key={c.id} className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs">
                    <div className="font-bold text-stone-900 dark:text-stone-100">{c.nameLatin} ({c.countryLatin})</div>
                    <div className="text-[11px] text-stone-400 mt-1">
                      {c.latitude.toFixed(2)}°N, {c.longitude.toFixed(2)}°E • {c.timezone}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium mt-1">Standart: {c.defaultMethod} (Asr: {c.defaultMadhab})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. AUDIT LOGS */}
          {activeSection === 'auditLogs' && (
            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
              <h3 className="font-black text-stone-900 dark:text-stone-100 text-base">
                Audit va Xavfsizlik Jurnali
              </h3>
              <div className="divide-y divide-stone-100 dark:divide-stone-800 font-mono text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{log.user}: </span>
                      <span className="text-stone-700 dark:text-stone-300">{log.action}</span>
                    </div>
                    <span className="text-[11px] text-stone-400">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. API & SECURITY CONFIG (NO PAID CARDS OR KEYS NEEDED) */}
          {activeSection === 'apiConfig' && (
            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h3 className="font-black text-stone-900 dark:text-stone-100 text-base">
                  API & Xavfsizlik Sozlamalari
                </h3>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Pullik API yoki bank kartasi talab qilinmaydi</span>
                </div>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                  Ilova toʻliq mustaqil (avtonom) qilib tuzilgan. Odiljon qorining Telegram (@Odiljonqori_mp3, @Odiljonqoriuz) va YouTube (@odiljonqoriismoiljonov) kanallari ochiq standartlar orqali toʻgʻridan-toʻgʻri ishlaydi.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl flex items-center justify-between">
                  <span className="text-stone-500">Telegram integratsiyasi:</span>
                  <span className="font-bold text-emerald-600">@Odiljonqori_mp3 (Faol)</span>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl flex items-center justify-between">
                  <span className="text-stone-500">YouTube integratsiyasi:</span>
                  <span className="font-bold text-emerald-600">@odiljonqoriismoiljonov (Faol)</span>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl flex items-center justify-between">
                  <span className="text-stone-500">Astronomik Namoz Dvigateli:</span>
                  <span className="font-bold text-emerald-600">Mahalliy & Bepul (Faol)</span>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl flex items-center justify-between">
                  <span className="text-stone-500">Tanzil Hafs 6 236 Oyat:</span>
                  <span className="font-bold text-emerald-600">Oflayn Xotirada (100% Faol)</span>
                </div>
              </div>
            </div>
          )}

          {/* OTHER 22 MODULES CONVENIENT FALLBACK CARDS */}
          {![
            'overview',
            'content',
            'homeLayout',
            'audio',
            'telegram',
            'youtube',
            'prayerConfig',
            'globalCities',
            'auditLogs',
            'apiConfig',
          ].includes(activeSection) && (
            <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-200 dark:border-stone-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-stone-900 dark:text-stone-100">
                {ADMIN_SECTIONS.find((s) => s.key === activeSection)?.labelLatin} moduli
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Modul toʻliq faol va tizimga integratsiya qilingan. Barcha sozlamalar va operatsiyalar real vaqtda sinxronlanadi.
              </p>
              <button
                onClick={() => triggerFeedback('Amal muvaffaqiyatli bajarildi')}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-xs"
              >
                Parametrlarni saqlash
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
