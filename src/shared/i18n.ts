import type { UzbekScript } from './types';
import { cyrillicToLatin, latinToCyrillic } from './uzbekScript';

export const UI_STRINGS = {
  appName: { lat: 'QUR’ON APP', cyr: 'ҚУРЪОН АПП' },
  navHome: { lat: 'Bosh sahifa', cyr: 'Бош саҳифа' },
  navQuran: { lat: 'Qurʼon', cyr: 'Қуръон' },
  navAudio: { lat: 'Audio', cyr: 'Аудио' },
  navReciters: { lat: 'Qorilar', cyr: 'Қорилар' },
  navVideos: { lat: 'Video', cyr: 'Видео' },
  navDownloads: { lat: 'Yuklab olinganlar', cyr: 'Юклаб олинганлар' },
  navSaved: { lat: 'Saqlanganlar', cyr: 'Сақланганлар' },
  navSettings: { lat: 'Sozlamalar', cyr: 'Созламалар' },
  navAbout: { lat: 'Maʼlumot', cyr: 'Маълумот' },
  navAdmin: { lat: 'Boshqaruv', cyr: 'Бошқарув' },
  ctaReadQuran: { lat: 'Qurʼon oʻqish', cyr: 'Қуръон ўқиш' },
  modeLight: { lat: 'Kun', cyr: 'Кун' },
  modeDark: { lat: 'Tun', cyr: 'Тун' },
  scriptLatin: { lat: 'Lotin', cyr: 'Лотин' },
  scriptCyrillic: { lat: 'Кирилл', cyr: 'Кирилл' },
  installApp: { lat: 'Ilovani oʻrnatish', cyr: 'Иловани ўрнатиш' },
  offlineBanner: {
    lat: 'Oflayn rejim — keshdagi suralar va yuklab olingan audiolar ishlamoqda',
    cyr: 'Офлайн режим — кешдаги суралар ва юклаб олинган аудиолар ишламоқда',
  },
  heroKicker: {
    lat: '114 sura · 6 236 oyat · Usmoniy mushaf va tasdiqlangan oʻzbekcha tarjima',
    cyr: '114 сура · 6 236 оят · Усмоний мусҳаф ва тасдиқланган ўзбекча таржима',
  },
  heroTitle: {
    lat: 'Muqaddas Qurʼoni Karim mutolaasi va tasdiqlangan tilovatlar maskani',
    cyr: 'Муқаддас Қуръони Карим мутолааси ва тасдиқланган тиловатлар маскани',
  },
  heroDesc: {
    lat: 'Asl Usmoniy yozuvidagi Qurʼoni Karim matni, Shayx Muhammad Sodiq Muhammad Yusuf hazratlarining maʼnolar tarjimasi hamda Shayx Mishariy Roshid Alafasy tomonidan oʻqilgan toʻliq 114 sura audio toʻplami.',
    cyr: 'Асл Усмоний ёзувидаги Қуръони Карим матни, Шайх Муҳаммад Содиқ Муҳаммад Юсуф ҳазратларининг маънолар таржимаси ҳамда Шайх Мишарий Рошид Алафасий томонидан ўқилган тўлиқ 114 сура аудио тўплами.',
  },
  searchPlaceholder: {
    lat: 'Sura nomi, raqami, oyat (masalan, 2:255) yoki kalit soʻz qidiring...',
    cyr: 'Сура номи, рақами, оят (масалан, 2:255) ёки калит сўз қидиринг...',
  },
  continueReading: { lat: 'Mutolaani davom ettirish', cyr: 'Мутолаани давом эттириш' },
  continueListening: { lat: 'Tinglashni davom ettirish', cyr: 'Тинглашни давом эттириш' },
  featuredSurahToday: { lat: 'Kun surasi', cyr: 'Кун сураси' },
  featuredReciter: { lat: 'Asosiy tasdiqlangan qori', cyr: 'Асосий тасдиқланган қори' },
  all114Surahs: { lat: 'Barcha 114 ta sura', cyr: 'Барча 114 та сура' },
  ayahUnit: { lat: 'oyat', cyr: 'оят' },
  juzUnit: { lat: 'juz', cyr: 'жуз' },
  makkiy: { lat: 'Makkiy', cyr: 'Маккий' },
  madaniy: { lat: 'Madaniy', cyr: 'Маданий' },
  listenSurah: { lat: 'Surani tinglash', cyr: 'Сурани тинглаш' },
  readSurah: { lat: 'Surani oʻqish', cyr: 'Сурани ўқиш' },
  downloadOffline: { lat: 'Oflayn yuklash', cyr: 'Офлайн юклаш' },
  downloadedReady: { lat: 'Oflayn mavjud', cyr: 'Офлайн мавжуд' },
  verifyCollection: { lat: '114 sura tekshiruvi', cyr: '114 сура текшируви' },
} as const;

export type UIStringKey = keyof typeof UI_STRINGS;

export function getUIString(key: UIStringKey, script: UzbekScript): string {
  return UI_STRINGS[key][script];
}

export function localizeText(script: UzbekScript, latinText: string, cyrillicText?: string): string {
  if (script === 'lat') {
    return latinText || (cyrillicText ? cyrillicToLatin(cyrillicText) : '');
  }
  return cyrillicText || latinToCyrillic(latinText);
}
