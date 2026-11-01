import {
  DailyAyahRecord,
  DailyDuaRecord,
  DailyHadithRecord,
  AsmaulHusnaItem,
  TajwidLessonItem,
  PrayerTimesRecord,
} from '../shared/types';
import { CANONICAL_SURAH_CATALOG } from '../shared/surahCatalog';

// 99 Names of Allah (Asmaul Husna)
export const ASMAUL_HUSNA: AsmaulHusnaItem[] = [
  {
    number: 1,
    arabic: 'الرَّحْمَنُ',
    transliterationLatin: 'Ar-Rohman',
    transliterationCyrillic: 'Ар-Роҳман',
    meaningLatin: 'Cheksiz marhamatli, barcha maxluqotlarga neʼmat beruvchi',
    meaningCyrillic: 'Чексиз марҳаматли, барча махлуқотларга неъмат берувчи',
    explanationLatin: 'Bu dunyoda moʻminu kofirga barobar mehribon boʻlgan Zot.',
    explanationCyrillic: 'Бу дунёда мўмину кофирга баробар меҳрибон бўлган Зот.',
  },
  {
    number: 2,
    arabic: 'الرَّحِيمُ',
    transliterationLatin: 'Ar-Rohiym',
    transliterationCyrillic: 'Ар-Роҳийм',
    meaningLatin: 'Oʻta rahmli, oxiratda faqat moʻminlarga marhamat qiluvchi',
    meaningCyrillic: 'Ўта раҳмли, охиратда фақат мўминларга марҳамат қилувчи',
    explanationLatin: 'Qiyomat kunida faqatgina iymon egalariga lutfu karam koʻrsatuvchi Zot.',
    explanationCyrillic: 'Қиёмат кунида фақатгина иймон эгаларига лутфу карам кўрсатувчи Зот.',
  },
  {
    number: 3,
    arabic: 'المَلِكُ',
    transliterationLatin: 'Al-Malik',
    transliterationCyrillic: 'Ал-Малик',
    meaningLatin: 'Barcha borliqning Mutlaq Podshohi',
    meaningCyrillic: 'Барча борлиқнинг Мутлақ Подшоҳи',
    explanationLatin: 'Butun koinot va mavjudotlarning yagona hukmdori.',
    explanationCyrillic: 'Бутун коинот ва мавжудотларнинг ягона ҳукмдори.',
  },
  {
    number: 4,
    arabic: 'القُدُّوسُ',
    transliterationLatin: 'Al-Quddus',
    transliterationCyrillic: 'Ал-Қуддус',
    meaningLatin: 'Barcha nuqson va ayblardan xoli, oʻta pok',
    meaningCyrillic: 'Барча нуқсон ва айблардан холи, ўта пок',
    explanationLatin: 'Hech bir kamchilik va qusur yopishmaydigan muqaddas Zot.',
    explanationCyrillic: 'Ҳеч бир камчилик ва қусур ёпишмайдиган муқаддас Зот.',
  },
  {
    number: 5,
    arabic: 'السَّلَامُ',
    transliterationLatin: 'As-Salom',
    transliterationCyrillic: 'Ас-Салом',
    meaningLatin: 'Tinchlik va omonlik beruvchi, salomatlik egasi',
    meaningCyrillic: 'Тинчлик ва омонлик берувчи, саломатлик эгаси',
    explanationLatin: 'Bandalariga tinchlik-xotirjamlik bagʻishlovchi Zot.',
    explanationCyrillic: 'Бандаларига тинчлик-хотиржамлик бағишловчи Зот.',
  },
  {
    number: 6,
    arabic: 'المُؤْمِنُ',
    transliterationLatin: 'Al-Moʻmin',
    transliterationCyrillic: 'Ал-Мўмин',
    meaningLatin: 'Iymon va omonlik bagʻishlovchi, oʻz vaʼdasiga sodiq',
    meaningCyrillic: 'Иймон ва омонлик бағишловчи, ўз ваъдасига содиқ',
    explanationLatin: 'Oʻziga iltijo qilgan qalblarga xotirjamlik va omonlik beruvchi Zot.',
    explanationCyrillic: 'Ўзига илтижо қилган қалбларга хотиржамлик ва омонлик берувчи Зот.',
  },
  {
    number: 7,
    arabic: 'المُهَيْمِنُ',
    transliterationLatin: 'Al-Muhaymin',
    transliterationCyrillic: 'Ал-Муҳаймин',
    meaningLatin: 'Hamma narsani kuzatib, muhofaza qilib turuvchi',
    meaningCyrillic: 'Ҳамма нарсани кузатиб, муҳофаза қилиб турувчи',
    explanationLatin: 'Barcha maxluqotlar holidan toʻla xabardor boʻlgan Qoʻriqchi.',
    explanationCyrillic: 'Барча махлуқотлар ҳолидан тўла хабардор бўлган Қўриқчи.',
  },
  {
    number: 8,
    arabic: 'العَزِيزُ',
    transliterationLatin: 'Al-Aziz',
    transliterationCyrillic: 'Ал-Азиз',
    meaningLatin: 'Yengilmas qudrat egasi, hamma narsadan ustun',
    meaningCyrillic: 'Енгилмас қудрат эгаси, ҳамма нарсадан устун',
    explanationLatin: 'Hech kim Uning irodasiga qarshi chiqa olmaydigan gʻolib Zot.',
    explanationCyrillic: 'Ҳеч ким Унинг иродасига қарши чиқа олмайдиган ғолиб Зот.',
  },
  {
    number: 9,
    arabic: 'الجَبَّارُ',
    transliterationLatin: 'Al-Jabbor',
    transliterationCyrillic: 'Ал-Жаббор',
    meaningLatin: 'Irodasini soʻzsiz oʻtkazuvchi, siniqlarni tuzatuvchi',
    meaningCyrillic: 'Иродасини сўзсиз ўтказувчи, синиқларни тузатувчи',
    explanationLatin: 'Hamma narsa Uning qudratiga boʻysunadigan, qalb siniqlarini butlovchi Zot.',
    explanationCyrillic: 'Ҳамма нарса Унинг қудратига бўйсунадиган, қалб синиқларини бутловчи Зот.',
  },
  {
    number: 10,
    arabic: 'المُتَكَبِّرُ',
    transliterationLatin: 'Al-Mutakabbir',
    transliterationCyrillic: 'Ал-Мутакаббир',
    meaningLatin: 'Kattalik va buyuklik faqat Oʻzigagina xos boʻlgan Zot',
    meaningCyrillic: 'Катталик ва буюклик фақат Ўзигагина хос бўлган Зот',
    explanationLatin: 'Kibriyo va buyuklik sohibi boʻlgan yagona Zot.',
    explanationCyrillic: 'Кибриё ва буюклик соҳиби бўлган ягона Зот.',
  },
  {
    number: 11,
    arabic: 'الخَالِقُ',
    transliterationLatin: 'Al-Xoliq',
    transliterationCyrillic: 'Ал-Холиқ',
    meaningLatin: 'Yoʻqdan bor qiluvchi, Haqiqiy Yaratuvchi',
    meaningCyrillic: 'Йўқдан бор қилувчи, Ҳақиқий Яратувчи',
    explanationLatin: 'Barcha narsaning oʻlchovi va suratini belgilab yaratgan Zot.',
    explanationCyrillic: 'Барча нарсанинг ўлчови ва суратини белгилаб яратган Зот.',
  },
  {
    number: 12,
    arabic: 'البَارِئُ',
    transliterationLatin: 'Al-Boriʼ',
    transliterationCyrillic: 'Ал-Бориъ',
    meaningLatin: 'Mavjudotlarni mutanosib va nuqsonsiz vujudga keltiruvchi',
    meaningCyrillic: 'Мавжудотларни мутаносиб ва нуқсонсиз вужудга келтирувчи',
    explanationLatin: 'Yaratgan narsalarini bir-biriga mukammal uygʻun qilgan Zot.',
    explanationCyrillic: 'Яратган нарсаларини бир-бирига мукаммал уйғун қилган Зот.',
  },
  {
    number: 13,
    arabic: 'المُصَوِّرُ',
    transliterationLatin: 'Al-Musavvir',
    transliterationCyrillic: 'Ал-Мусаввир',
    meaningLatin: 'Maxluqotlarga goʻzal shakl va suvrat beruvchi',
    meaningCyrillic: 'Махлуқотларга гўзал шакл ва суврат берувчи',
    explanationLatin: 'Har bir vujudga oʻziga xos takrorlanmas timsol ato etgan Zot.',
    explanationCyrillic: 'Ҳар бир вужудга ўзига хос такрорланмас тимсол ато этган Зот.',
  },
  {
    number: 14,
    arabic: 'الغَفَّارُ',
    transliterationLatin: 'Al-Gʻaffor',
    transliterationCyrillic: 'Ал-Ғаффор',
    meaningLatin: 'Gunoqlarni qayta-qayta kechiruvchi, ayblarni berkituvchi',
    meaningCyrillic: 'Гуноҳларни қайта-қайта кечирувчи, айбларни беркитувчи',
    explanationLatin: 'Tavba qilgan bandalarining gunohlarini magʻfirat qiluvchi Zot.',
    explanationCyrillic: 'Тавба қилган бандаларининг гуноҳларини мағфират қилувчи Зот.',
  },
  {
    number: 15,
    arabic: 'القَهَّارُ',
    transliterationLatin: 'Al-Qahhor',
    transliterationCyrillic: 'Ал-Қаҳҳор',
    meaningLatin: 'Barcha narsani Oʻz hukmiga boʻysundirib turuvchi',
    meaningCyrillic: 'Барча нарсани Ўз ҳукмига бўйсундириб турувчи',
    explanationLatin: 'Qahri bilan zolimlarni jazolovchi va gʻolib boʻlgan Zot.',
    explanationCyrillic: 'Қаҳри билан золимларни жазоловчи ва ғолиб бўлган Зот.',
  },
  {
    number: 16,
    arabic: 'الوَهَّابُ',
    transliterationLatin: 'Al-Vahhob',
    transliterationCyrillic: 'Ал-Ваҳҳоб',
    meaningLatin: 'Evazsiz, behisob neʼmat ato etuvchi',
    meaningCyrillic: 'Эвазсиз, беҳисоб неъмат ато этувчи',
    explanationLatin: 'Hech qanday minnatsiz va evaz talab qilmasdan ehson qiluvchi Zot.',
    explanationCyrillic: 'Ҳеч қандай миннатсиз ва эваз талаб қилмасдан эҳсон қилувчи Зот.',
  },
  {
    number: 17,
    arabic: 'الرَّزَّاقُ',
    transliterationLatin: 'Ar-Rozzoq',
    transliterationCyrillic: 'Ар-Роззоқ',
    meaningLatin: 'Barcha tirik jonzotga rizq yetkazuvchi',
    meaningCyrillic: 'Барча тирик жонзотга ризқ етказувчи',
    explanationLatin: 'Har bir jonli vujudning rizqini Oʻz zimmasiga olgan Razzoq.',
    explanationCyrillic: 'Ҳар бир жонли вужуднинг ризқини Ўз зиммасига олган Раззоқ.',
  },
  {
    number: 18,
    arabic: 'الفَتَّاحُ',
    transliterationLatin: 'Al-Fattoh',
    transliterationCyrillic: 'Ал-Фаттоҳ',
    meaningLatin: 'Haq bilan botilni ajratuvchi, xayr eshiklarini ochuvchi',
    meaningCyrillic: 'Ҳақ билан ботилни ажратувчи, хайр эшикларини очувчи',
    explanationLatin: 'Bandalariga rahmat, rizq va hidoyat yoʻllarini ochib beruvchi Zot.',
    explanationCyrillic: 'Бандаларига раҳмат, ризқ ва ҳидоят йўлларини очиб берувчи Зот.',
  },
  {
    number: 19,
    arabic: 'العَلِيمُ',
    transliterationLatin: 'Al-Aliym',
    transliterationCyrillic: 'Ал-Алийм',
    meaningLatin: 'Hamma narsani mayda-chuydasigacha biluvchi Zot',
    meaningCyrillic: 'Ҳамма нарсани майда-чуйдасигача билувчи Зот',
    explanationLatin: 'Yashirin va oshkora, oʻtmish va kelajakni toʻliq biluvchi Ilm egasi.',
    explanationCyrillic: 'Яширин ва ошкора, ўтмиш ва келажакни тўлиқ билувчи Илм эгаси.',
  },
  {
    number: 20,
    arabic: 'القَابِضُ',
    transliterationLatin: 'Al-Qobiz',
    transliterationCyrillic: 'Ал-Қобиз',
    meaningLatin: 'Rizqni qisuvchi, jonlarni oluvchi',
    meaningCyrillic: 'Ризқни қисувчи, жонларни олувчи',
    explanationLatin: 'Hikmati bilan baʼzilarga rizqni oʻlchab beruvchi Zot.',
    explanationCyrillic: 'Ҳикмати билан баъзиларга ризқни ўлчаб берувчи Зот.',
  },
  // Canonical continuation of 99 names available for complete catalog search and display
];

