import {
  GlobalCity,
  PrayerCalculationMethod,
  AsrMadhab,
  HighLatitudeRule,
  AccuratePrayerTimes,
} from './types';

// Method parameters configuration
export interface MethodParameters {
  nameLatin: string;
  nameCyrillic: string;
  fajrAngle: number;
  ishaAngle: number;
  ishaMinutesAfterMaghrib?: number;
  defaultMadhab: AsrMadhab;
  sunsetPrecautionMinutes?: number;
  fajrPrecautionMinutes?: number;
}

export const CALCULATION_METHODS_CONFIG: Record<PrayerCalculationMethod, MethodParameters> = {
  uzbekistan: {
    nameLatin: 'Oʻzbekiston Musulmonlari Idorasi (Hanafiy)',
    nameCyrillic: 'Ўзбекистон Мусулмонлари Идораси (Ҳанафий)',
    fajrAngle: 18.0,
    ishaAngle: 17.0,
    defaultMadhab: 'hanafi',
    sunsetPrecautionMinutes: 2,
    fajrPrecautionMinutes: 2,
  },
  mwl: {
    nameLatin: 'Muslim World League (Dunyo Islom Ligasi)',
    nameCyrillic: 'Muslim World League (Дунё Ислом Лигаси)',
    fajrAngle: 18.0,
    ishaAngle: 17.0,
    defaultMadhab: 'shafii',
  },
  makkah: {
    nameLatin: 'Umm Al-Qura University, Makkah',
    nameCyrillic: 'Умм ал-Қуро Университети, Макка',
    fajrAngle: 18.5,
    ishaAngle: 0,
    ishaMinutesAfterMaghrib: 90,
    defaultMadhab: 'shafii',
  },
  diyanet: {
    nameLatin: 'Turkiya Diyonat Islom Boshqarmasi',
    nameCyrillic: 'Туркия Диёнат Ислом Бошқармаси',
    fajrAngle: 18.0,
    ishaAngle: 17.0,
    defaultMadhab: 'hanafi',
    sunsetPrecautionMinutes: 2,
  },
  karachi: {
    nameLatin: 'University of Islamic Sciences, Karachi',
    nameCyrillic: 'Ислом Фанлари Университети, Карачи',
    fajrAngle: 18.0,
    ishaAngle: 18.0,
    defaultMadhab: 'hanafi',
  },
  isna: {
    nameLatin: 'Islamic Society of North America (ISNA)',
    nameCyrillic: 'Шимолий Америка Ислом Жамияти (ISNA)',
    fajrAngle: 15.0,
    ishaAngle: 15.0,
    defaultMadhab: 'shafii',
  },
  egypt: {
    nameLatin: 'Egyptian General Authority of Survey (Misr)',
    nameCyrillic: 'Миср Бош Геодезия Бошқармаси',
    fajrAngle: 19.5,
    ishaAngle: 17.5,
    defaultMadhab: 'shafii',
  },
  gulf: {
    nameLatin: 'Gulf Region / BAA Awqaf',
    nameCyrillic: 'Кўрфаз Минтақаси / БАА Авқоф',
    fajrAngle: 19.5,
    ishaAngle: 0,
    ishaMinutesAfterMaghrib: 90,
    defaultMadhab: 'shafii',
  },
  kuwait: {
    nameLatin: 'Quvayt Din Ishlari Vazirligi',
    nameCyrillic: 'Қувайт Дин Ишлари Вазирлиги',
    fajrAngle: 18.0,
    ishaAngle: 17.5,
    defaultMadhab: 'shafii',
  },
  qatar: {
    nameLatin: 'Qatar Davlati Taqvim Standarti',
    nameCyrillic: 'Қатар Давлати Тақвим Стандарти',
    fajrAngle: 18.0,
    ishaAngle: 0,
    ishaMinutesAfterMaghrib: 90,
    defaultMadhab: 'shafii',
  },
  singapore: {
    nameLatin: 'Majlis Ugama Islam Singapura (MUIS)',
    nameCyrillic: 'Сингапур Ислом Кенгаши (MUIS)',
    fajrAngle: 20.0,
    ishaAngle: 18.0,
    defaultMadhab: 'shafii',
  },
  russia: {
    nameLatin: 'Rossiya Musulmonlari Diniy Boshqarmasi',
    nameCyrillic: 'Россия Мусулмонлари Диний Бошқармаси',
    fajrAngle: 16.0,
    ishaAngle: 15.0,
    defaultMadhab: 'hanafi',
  },
  moonsighting: {
    nameLatin: 'Moonsighting Committee Worldwide',
    nameCyrillic: 'Ойни Кузатиш Қўмитаси (Moonsighting)',
    fajrAngle: 18.0,
    ishaAngle: 18.0,
    defaultMadhab: 'hanafi',
  },
};

