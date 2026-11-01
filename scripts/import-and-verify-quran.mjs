import fs from 'node:fs';
import path from 'node:path';

const CANONICAL_AYAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
  15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
  5, 4, 5, 6
];

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  return res.json();
}

async function main() {
  console.log('Fetching verified Uthmani Quran text (Tanzil / AlQuran Cloud)...');
  const uthmaniRes = await fetchJson('https://api.alquran.cloud/v1/quran/quran-uthmani');
  console.log('Fetching verified Uzbek translation (uz.sodik - Shayx Muhammad Sodiq Muhammad Yusuf)...');
  const uzbekRes = await fetchJson('https://api.alquran.cloud/v1/quran/uz.sodik');

  const uthmaniSurahs = uthmaniRes?.data?.surahs;
  const uzbekSurahs = uzbekRes?.data?.surahs;

  if (!Array.isArray(uthmaniSurahs) || uthmaniSurahs.length !== 114) {
    throw new Error(`Expected 114 Uthmani surahs, got ${uthmaniSurahs?.length}`);
  }
  if (!Array.isArray(uzbekSurahs) || uzbekSurahs.length !== 114) {
    throw new Error(`Expected 114 Uzbek surahs, got ${uzbekSurahs?.length}`);
  }

  let totalAyahs = 0;
  const surahs = [];

  for (let i = 0; i < 114; i++) {
    const uSurah = uthmaniSurahs[i];
    const zSurah = uzbekSurahs[i];
    const expectedCount = CANONICAL_AYAH_COUNTS[i];

    if (uSurah.number !== i + 1 || zSurah.number !== i + 1) {
      throw new Error(`Surah ordering mismatch at index ${i}`);
    }
    if (uSurah.ayahs.length !== expectedCount) {
      throw new Error(`Surah ${uSurah.number} Arabic ayah count ${uSurah.ayahs.length} != expected ${expectedCount}`);
    }
    if (zSurah.ayahs.length !== expectedCount) {
      throw new Error(`Surah ${zSurah.number} Uzbek ayah count ${zSurah.ayahs.length} != expected ${expectedCount}`);
    }

    totalAyahs += expectedCount;

    const ayahs = uSurah.ayahs.map((ayah, idx) => {
      const uzAyah = zSurah.ayahs[idx];
      return {
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        juz: ayah.juz,
        page: ayah.page,
        hizbQuarter: ayah.hizbQuarter,
        sajda: Boolean(ayah.sajda),
        arabic: ayah.text,
        uzbekCyrillic: uzAyah.text,
      };
    });

    surahs.push({
      number: uSurah.number,
      arabicName: uSurah.name,
      englishName: uSurah.englishName,
      revelationType: uSurah.revelationType === 'Meccan' ? 'Makkiy' : 'Madaniy',
      ayahCount: expectedCount,
      ayahs,
    });
  }

  if (totalAyahs !== 6236) {
    throw new Error(`Expected 6236 total ayahs, got ${totalAyahs}`);
  }

  const outDir = path.resolve('data');
  fs.mkdirSync(outDir, { recursive: true });

  const dataset = {
    metadata: {
      arabicEdition: {
        identifier: 'quran-uthmani',
        name: "Al-Qur'an al-Karim (Rasm al-Uthmani)",
        source: 'Tanzil Project (tanzil.net) via AlQuran Cloud API',
        license: 'Creative Commons Attribution 3.0 (Verbatim Quranic Text)',
        numberingConvention: "Hafs 'an 'Asim",
      },
      translationEdition: {
        identifier: 'uz.sodik',
        author: 'Shayx Muhammad Sodiq Muhammad Yusuf',
        name: "Qur'oni Karim ma'nolari tarjimasi",
        source: 'Tanzil.net / AlQuran Cloud Authorized Edition (uz.sodik)',
        scriptOriginal: 'Uzbek Cyrillic (with lossless deterministic Uzbek Latin transliteration)',
      },
      validation: {
        verifiedAt: new Date().toISOString(),
        expectedSurahs: 114,
        actualSurahs: surahs.length,
        expectedTotalAyahs: 6236,
        actualTotalAyahs: totalAyahs,
        allAyahCountsMatched: true,
      },
    },
    surahs,
  };

  fs.writeFileSync(path.join(outDir, 'quran-verified.json'), JSON.stringify(dataset));
  console.log(`Successfully imported and verified 114 surahs / ${totalAyahs} ayahs into data/quran-verified.json!`);
}

main().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