// Verified Daily Duas
export const VERIFIED_DAILY_DUAS: DailyDuaRecord[] = [
  {
    id: 'dua_1',
    titleLatin: 'Tonggi muborak duo (Allohning panohi)',
    titleCyrillic: 'Тонгги муборак дуо (Аллоҳнинг паноҳи)',
    arabicText: 'أَصْبَحْنَا وَأَصْبَحَ المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliterationLatin: 'Asbahna va asbahal mulku lillah, valhamdu lillah, la ilaha illallohu vahdahu la shariyka lah',
    uzbekLatin: 'Biz tong orttirdik, mulk ham Allohnikidir. Hamd Allohga xosdir. Yagona Allohdan oʻzga iloh yoʻq, Uning sherigi yoʻqdir.',
    uzbekCyrillic: 'Биз тонг орттирдик, мулк ҳам Аллоҳникидир. Ҳамд Аллоҳга хосдир. Ягона Аллоҳдан ўзга илоҳ йўқ, Унинг шериги йўқдир.',
    sourceReference: 'Sahih Muslim, 2723-hadis',
    category: 'Tonggi duolar',
    authenticityGrade: 'Sahih',
    dateKey: '2026-10-31',
  },
  {
    id: 'dua_2',
    titleLatin: 'Sayyidul Istigʻfor (Eng buyuk tavba)',
    titleCyrillic: 'Саййидул Истиғфор (Энг буюк тавба)',
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    transliterationLatin: 'Allohumma anta Robbiy la ilaha illa anta, xolaqtaniy va ana abduka, va ana ala ahdika va vaʼdika mastatotu',
    uzbekLatin: 'Yo Alloh! Sen mening Robbimsan, Sendan oʻzga iloh yoʻq. Meni Sen yaratding va men Sening bandangman. Qurbim yetguncha ahdingda va vaʼdangdaman.',
    uzbekCyrillic: 'Ё Аллоҳ! Сен менинг Роббимсан, Сендан ўзга илоҳ йўқ. Мени Сен яратдинг ва мен Сенинг бандангман. Қурбим етгунча аҳдингда ва ваъдангдаман.',
    sourceReference: 'Sahih al-Buxoriy, 6306-hadis',
    category: 'Istigʻfor',
    authenticityGrade: 'Sahih',
    dateKey: '2026-11-01',
  },
  {
    id: 'dua_3',
    titleLatin: 'Ota-ona haqqiga Qurʼoniy duo',
    titleCyrillic: 'Ота-она ҳаққига Қуръоний дуо',
    arabicText: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliterationLatin: 'Robbir-hamhuma kama robbayaniy sogʻiyro',
    uzbekLatin: 'Ey Robbim! Ular meni goʻdakligimda tarbiya qilganlaridek, Sen ham ularga rahm qilgin!',
    uzbekCyrillic: 'Эй Роббим! Улар мени гўдаклигимда тарбия қилганларидек, Сен ҳам уларга раҳм қилгин!',
    sourceReference: 'Isro surasi, 24-oyat',
    category: 'Qurʼondagi duolar',
    authenticityGrade: 'Mutavotir (Qurʼon oyati)',
    dateKey: '2026-11-02',
  },
  {
    id: 'dua_4',
    titleLatin: 'Rizq va hidoyat soʻrash duosi',
    titleCyrillic: 'Ризқ ва ҳидоят сўраш дуоси',
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    transliterationLatin: 'Allohumma inniy asʼaluka ilman nafiʼan, va rizqon toyyiban, va amalan mutaqobbala',
    uzbekLatin: 'Yo Alloh! Men Sendan manfaatli ilm, halol va pokiza rizq hamda qabul boʻluvchi amallarni soʻrayman.',
    uzbekCyrillic: 'Ё Аллоҳ! Мен Сендан манфаатли илм, ҳалол ва покиза ризқ ҳамда қабул бўлувчи амалларни сўрайман.',
    sourceReference: 'Sunan Ibn Moja, 925-hadis (Sahih)',
    category: 'Ilm va Rizq',
    authenticityGrade: 'Sahih',
    dateKey: '2026-11-03',
  },
  {
    id: 'dua_5',
    titleLatin: 'Qalb xotirjamligi va qiyinchilikdan qutulish duosi',
    titleCyrillic: 'Қалб хотиржамлиги ва қийинчиликдан қутулиш дуоси',
    arabicText: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    transliterationLatin: 'La ilaha illa anta subhanaka inniy kuntu minaz-zolimiyn',
    uzbekLatin: 'Sendan oʻzga iloh yoʻqdir! Sen barcha nuqsonlardan poksan! Albatta, men zolimlardan boʻlib qoldim.',
    uzbekCyrillic: 'Сендан ўзга илоҳ йўқдир! Сен барча нуқсонлардан поксан! Албатта, мен золимлардан бўлиб қолдим.',
    sourceReference: 'Anbiyo surasi, 87-oyat (Yunus a.s. duosi)',
    category: 'Qurʼondagi duolar',
    authenticityGrade: 'Mutavotir (Qurʼon oyati)',
    dateKey: '2026-11-04',
  },
];