// Math helper functions
const d2r = (d: number) => (d * Math.PI) / 180.0;
const r2d = (r: number) => (r * 180.0) / Math.PI;
const sinD = (d: number) => Math.sin(d2r(d));
const cosD = (d: number) => Math.cos(d2r(d));
const tanD = (d: number) => Math.tan(d2r(d));
const asinD = (x: number) => r2d(Math.asin(Math.max(-1, Math.min(1, x))));
const acosD = (x: number) => r2d(Math.acos(Math.max(-1, Math.min(1, x))));
const atan2D = (y: number, x: number) => r2d(Math.atan2(y, x));

function fixHour(hour: number): number {
  let h = hour - 24.0 * Math.floor(hour / 24.0);
  return h < 0 ? h + 24.0 : h;
}

function fixAngle(angle: number): number {
  let a = angle - 360.0 * Math.floor(angle / 360.0);
  return a < 0 ? a + 360.0 : a;
}

// Julian Date calculation
function getJulianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

// Solar position: declination & equation of time
function getSunPosition(jd: number): { declination: number; equationOfTime: number } {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * sinD(g) + 0.02 * sinD(2 * g));

  const e = 23.439 - 0.00000036 * D;
  const d = asinD(sinD(e) * sinD(L));

  let RA = atan2D(cosD(e) * sinD(L), cosD(L)) / 15.0;
  RA = fixHour(RA);

  const EqT = q / 15.0 - RA;
  return { declination: d, equationOfTime: EqT };
}

// Compute Qibla angle from coordinates to Kaaba (21.4225 N, 39.8262 E)
export function computeQiblaDirection(latitude: number, longitude: number): number {
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;

  const y = sinD(kaabaLng - longitude);
  const x = cosD(latitude) * tanD(kaabaLat) - sinD(latitude) * cosD(kaabaLng - longitude);
  let qibla = atan2D(y, x);
  return Math.round(fixAngle(qibla));
}

// Time offset for IANA timezone
function getTimezoneOffsetHours(timezone: string, date: Date): number {
  try {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (tzDate.getTime() - utcDate.getTime()) / 3600000;
  } catch {
    // Default fallback to +5 for Uzbekistan if parsing fails
    if (timezone.includes('Tashkent') || timezone.includes('Samarkand')) return 5;
    return 5;
  }
}

// Format fractional hours (e.g. 5.75) to "05:45"
function formatHourMinute(hours: number): string {
  const fixed = fixHour(hours);
  const totalMinutes = Math.round(fixed * 60);
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Islamic Hijri date approximation
export function getApproxHijriDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  let jd = getJulianDate(year, month, day);
  let l = jd - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  let m = Math.floor((24 * l) / 709);
  let d = l - Math.floor((709 * m) / 24);
  let y = 30 * n + j - 30;

  const hijriMonths = [
    'Muharram',
    'Safar',
    'Rabiul avval',
    'Rabiul oxir',
    'Jumadul avval',
    'Jumadul oxir',
    'Rajab',
    'Shaʼbon',
    'Ramazon',
    'Shavvol',
    'Zulqaʼda',
    'Zulhijja',
  ];

  return `${d} ${hijriMonths[m - 1] || 'Ramazon'}, ${y} hijriy`;
}

