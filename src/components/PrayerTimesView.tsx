import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Compass,
  MapPin,
  RotateCcw,
  Sparkles,
  Volume2,
  Bell,
  CheckCircle2,
  ChevronDown,
  Search,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Info,
  ShieldCheck,
  Globe2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GLOBAL_CITIES, searchGlobalCities, getCityById } from '../shared/globalCities';
import {
  calculateAccuratePrayerTimes,
  generateMonthlyCalendar,
  CALCULATION_METHODS_CONFIG,
} from '../shared/prayerCalculation';
import {
  GlobalCity,
  PrayerCalculationMethod,
  AsrMadhab,
  AccuratePrayerTimes,
} from '../shared/types';

export const PrayerTimesView: React.FC = () => {
  const { loc, script } = useApp();

  // Location & Calculation State
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    return localStorage.getItem('quron_selected_city_id') || 'tashkent';
  });
  const [calculationMethod, setCalculationMethod] = useState<PrayerCalculationMethod>('uzbekistan');
  const [asrMadhab, setAsrMadhab] = useState<AsrMadhab>('hanafi');

  // UI Navigation Tabs
  const [activeTab, setActiveTab] = useState<'times' | 'month' | 'qibla' | 'tasbih'>('times');
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [citySearchQuery, setCitySearchQuery] = useState<string>('');
  const [isMethodModalOpen, setIsMethodModalOpen] = useState<boolean>(false);

  // Month navigation for monthly calendar
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth() + 1);

  // Azon alerts state
  const [reminders, setReminders] = useState<Record<string, boolean>>({
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  });

  // Tasbih state
  const [tasbihCount, setTasbihCount] = useState<number>(0);
  const [tasbihTarget, setTasbihTarget] = useState<number>(33);
  const [selectedDhikr, setSelectedDhikr] = useState<string>('Subhanalloh');

  // Qibla compass angle
  const [compassHeading, setCompassHeading] = useState<number>(0);

  const currentCity = useMemo(() => getCityById(selectedCityId), [selectedCityId]);

  // Synchronize defaults when city changes
  useEffect(() => {
    localStorage.setItem('quron_selected_city_id', currentCity.id);
    setCalculationMethod(currentCity.defaultMethod);
    setAsrMadhab(currentCity.defaultMadhab);
  }, [currentCity]);

  // Current accurate prayer calculation
  const todayTimes = useMemo(() => {
    return calculateAccuratePrayerTimes(
      currentCity,
      new Date(),
      calculationMethod,
      asrMadhab
    );
  }, [currentCity, calculationMethod, asrMadhab]);

  // Monthly calendar
  const monthlyCalendar = useMemo(() => {
    return generateMonthlyCalendar(
      currentCity,
      calendarYear,
      calendarMonth,
      calculationMethod,
      asrMadhab
    );
  }, [currentCity, calendarYear, calendarMonth, calculationMethod, asrMadhab]);

  // Search filtered cities
  const filteredCities = useMemo(() => {
    return searchGlobalCities(citySearchQuery);
  }, [citySearchQuery]);

  const dhikrPresets = [
    { label: 'Subhanalloh', arabic: 'سُبْحَانَ اللَّهِ' },
    { label: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ' },
    { label: 'Allohu Akbar', arabic: 'اللَّهُ أَكْبَرُ' },
    { label: 'Astagʻfirulloh', arabic: 'أَسْتَغْفِرُ اللَّهَ' },
    { label: 'La ilaha illalloh', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ' },
  ];

  // Device orientation listener for Qibla
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setCompassHeading(Math.round(e.alpha));
      }
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const handleTasbihIncrement = () => {
    if (navigator.vibrate) {
      navigator.vibrate(35);
    }
    setTasbihCount((prev) => {
      const next = prev + 1;
      if (next === tasbihTarget && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      return next;
    });
  };

  const handleTasbihReset = () => {
    setTasbihCount(0);
  };

  const toggleReminder = (key: string) => {
    setReminders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const prevMonth = () => {
    if (calendarMonth === 1) {
      setCalendarMonth(12);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 12) {
      setCalendarMonth(1);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const prayers = [
    {
      key: 'fajr',
      nameLatin: 'Bomdod',
      nameCyrillic: 'Бомдод',
      arabic: 'الفَجْر',
      time: todayTimes.fajr,
      isNext: todayTimes.nextPrayer.key === 'fajr',
    },
    {
      key: 'sunrise',
      nameLatin: 'Quyosh chiqishi',
      nameCyrillic: 'Қуёш чиқиши',
      arabic: 'الشُّرُوق',
      time: todayTimes.sunrise,
      isNext: todayTimes.nextPrayer.key === 'sunrise',
    },
    {
      key: 'dhuhr',
      nameLatin: 'Peshin',
      nameCyrillic: 'Пешин',
      arabic: 'الظُّهْر',
      time: todayTimes.dhuhr,
      isNext: todayTimes.nextPrayer.key === 'dhuhr',
    },
    {
      key: 'asr',
      nameLatin: `Asr (${asrMadhab === 'hanafi' ? 'Hanafiy' : 'Shofeiy'})`,
      nameCyrillic: `Аср (${asrMadhab === 'hanafi' ? 'Ҳанафий' : 'Шофеий'})`,
      arabic: 'العَصْر',
      time: todayTimes.asr,
      isNext: todayTimes.nextPrayer.key === 'asr',
    },
    {
      key: 'maghrib',
      nameLatin: 'Shom',
      nameCyrillic: 'Шом',
      arabic: 'المَغْرِب',
      time: todayTimes.maghrib,
      isNext: todayTimes.nextPrayer.key === 'maghrib',
    },
    {
      key: 'isha',
      nameLatin: 'Xufton',
      nameCyrillic: 'Хуфтон',
      arabic: 'العِشَاء',
      time: todayTimes.isha,
      isNext: todayTimes.nextPrayer.key === 'isha',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      {/* City Selector Header Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
            <Globe2 className="w-4 h-4" />
            <span>{loc('Aniq astronomik namoz taqvimi', 'Аниқ астрономик намоз тақвими')}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
              {script === 'lat' ? currentCity.nameLatin : currentCity.nameCyrillic}
            </h1>
            <span className="text-xs text-stone-500">
              ({script === 'lat' ? currentCity.countryLatin : currentCity.countryCyrillic})
            </span>
          </div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex flex-wrap items-center gap-3">
            <span>Koordinata: {currentCity.latitude.toFixed(2)}°N, {currentCity.longitude.toFixed(2)}°E</span>
            <span>•</span>
            <span>Vaqt mintaqasi: {currentCity.timezone}</span>
            <span>•</span>
            <span className="text-amber-700 dark:text-amber-400 font-medium">{todayTimes.hijriDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCityModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900 transition border border-emerald-200/50 dark:border-emerald-800/40"
          >
            <MapPin className="w-4 h-4" />
            <span>{loc('Shaharni oʻzgartirish', 'Шаҳарни ўзгартириш')}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMethodModalOpen(true)}
            className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
            title="Hisoblash usuli va mazhab sozlamalari"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
        <button
          onClick={() => setActiveTab('times')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'times'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{loc('Bugungi vaqtlar', 'Бугунги вақтлар')}</span>
        </button>

        <button
          onClick={() => setActiveTab('month')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'month'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{loc('Oylik taqvim', 'Ойлик тақвим')}</span>
        </button>

        <button
          onClick={() => setActiveTab('qibla')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'qibla'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{loc('Qibla kompas', 'Қибла компас')}</span>
        </button>

        <button
          onClick={() => setActiveTab('tasbih')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'tasbih'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{loc('Elektron tasbeh', 'Электрон тасбеҳ')}</span>
        </button>
      </div>

      {/* TAB 1: DAILY PRAYER TIMES */}
      {activeTab === 'times' && (
        <div className="space-y-6">
          {/* Next Prayer Hero Card */}
          <div className="relative overflow-hidden bg-radial from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{loc('Navbatdagi namoz', 'Навбатдаги намоз')}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
                  {loc(todayTimes.nextPrayer.nameLatin, todayTimes.nextPrayer.nameCyrillic)}
                </h2>
                <p className="text-emerald-200/80 text-sm mt-1">
                  {loc('Azon vaqti', 'Азон вақти')}: <span className="text-white font-bold">{todayTimes.nextPrayer.time}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-emerald-300 uppercase tracking-widest font-bold">
                  {loc('Qolgan vaqt', 'Қолган вақт')}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1 font-mono">
                  {loc(todayTimes.nextPrayer.countdownTextLatin, todayTimes.nextPrayer.countdownTextCyrillic)}
                </div>
              </div>
            </div>

            {/* Subtle background ornamentation */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none" />
          </div>

          {/* Source Transparency Badge */}
          <div className="flex items-center justify-between p-3.5 bg-stone-100/80 dark:bg-stone-900/80 rounded-2xl text-xs border border-stone-200/60 dark:border-stone-800/60">
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>{loc('Manba', 'Манба')}:</strong> {todayTimes.sourceName} • {todayTimes.sourceType === 'OFFICIAL_LOCAL_TIMETABLE' ? loc('Rasmiy tasdiqlangan jadval', 'Расмий тасдиқланган жадвал') : loc('Astronomik hisoblash', 'Астрономик ҳисоблаш')}
              </span>
            </div>
            <button
              onClick={() => setIsMethodModalOpen(true)}
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline shrink-0"
            >
              {loc('Sozlash', 'Созлаш')}
            </button>
          </div>

          {/* 6 Prayers List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prayers.map((prayer) => (
              <div
                key={prayer.key}
                className={`flex items-center justify-between p-4 rounded-2xl border transition ${
                  prayer.isNext
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500/60 shadow-sm'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif text-sm ${
                      prayer.isNext
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {prayer.arabic.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                      {loc(prayer.nameLatin, prayer.nameCyrillic)}
                    </h3>
                    <span className="text-xs text-stone-400 font-arabic">{prayer.arabic}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-stone-900 dark:text-stone-100 font-mono tracking-tight">
                    {prayer.time}
                  </span>
                  {prayer.key !== 'sunrise' && (
                    <button
                      onClick={() => toggleReminder(prayer.key)}
                      className={`p-2 rounded-xl transition ${
                        reminders[prayer.key]
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60'
                          : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                      }`}
                      title="Azon eslatmasi"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MONTHLY CALENDAR */}
      {activeTab === 'month' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
              {calendarYear}-yil, {calendarMonth}-oy — {script === 'lat' ? currentCity.nameLatin : currentCity.nameCyrillic}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 font-bold border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="py-3 px-3">Sana</th>
                  <th className="py-3 px-3">Bomdod</th>
                  <th className="py-3 px-3">Quyosh</th>
                  <th className="py-3 px-3">Peshin</th>
                  <th className="py-3 px-3">Asr</th>
                  <th className="py-3 px-3">Shom</th>
                  <th className="py-3 px-3">Xufton</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono">
                {monthlyCalendar.map((row) => {
                  const isToday = row.date === todayTimes.date;
                  return (
                    <tr
                      key={row.date}
                      className={isToday ? 'bg-emerald-50 dark:bg-emerald-950/40 font-bold text-emerald-900 dark:text-emerald-200' : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'}
                    >
                      <td className="py-2.5 px-3 font-sans">{row.formattedDate}</td>
                      <td className="py-2.5 px-3">{row.fajr}</td>
                      <td className="py-2.5 px-3 text-stone-400">{row.sunrise}</td>
                      <td className="py-2.5 px-3">{row.dhuhr}</td>
                      <td className="py-2.5 px-3">{row.asr}</td>
                      <td className="py-2.5 px-3">{row.maghrib}</td>
                      <td className="py-2.5 px-3">{row.isha}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: QIBLA COMPASS */}
      {activeTab === 'qibla' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm text-center space-y-6">
          <div>
            <h3 className="text-xl font-black text-stone-900 dark:text-stone-100">
              {loc('Qibla yoʻnalishi', 'Қибла йўналиши')}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {script === 'lat' ? currentCity.nameLatin : currentCity.nameCyrillic} shahridan Kaʼbaga qadar aniq azimut burchagi:{' '}
              <strong className="text-emerald-600 dark:text-emerald-400">{todayTimes.qiblaDegree}°</strong>
            </p>
          </div>

          {/* Compass Dial */}
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            {/* Outer Ring */}
            <div
              className="absolute inset-0 rounded-full border-4 border-stone-200 dark:border-stone-700 shadow-inner flex items-center justify-center transition-transform duration-300"
              style={{ transform: `rotate(${-compassHeading}deg)` }}
            >
              <span className="absolute top-2 font-black text-xs text-rose-500">N (0°)</span>
              <span className="absolute right-2 font-black text-xs text-stone-400">E (90°)</span>
              <span className="absolute bottom-2 font-black text-xs text-stone-400">S (180°)</span>
              <span className="absolute left-2 font-black text-xs text-stone-400">W (270°)</span>

              {/* Kaaba Direction Marker */}
              <div
                className="absolute w-full h-full flex flex-col items-center justify-start pointer-events-none"
                style={{ transform: `rotate(${todayTimes.qiblaDegree}deg)` }}
              >
                <div className="w-6 h-6 bg-emerald-700 text-white rounded-md flex items-center justify-center shadow-lg -mt-3 text-[10px] font-black">
                  🕋
                </div>
              </div>
            </div>

            {/* Inner Pointer */}
            <div className="w-32 h-32 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex flex-col items-center justify-center">
              <Compass className="w-10 h-10 text-emerald-700 dark:text-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold mt-1 text-emerald-900 dark:text-emerald-200">
                {todayTimes.qiblaDegree}°
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            {loc(
              'Telefoningizni gorizontal tekislikda ushlang. Yashil Kaʼba belgisi Qibla tarafini koʻrsatadi.',
              'Телефонингизни горизонтал текисликда ушланг. Яшил Каъба белгиси Қибла тарафини кўрсатади.'
            )}
          </p>
        </div>
      )}

      {/* TAB 4: ELEKTRON TASBEH */}
      {activeTab === 'tasbih' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm text-center space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {dhikrPresets.map((d) => (
              <button
                key={d.label}
                onClick={() => {
                  setSelectedDhikr(d.label);
                  setTasbihCount(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedDhikr === d.label
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Central Counter Display */}
          <div className="space-y-2">
            <span className="text-xs font-arabic text-stone-400 text-xl block">
              {dhikrPresets.find((d) => d.label === selectedDhikr)?.arabic}
            </span>
            <div className="text-6xl sm:text-7xl font-black font-mono text-emerald-800 dark:text-emerald-400 tracking-tighter">
              {tasbihCount}
            </div>
            <span className="text-xs text-stone-400">
              {loc('Maqsad', 'Мақсад')}: {tasbihTarget}
            </span>
          </div>

          {/* Large Click Button */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleTasbihReset}
              className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
              title={loc('Qayta boshlash', 'Қайта бошлаш')}
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            <button
              onClick={handleTasbihIncrement}
              className="w-36 h-36 rounded-full bg-radial from-emerald-600 to-emerald-800 text-white shadow-xl hover:scale-105 active:scale-95 transition flex flex-col items-center justify-center select-none"
            >
              <Sparkles className="w-8 h-8 mb-1" />
              <span className="font-extrabold text-base tracking-wide">SUBHONALLOH</span>
            </button>

            <button
              onClick={() => setTasbihTarget((t) => (t === 33 ? 99 : 33))}
              className="px-3 py-2 rounded-2xl bg-stone-100 dark:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-200"
            >
              {tasbihTarget}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: CITY SEARCH & SELECTION */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col border border-stone-200 dark:border-stone-800 shadow-2xl animate-in zoom-in-95">
            <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base">
                  {loc('Shaharni tanlang', 'Шаҳарни танланг')}
                </h3>
                <p className="text-xs text-stone-500">
                  {loc('Oʻzbekiston viloyatlari va dunyo shaharlari', 'Ўзбекистон вилоятлари ва дунё шаҳарлари')}
                </p>
              </div>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <div className="p-4 border-b border-stone-100 dark:border-stone-800">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                <input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder={loc('Shahar yoki davlat nomini qidiring...', 'Шаҳар ёки давлат номини қидиринг...')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border-none text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:ring-2 focus:ring-emerald-600 outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 divide-y divide-stone-100 dark:divide-stone-800">
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    setSelectedCityId(city.id);
                    setIsCityModalOpen(false);
                    setCitySearchQuery('');
                  }}
                  className={`w-full p-3 rounded-2xl text-left flex items-center justify-between transition ${
                    city.id === selectedCityId
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold flex items-center gap-2">
                      <span>{script === 'lat' ? city.nameLatin : city.nameCyrillic}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 font-mono">
                        {city.countryCode}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400">
                      {script === 'lat' ? city.countryLatin : city.countryCyrillic} • {city.region}
                    </div>
                  </div>
                  <div className="text-right text-xs text-stone-400 font-mono">
                    {city.latitude.toFixed(1)}°N, {city.longitude.toFixed(1)}°E
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: METHOD & ASR MADHAB SETTINGS */}
      {isMethodModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base">
                {loc('Hisoblash sozlamalari', 'Ҳисоблаш созламалари')}
              </h3>
              <button
                onClick={() => setIsMethodModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            {/* Asr Madhab Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
                {loc('Asr vaqti mazhabi (soya nisbati)', 'Аср вақти мазҳаби (соя нисбати)')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAsrMadhab('hanafi')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    asrMadhab === 'hanafi'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Hanafiy (2x soya)
                </button>
                <button
                  onClick={() => setAsrMadhab('shafii')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    asrMadhab === 'shafii'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Shofeiy / Standart (1x)
                </button>
              </div>
            </div>

            {/* Calculation Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
                {loc('Hisoblash standarti (Metod)', 'Ҳисоблаш стандарти (Метод)')}
              </label>
              <select
                value={calculationMethod}
                onChange={(e) => setCalculationMethod(e.target.value as PrayerCalculationMethod)}
                className="w-full p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 outline-none"
              >
                {Object.entries(CALCULATION_METHODS_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {script === 'lat' ? cfg.nameLatin : cfg.nameCyrillic}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsMethodModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition"
            >
              {loc('Saqlash va qoʻllash', 'Сақлаш ва қўллаш')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