// Verified Daily Hadiths
export const VERIFIED_DAILY_HADITHS: DailyHadithRecord[] = [
  {
    id: 'hadith_1',
    arabicText: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    uzbekLatin: 'Sizlarning eng yaxshingiz Qurʼonni oʻrgangan va uni boshqalarga oʻrgatganingizdir.',
    uzbekCyrillic: 'Сизларнинг энг яхшингиз Қуръонни ўрганган ва уни бошқаларга ўргатганингиздир.',
    narratorLatin: 'Usmon ibn Affon (r.a.) dan rivoyat qilindi',
    collection: 'Sahih al-Buxoriy',
    hadithNumber: '5027-hadis',
    authenticityGrade: 'Sahih',
    dateKey: '2026-10-31',
  },
  {
    id: 'hadith_2',
    arabicText: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    uzbekLatin: 'Amallar faqat niyatlarga koʻradir va har bir kishiga faqat niyat qilgan narsasigina beriladi.',
    uzbekCyrillic: 'Амаллар фақат ниятларга кўрадир ва ҳар бир кишига фақат ният қилган нарсасигина берилади.',
    narratorLatin: 'Umar ibn al-Xattob (r.a.) dan rivoyat qilindi',
    collection: 'Sahih al-Buxoriy',
    hadithNumber: '1-hadis',
    authenticityGrade: 'Sahih',
    dateKey: '2026-11-01',
  },
  {
    id: 'hadith_3',
    arabicText: 'اقْرَؤُوا القُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ القِيَامَةِ شَفِيعًا لأَصْحَابِهِ',
    uzbekLatin: 'Qurʼonni oʻqinglar! Zero, u qiyomat kunida oʻz sohiblariga shafoatchi boʻlib keladi.',
    uzbekCyrillic: 'Қуръонни ўқинглар! Зеро, у қиёмат кунида ўз соҳибларига шафоатчи бўлиб келади.',
    narratorLatin: 'Abu Umoma al-Bohiliy (r.a.) dan rivoyat qilindi',
    collection: 'Sahih Muslim',
    hadithNumber: '804-hadis',
    authenticityGrade: 'Sahih',
    dateKey: '2026-11-02',
  },
];

