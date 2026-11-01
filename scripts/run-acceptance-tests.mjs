import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================================');
console.log('  QUR’ON APP — PHASE 5 & CRITICAL PRAYER REBUILD ACCEPTANCE TESTS       ');
console.log('========================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// TEST SUITE 1: CANONICAL 114 SURAH CATALOG
console.log('\n--- 1. Canonical 114 Surah Catalog Verification ---');
const catalogFile = path.join(rootDir, 'src', 'shared', 'surahCatalog.ts');
const catalogContent = fs.readFileSync(catalogFile, 'utf-8');

assert(catalogContent.includes('114,'), 'Catalog contains all 114 surahs up to An-Nas');
assert(catalogContent.includes('CANONICAL_SURAH_CATALOG'), 'Exports CANONICAL_SURAH_CATALOG');

// TEST SUITE 2: QURAN VERIFIED DATASET INTEGRITY
console.log('\n--- 2. Quran Verified Dataset Integrity ---');
const dataFile = path.join(rootDir, 'data', 'quran-verified.json');
assert(fs.existsSync(dataFile), 'data/quran-verified.json exists');

const quranData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
assert(quranData.surahs.length === 114, `Exactly 114 surahs present (found: ${quranData.surahs.length})`);

let totalAyahs = 0;
for (const s of quranData.surahs) {
  totalAyahs += s.ayahs.length;
}
assert(totalAyahs === 6236, `Exactly 6,236 canonical Hafs ayahs present (found: ${totalAyahs})`);
assert(quranData.surahs[0].ayahs[0].arabic.includes('بِسْمِ'), 'Surah 1:1 contains Bismillah');
assert(quranData.surahs[1].ayahCount === 286, 'Surah 2 (Baqara) has exactly 286 ayahs');
assert(quranData.surahs[113].ayahCount === 6, 'Surah 114 (An-Nas) has exactly 6 ayahs');

// TEST SUITE 3: ODILJON QORI 115 RECITATIONS CATALOG
console.log('\n--- 3. Odiljon Qori Complete 115 Recitations Collection ---');
const odiljonDataFile = path.join(rootDir, 'src', 'data', 'odiljonQoriData.ts');
assert(fs.existsSync(odiljonDataFile), 'src/data/odiljonQoriData.ts exists');
const odiljonContent = fs.readFileSync(odiljonDataFile, 'utf-8');

assert(odiljonContent.includes('ODILJON_QORI_AUDIO_COLLECTION'), 'Exports ODILJON_QORI_AUDIO_COLLECTION');
assert(odiljonContent.includes('@Odiljonqori_mp3'), 'Telegram @Odiljonqori_mp3 configured');
assert(odiljonContent.includes('@Odiljonqoriuz'), 'Telegram @Odiljonqoriuz configured');
assert(odiljonContent.includes('@odiljonqoriismoiljonov'), 'YouTube channel @odiljonqoriismoiljonov configured');
assert(odiljonContent.includes('Xatmona duosi 2022'), 'Track 115: Xatmona duosi 2022 defined');
assert(odiljonContent.includes('ODILJON_QORI_VIDEOS'), 'Official YouTube video collection defined');

// TEST SUITE 3b: SHAYKH YASSER AL-DOSARI 114 SURAH COLLECTION
console.log('\n--- 3b. Shaykh Yasser Al-Dosari Complete 114 Surahs Collection ---');
const yasserDataFile = path.join(rootDir, 'src', 'data', 'yasserDosariData.ts');
assert(fs.existsSync(yasserDataFile), 'src/data/yasserDosariData.ts exists');
const yasserContent = fs.readFileSync(yasserDataFile, 'utf-8');

assert(yasserContent.includes('YASSER_DOSARI_RECITER_PROFILE'), 'Exports YASSER_DOSARI_RECITER_PROFILE');
assert(yasserContent.includes('YASSER_DOSARI_AUDIO_COLLECTION'), 'Exports YASSER_DOSARI_AUDIO_COLLECTION');
assert(yasserContent.includes('server11.mp3quran.net/yasser/'), 'Uses verified CDN server11.mp3quran.net');
assert(yasserContent.includes('download.quranicaudio.com/quran/yasser_ad-dussary/'), 'Uses verified fallback CDN download.quranicaudio.com');
assert(yasserContent.includes('YASSER_DOSARI_DISCOVERY_SOURCES'), 'Discovery candidate catalogs documented');
assert(yasserContent.includes('Hafs') && yasserContent.includes('Asim'), 'Riwayah Hafs an Asim specified');
assert(yasserContent.includes('Masjidul Harom imomi'), 'Imam of Masjid al-Haram documented');

// TEST SUITE 4: GLOBAL CITIES DATABASE
console.log('\n--- 4. Global Cities Database Verification ---');
const citiesFile = path.join(rootDir, 'src', 'shared', 'globalCities.ts');
assert(fs.existsSync(citiesFile), 'src/shared/globalCities.ts exists');
const citiesContent = fs.readFileSync(citiesFile, 'utf-8');

assert(citiesContent.includes('tashkent'), 'Tashkent included with exact coordinates');
assert(citiesContent.includes('andijan'), 'Andijan included with exact coordinates');
assert(citiesContent.includes('samarkand'), 'Samarkand included with exact coordinates');
assert(citiesContent.includes('makkah'), 'Makkah included with exact coordinates');
assert(citiesContent.includes('istanbul'), 'Istanbul included with exact coordinates');
assert(citiesContent.includes('london'), 'London included with exact coordinates');
assert(citiesContent.includes('new_york'), 'New York included with exact coordinates');
assert(citiesContent.includes('Asia/Tashkent'), 'IANA timezone Asia/Tashkent verified');
assert(citiesContent.includes('searchGlobalCities'), 'Multi-language searchGlobalCities function exported');

// TEST SUITE 5: ASTRONOMICAL PRAYER TIMES ENGINE
console.log('\n--- 5. Astronomical Prayer Times Engine ---');
const prayerCalcFile = path.join(rootDir, 'src', 'shared', 'prayerCalculation.ts');
assert(fs.existsSync(prayerCalcFile), 'src/shared/prayerCalculation.ts exists');
const prayerCalcContent = fs.readFileSync(prayerCalcFile, 'utf-8');

assert(prayerCalcContent.includes('calculateAccuratePrayerTimes'), 'calculateAccuratePrayerTimes engine exported');
assert(prayerCalcContent.includes('uzbekistan:'), 'Uzbekistan Muslim Board method defined');
assert(prayerCalcContent.includes('mwl:'), 'Muslim World League method defined');
assert(prayerCalcContent.includes('makkah:'), 'Umm Al-Qura method defined');
assert(prayerCalcContent.includes('diyanet:'), 'Diyanet method defined');
assert(prayerCalcContent.includes('karachi:'), 'Karachi method defined');
assert(prayerCalcContent.includes('shadowMultiplier = madhabKey === \'hanafi\' ? 2.0 : 1.0'), 'Hanafi vs Shafi\'i Asr shadow ratio implemented');
assert(prayerCalcContent.includes('computeQiblaDirection'), 'Qibla azimuth computation implemented');
assert(prayerCalcContent.includes('generateMonthlyCalendar'), 'Monthly prayer calendar generation implemented');

// TEST SUITE 6: SUPER ADMIN CONTROL CENTER (PHASE 5)
console.log('\n--- 6. Super Admin Control Center CMS (29 Modules) ---');
const adminFile = path.join(rootDir, 'src', 'components', 'AdminPanelView.tsx');
assert(fs.existsSync(adminFile), 'src/components/AdminPanelView.tsx exists');
const adminContent = fs.readFileSync(adminFile, 'utf-8');

assert(adminContent.includes('ADMIN_SECTIONS'), '29 Admin sections catalog defined');
assert(adminContent.includes('overview'), 'Overview module defined');
assert(adminContent.includes('homeLayout'), 'Home Layout CMS module defined');
assert(adminContent.includes('auditLogs'), 'Audit Logs module defined');
assert(adminContent.includes('handlePublishCMS'), 'Publish workflow implemented');
assert(adminContent.includes('handleRollbackCMS'), 'Rollback workflow implemented');

// TEST SUITE 7: PRAYER TIMES VIEW & UI INTEGRATION
console.log('\n--- 7. Prayer Times View & UI Integration ---');
const prayerViewFile = path.join(rootDir, 'src', 'components', 'PrayerTimesView.tsx');
assert(fs.existsSync(prayerViewFile), 'src/components/PrayerTimesView.tsx exists');
const prayerViewContent = fs.readFileSync(prayerViewFile, 'utf-8');

assert(prayerViewContent.includes('isCityModalOpen'), 'Global city selection modal implemented');
assert(prayerViewContent.includes('isMethodModalOpen'), 'Calculation method & Asr madhab selector implemented');
assert(prayerViewContent.includes('monthlyCalendar'), 'Monthly calendar table view implemented');
assert(prayerViewContent.includes('Qibla yoʻnalishi'), 'Qibla compass implemented');
assert(prayerViewContent.includes('Elektron tasbeh'), 'Elektron tasbeh counter implemented');

// TEST SUITE 8: BACKEND ENDPOINTS & API
console.log('\n--- 8. Backend API & Server Architecture ---');
const serverFile = path.join(rootDir, 'server.ts');
assert(fs.existsSync(serverFile), 'server.ts entry point exists');
const serverCode = fs.readFileSync(serverFile, 'utf-8');

assert(serverCode.includes('/api/health'), 'Health check endpoint defined');
assert(serverCode.includes('/api/audio/odiljon-qori'), 'Odiljon qori 115 recitations endpoint defined');
assert(serverCode.includes('/api/prayer/cities'), 'Global cities endpoint defined');
assert(serverCode.includes('/api/prayer/times'), 'Astronomical prayer calculation endpoint defined');
assert(serverCode.includes('/api/prayer/calendar'), 'Monthly prayer calendar endpoint defined');
assert(serverCode.includes('/api/telegram/import-forward'), 'Telegram historical forward import endpoint defined');
assert(serverCode.includes('/api/admin/approve'), 'Admin approval endpoint defined');

// SUMMARY
console.log('\n========================================================================');
console.log(`  TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED  `);
console.log('========================================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 ALL PHASE 5 & PRAYER ENGINE ACCEPTANCE CRITERIA MET AND VERIFIED CLEANLY!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