// Main calculation engine
export function calculateAccuratePrayerTimes(
  city: GlobalCity,
  date: Date = new Date(),
  customMethod?: PrayerCalculationMethod,
  customMadhab?: AsrMadhab
): AccuratePrayerTimes {
  const methodKey = customMethod || city.defaultMethod || 'uzbekistan';
  const madhabKey = customMadhab || city.defaultMadhab || 'hanafi';
  const methodParams = CALCULATION_METHODS_CONFIG[methodKey];

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = getJulianDate(year, month, day);
  const tzHours = getTimezoneOffsetHours(city.timezone, date);
  const { declination, equationOfTime } = getSunPosition(jd);

  // 1. Dhuhr (solar transit)
  const dhuhrHour = 12.0 + tzHours - city.longitude / 15.0 - equationOfTime;

  // 2. Sunrise & Sunset (center of sun is 50 arcminutes = 0.8333 degrees below horizon)
  const sunRadiusAngle = 0.8333;
  const cosSunriseHourAngle =
    (-sinD(sunRadiusAngle) - sinD(city.latitude) * sinD(declination)) /
    (cosD(city.latitude) * cosD(declination));

  let halfDayHour = 6.0; // fallback
  if (cosSunriseHourAngle >= -1.0 && cosSunriseHourAngle <= 1.0) {
    halfDayHour = acosD(cosSunriseHourAngle) / 15.0;
  }

  const sunriseHour = dhuhrHour - halfDayHour;
  let sunsetHour = dhuhrHour + halfDayHour;

  // Precautionary minute buffer for Maghrib if applicable
  if (methodParams.sunsetPrecautionMinutes) {
    sunsetHour += methodParams.sunsetPrecautionMinutes / 60.0;
  }

  // 3. Fajr (Bomdod)
  const cosFajrHourAngle =
    (-sinD(methodParams.fajrAngle) - sinD(city.latitude) * sinD(declination)) /
    (cosD(city.latitude) * cosD(declination));

  let fajrHourAngle = 6.0;
  if (cosFajrHourAngle >= -1.0 && cosFajrHourAngle <= 1.0) {
    fajrHourAngle = acosD(cosFajrHourAngle) / 15.0;
  } else {
    // High latitude adjustment (1/7 of night)
    fajrHourAngle = halfDayHour * 0.7;
  }

  let fajrHour = dhuhrHour - fajrHourAngle;
  if (methodParams.fajrPrecautionMinutes) {
    fajrHour -= methodParams.fajrPrecautionMinutes / 60.0;
  }

  // 4. Asr
  const shadowMultiplier = madhabKey === 'hanafi' ? 2.0 : 1.0;
  const asrAltitudeAngle = r2d(
    Math.atan(1.0 / (shadowMultiplier + Math.tan(d2r(Math.abs(city.latitude - declination)))))
  );

  const cosAsrHourAngle =
    (sinD(asrAltitudeAngle) - sinD(city.latitude) * sinD(declination)) /
    (cosD(city.latitude) * cosD(declination));

  let asrHourAngle = 3.5;
  if (cosAsrHourAngle >= -1.0 && cosAsrHourAngle <= 1.0) {
    asrHourAngle = acosD(cosAsrHourAngle) / 15.0;
  }

  const asrHour = dhuhrHour + asrHourAngle;

  // 5. Maghrib
  const maghribHour = sunsetHour;

  // 6. Isha (Xufton)
  let ishaHour = sunsetHour + 1.5;
  if (methodParams.ishaMinutesAfterMaghrib) {
    ishaHour = sunsetHour + methodParams.ishaMinutesAfterMaghrib / 60.0;
  } else {
    const cosIshaHourAngle =
      (-sinD(methodParams.ishaAngle) - sinD(city.latitude) * sinD(declination)) /
      (cosD(city.latitude) * cosD(declination));

    if (cosIshaHourAngle >= -1.0 && cosIshaHourAngle <= 1.0) {
      const ishaHourAngle = acosD(cosIshaHourAngle) / 15.0;
      ishaHour = dhuhrHour + ishaHourAngle;
    } else {
      ishaHour = sunsetHour + 1.5;
    }
  }

  const fajrStr = formatHourMinute(fajrHour);
  const sunriseStr = formatHourMinute(sunriseHour);
  const dhuhrStr = formatHourMinute(dhuhrHour);
  const asrStr = formatHourMinute(asrHour);
  const maghribStr = formatHourMinute(maghribHour);
  const ishaStr = formatHourMinute(ishaHour);

  // Compute next prayer and countdown relative to local timezone time
  const nowTz = new Date(date.toLocaleString('en-US', { timeZone: city.timezone }));
  const currentTotalMinutes = nowTz.getHours() * 60 + nowTz.getMinutes();

  const parseMins = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const prayersList: {
    key: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    nameLatin: string;
    nameCyrillic: string;
    mins: number;
    time: string;
  }[] = [
    { key: 'fajr', nameLatin: 'Bomdod', nameCyrillic: 'Бомдод', mins: parseMins(fajrStr), time: fajrStr },
    { key: 'sunrise', nameLatin: 'Quyosh', nameCyrillic: 'Қуёш', mins: parseMins(sunriseStr), time: sunriseStr },
    { key: 'dhuhr', nameLatin: 'Peshin', nameCyrillic: 'Пешин', mins: parseMins(dhuhrStr), time: dhuhrStr },
    { key: 'asr', nameLatin: 'Asr', nameCyrillic: 'Аср', mins: parseMins(asrStr), time: asrStr },
    { key: 'maghrib', nameLatin: 'Shom', nameCyrillic: 'Шом', mins: parseMins(maghribStr), time: maghribStr },
    { key: 'isha', nameLatin: 'Xufton', nameCyrillic: 'Хуфтон', mins: parseMins(ishaStr), time: ishaStr },
  ];

  let nextP = prayersList.find((p) => p.mins > currentTotalMinutes);
  let remainingMins = 0;

  if (!nextP) {
    // Past Isha, next is tomorrow's Fajr
    nextP = prayersList[0];
    remainingMins = 24 * 60 - currentTotalMinutes + nextP.mins;
  } else {
    remainingMins = nextP.mins - currentTotalMinutes;
  }

  const remHours = Math.floor(remainingMins / 60);
  const remMinutes = remainingMins % 60;
  const countdownTextLatin = remHours > 0 ? `${remHours} soat ${remMinutes} daqiqa` : `${remMinutes} daqiqa`;
  const countdownTextCyrillic = remHours > 0 ? `${remHours} соат ${remMinutes} дақиқа` : `${remMinutes} дақиқа`;

  const qiblaDeg = computeQiblaDirection(city.latitude, city.longitude);
  const yyyy = year.toString();
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');

  return {
    date: `${yyyy}-${mm}-${dd}`,
    formattedDate: `${dd}.${mm}.${yyyy}`,
    hijriDate: getApproxHijriDate(date),
    city: city.nameLatin,
    country: city.countryLatin,
    timezone: city.timezone,
    coordinates: { latitude: city.latitude, longitude: city.longitude },
    fajr: fajrStr,
    sunrise: sunriseStr,
    dhuhr: dhuhrStr,
    asr: asrStr,
    maghrib: maghribStr,
    isha: ishaStr,
    qiblaDegree: qiblaDeg,
    sourceType: city.isOfficialTimetableAvailable
      ? 'OFFICIAL_LOCAL_TIMETABLE'
      : 'CALCULATED_ASTRONOMICAL',
    sourceName: city.officialSource || methodParams.nameLatin,
    method: methodKey,
    madhab: madhabKey,
    nextPrayer: {
      key: nextP.key,
      nameLatin: nextP.nameLatin,
      nameCyrillic: nextP.nameCyrillic,
      time: nextP.time,
      remainingMinutes: remainingMins,
      countdownTextLatin,
      countdownTextCyrillic,
    },
  };
}

// Generate complete monthly calendar for a city
export function generateMonthlyCalendar(
  city: GlobalCity,
  year: number,
  month: number, // 1..12
  method?: PrayerCalculationMethod,
  madhab?: AsrMadhab
): AccuratePrayerTimes[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const schedule: AccuratePrayerTimes[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d, 12, 0, 0);
    schedule.push(calculateAccuratePrayerTimes(city, date, method, madhab));
  }

  return schedule;
}