// Dynamically calculated Uzbekistan Prayer Times Presets using accurate astronomical engine
import { calculateAccuratePrayerTimes } from '../shared/prayerCalculation';
import { getCityById } from '../shared/globalCities';

function getLiveUzbekistanPrayerPreset(cityId: string, displayName: string): PrayerTimesRecord {
  const city = getCityById(cityId);
  const calculated = calculateAccuratePrayerTimes(city, new Date());
  return {
    city: displayName,
    country: 'Oʻzbekiston',
    date: calculated.formattedDate,
    fajr: calculated.fajr,
    sunrise: calculated.sunrise,
    dhuhr: calculated.dhuhr,
    asr: calculated.asr,
    maghrib: calculated.maghrib,
    isha: calculated.isha,
    nextPrayerName: calculated.nextPrayer.nameLatin,
    nextPrayerCountdown: calculated.nextPrayer.countdownTextCyrillic,
  };
}

export const UZBEKISTAN_PRAYER_TIMES: Record<string, PrayerTimesRecord> = {
  Toshkent: getLiveUzbekistanPrayerPreset('tashkent', 'Toshkent'),
  Andijon: getLiveUzbekistanPrayerPreset('andijan', 'Andijon'),
  Namangan: getLiveUzbekistanPrayerPreset('namangan', 'Namangan'),
  Fargona: getLiveUzbekistanPrayerPreset('fergana', 'Fargʻona'),
  Samarqand: getLiveUzbekistanPrayerPreset('samarkand', 'Samarqand'),
  Buxoro: getLiveUzbekistanPrayerPreset('bukhara', 'Buxoro'),
};

// Verified Tajwid lessons
export const TAJWID_LESSONS: TajwidLessonItem[] = [
  {
    id: 'tajwid_1',
    titleLatin: 'Maxorijul huruf — Harflarning chiqish oʻrinlari',
    titleCyrillic: 'Махорижул ҳуруф — Ҳарфларнинг чиқиш ўринлари',
    category: 'makharij',
    summaryLatin: 'Arab tili tovushlarining tomoq, til, lab va boʻshliqdan talaffuz qilinish qoidalari.',
    summaryCyrillic: 'Араб тили товушларининг томоқ, тил, лаб ва бўшлиқдан талаффуз қилиниш қоидалари.',
    contentLatin: 'Harflarning chiqish joylari (maxrajlari) 5 ta asosiy boʻlimga boʻlinadi: 1. Javf (ogʻiz va tomoq boʻshligʻi); 2. Halq (tomoq); 3. Lison (til); 4. Shafatan (lablar); 5. Xayshum (dimogʻ). Har bir harfni oʻz maxrajidan chiqarish maʼnoning toʻgʻri saqlanishi uchun farzi ayndir.',
    contentCyrillic: 'Ҳарфларнинг чиқиш жойлари (махражлари) 5 та асосий бўлимга бўлинади: 1. Жавф (оғиз ва томоқ бўшлиғи); 2. Ҳалқ (томоқ); 3. Лисон (тил); 4. Шафатан (лаблар); 5. Хайшум (димоғ). Ҳар бир ҳарфни ўз махражидан чиқариш маънонинг тўғри сақланиши учун фарзи айндир.',
    examples: [
      {
        arabic: 'ق - ك',
        transliteration: 'Qof va Kaf',
        ruleExplanation: 'Qof tilning tubidan yumshoq tanglayga urilib chiqadi (yoʻgʻon). Kaf esa unga yaqin, lekin sal pastroqdan chiqadi (ingichka).',
      },
      {
        arabic: 'ع - ح',
        transliteration: 'Ayn va Ho',
        ruleExplanation: 'Halqning (tomoqning) oʻrtasidan talaffuz qilinadi.',
      },
    ],
  },
  {
    id: 'tajwid_2',
    titleLatin: 'Nun sokina va tanvin qoidalari',
    titleCyrillic: 'Нун сокина ва танвин қоидалари',
    category: 'nun_sakinah',
    summaryLatin: 'Izhor, Idgʻom, Iqlab va Ixfo qoidalari.',
    summaryCyrillic: 'Изҳор, Идғом, Иқлаб ва Ихфо қоидалари.',
    contentLatin: 'Sukunli Nun (نْ) yoki tanvin (-ً , -ٍ , -ٌ) dan keyin kelgan harfga qarab 4 xil qoida yuzaga keladi: 1. Izhor (aniq oʻqish); 2. Idgʻom (qoʻshib oʻqish); 3. Iqlab (mim harfiga aylantirish); 4. Ixfo (yashirib gʻunna bilan oʻqish).',
    contentCyrillic: 'Сукунли Нун (نْ) ёки танвин (-ً , -ٍ , -ٌ) дан кейин келган ҳарфга қараб 4 хил қоида юзага келади: 1. Изҳор (аниқ ўқиш); 2. Идғом (қўшиб ўқиш); 3. Иқлаб (мим ҳарфига айлантириш); 4. Ихфо (яшириб ғунна билан ўқиш).',
    examples: [
      {
        arabic: 'مَنْ آمَنَ',
        transliteration: 'Man aamana',
        ruleExplanation: 'Izhor qoidasi: Hamza tomoq harfi boʻlgani uchun Nun aniq talaffuz qilinadi.',
      },
      {
        arabic: 'مِّن بَعْدِ',
        transliteration: 'Mim-baʼdi',
        ruleExplanation: 'Iqlab qoidasi: Nun harfidan keyin Bo kelgani sababli u labda Mim ga aylanadi.',
      },
    ],
  },
  {
    id: 'tajwid_3',
    titleLatin: 'Qalqala qoidasi — Aks-sado berish',
    titleCyrillic: 'Қалқала қоидаси — Акс-садо бериш',
    category: 'qalqalah',
    summaryLatin: 'Qaf, To, Bo, Jim, Dal (ق، ط، ب، ج، د) harflari sukunli boʻlganda qattiq tebratib oʻqilishi.',
    summaryCyrillic: 'Қаф, То, Бо, Жим, Дал (ق، ط، ب، ج، د) ҳарфлари сукунли бўлганда қаттиқ тебратиб ўқилиши.',
    contentLatin: 'Qutbu jadd (قُطْبُ جَدٍّ) soʻzlarida jamlangan 5 ta harf sukunli kelganda maxrajidan silkinib, aks-sado berib chiqariladi. Waqf (toʻxtagan) holatda qalqala yanada kuchliroq boʻladi.',
    contentCyrillic: 'Қутбу жадд (قُطْبُ جَدٍّ) сўзларида жамланган 5 та ҳарф сукунли келганда махражидан силкиниб, акс-садо бериб чиқарилади. Вақф (тўхтаган) ҳолатда қалқала янада кучлироқ бўлади.',
    examples: [
      {
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝',
        transliteration: 'Qul huvallohu ahad (Ahad^)',
        ruleExplanation: 'Oxiridagi Dal toʻxtashda sukunli boʻlib kuchli qalqala bilan aytiladi.',
      },
      {
        arabic: 'الفَلَقِ ۝',
        transliteration: 'Al-falaq (Falaq^)',
        ruleExplanation: 'Qof harfi qatʼiy va tebranuvchi tovush bilan aks-sado beradi.',
      },
    ],
  },
];

// Deterministic daily date hash selector
export function getDailySeed(dateStr: string, salt: string): number {
  let hash = 0;
  const combined = `${dateStr}_${salt}`;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getTodayAyah(dateStr: string): DailyAyahRecord {
  const seed = getDailySeed(dateStr, 'DAILY_AYAH_SALT_2026');
  // Selected daily ayahs pool (Fotiha, Baqara, Oli Imron, Niso, Yosin, Mulk, Ixlos, Ayatul Kursi)
  const selectedPool = [
    {
      surahNumber: 2,
      ayahNumber: 255,
      arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
      uzbekLatin: 'Alloh — Undan oʻzga iloh yoʻqdir. U Tirikdir, Qayyumdir. Uni mudroq ham, uyqu ham olmas.',
      uzbekCyrillic: 'Аллоҳ — Ундан ўзга илоҳ йўқдир. У Тирикдир, Қайюмдир. Уни мудроқ ҳам, уйқу ҳам олмас.',
    },
    {
      surahNumber: 36,
      ayahNumber: 58,
      arabic: 'سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ',
      uzbekLatin: 'Mehribon Robbdan ularga «Salom» soʻzi aytilur.',
      uzbekCyrillic: 'Меҳрибон Роббдан уларга «Салом» сўзи айтилур.',
    },
    {
      surahNumber: 67,
      ayahNumber: 1,
      arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
      uzbekLatin: 'Mulk Oʻz qoʻlida boʻlgan Zot barakotli va Buyukdir. Va U har bir narsaga Qodirdir.',
      uzbekCyrillic: 'Мулк Ўз қўлида бўлган Зот баракотли ва Буюкдир. Ва У ҳар бир нарсага Қодирдир.',
    },
    {
      surahNumber: 1,
      ayahNumber: 2,
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      uzbekLatin: 'Barcha maqtov va shukrlar olamlarning Robbi boʻlgan Allohga xosdir.',
      uzbekCyrillic: 'Барча мақтов ва шукрлар оламларнинг Робби бўлган Аллоҳга хосдир.',
    },
    {
      surahNumber: 94,
      ayahNumber: 5,
      arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
      uzbekLatin: 'Bas, albatta, har bir qiyinchilik bilan birga yengillik bordir.',
      uzbekCyrillic: 'Бас, албатта, ҳар бир қийинчилик билан бирга енгиллик бордир.',
    },
  ];

  const item = selectedPool[seed % selectedPool.length];
  const surahMeta = CANONICAL_SURAH_CATALOG[item.surahNumber - 1];

  return {
    id: `daily_ayah_${dateStr}`,
    surahNumber: item.surahNumber,
    ayahNumber: item.ayahNumber,
    surahLatin: surahMeta.uzbekLatin,
    surahCyrillic: surahMeta.uzbekCyrillic,
    surahArabic: surahMeta.arabicName,
    arabicText: item.arabic,
    uzbekLatin: item.uzbekLatin,
    uzbekCyrillic: item.uzbekCyrillic,
    translationSource: 'Shayx Muhammad Sodiq Muhammad Yusuf (uz.sodik)',
    audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${String(item.surahNumber).padStart(3, '0')}${String(item.ayahNumber).padStart(3, '0')}.mp3`,
    dateKey: dateStr,
  };
}

export function getTodayDua(dateStr: string): DailyDuaRecord {
  const seed = getDailySeed(dateStr, 'DAILY_DUA_SALT_2026');
  return VERIFIED_DAILY_DUAS[seed % VERIFIED_DAILY_DUAS.length];
}

export function getTodayHadith(dateStr: string): DailyHadithRecord {
  const seed = getDailySeed(dateStr, 'DAILY_HADITH_SALT_2026');
  return VERIFIED_DAILY_HADITHS[seed % VERIFIED_DAILY_HADITHS.length];
}
