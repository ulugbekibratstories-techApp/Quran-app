import React from 'react';
import {
  Download,
  Trash2,
  Play,
  Pause,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Headphones,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatBytes, clearAllOfflineTracks } from '../services/offlineAudioDb';
import { AudioTrackRecord } from '../shared/types';
import { CANONICAL_SURAH_CATALOG } from '../shared/surahCatalog';

export const DownloadsView: React.FC = () => {
  const {
    offlineTracks,
    removeDownload,
    playTrack,
    currentTrack,
    isPlaying,
    openSurah,
    setView,
    loc,
  } = useApp();

  const totalBytes = offlineTracks.reduce((acc, t) => acc + (t.sizeBytes || 0), 0);

  const handlePlayOffline = (trackId: string, surahNumber: number) => {
    const surah = CANONICAL_SURAH_CATALOG[surahNumber - 1];
    const pad = String(surahNumber).padStart(3, '0');
    const audioTrack: AudioTrackRecord = {
      id: trackId,
      reciterId: 'mishary_alafasy',
      surahNumber,
      arabicSurahName: surah.arabicName,
      uzbekSurahLatin: surah.uzbekLatin,
      uzbekSurahCyrillic: surah.uzbekCyrillic,
      titleLatin: `${surahNumber}. ${surah.uzbekLatin} surasi (Oflayn)`,
      titleCyrillic: `${surahNumber}. ${surah.uzbekCyrillic} сураси (Офлайн)`,
      audioUrl: `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${pad}.mp3`,
      sourceName: 'IndexedDB Offline Cache',
      sourceChannelOrUrl: 'local',
      format: 'mp3',
      rightsStatus: 'VERIFIED_AUTHORIZED',
      availabilityStatus: 'AVAILABLE',
      status: 'APPROVED',
      category: 'Offline',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    playTrack(audioTrack);
  };

  const handleClearAll = async () => {
    if (window.confirm(loc('Barcha yuklab olingan audiolarni oʻchirmoqchimisiz?', 'Барча юклаб олинган аудиоларни ўчирмоқчимисиз?'))) {
      await clearAllOfflineTracks();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Storage Quota Info */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{loc('Oflayn xotira (IndexedDB)', 'Офлайн хотира (IndexedDB)')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            {loc('Yuklab olingan audiolar', 'Юклаб олинган аудиолар')}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {loc(
              'Ushbu suralar qurilmangiz xotirasida saqlangan va internet umuman boʻlmagan taqdirda ham toʻliq eshitiladi.',
              'Ушбу суралар қурилмангиз хотирасида сақланган ва интернет умуман бўлмаган тақдирда ҳам тўлиқ эшитилади.'
            )}
          </p>
        </div>

        {offlineTracks.length > 0 && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs text-stone-400">{loc('Jami hajm:', 'Жами ҳажм:')}</div>
              <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                {formatBytes(totalBytes)}
              </div>
            </div>
            <button
              onClick={handleClearAll}
              className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-xs flex items-center gap-1.5"
              title="Barchasini tozalash"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">{loc('Tozalash', 'Тозалаш')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {offlineTracks.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 border border-stone-200 dark:border-stone-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
            <HardDrive className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            {loc('Hozircha yuklab olingan suralar yoʻq', 'Ҳозирча юклаб олинган суралар йўқ')}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            {loc(
              'Audio boʻlimiga oʻtib, oʻzingiz istagan suralarni oflayn eshitish uchun yuklab olishingiz mumkin.',
              'Аудио бўлимига ўтиб, ўзингиз истаган сураларни офлайн эшитиш учун юклаб олишингиз мумкин.'
            )}
          </p>
          <button
            onClick={() => setView('audio')}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition"
          >
            {loc('Audio kutubxonaga oʻtish', 'Аудио кутубхонага ўтиш')}
          </button>
        </div>
      ) : (
        /* Downloaded Tracks List */
        <div className="space-y-2.5">
          {offlineTracks.map((item) => {
            const isPlayingThis = isPlaying && currentTrack?.surahNumber === item.surahNumber;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 shadow-2xs hover:border-emerald-500/40 transition"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">
                    {item.surahNumber}
                  </span>

                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                      {item.surahNumber}. {loc(item.surahNameLatin, item.surahNameCyrillic)}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <span className="font-arabic text-emerald-800 dark:text-emerald-300">
                        {item.surahNameArabic}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">{formatBytes(item.sizeBytes)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openSurah(item.surahNumber)}
                    className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                    title="Mushafda oʻqish"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePlayOffline(item.id, item.surahNumber)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition active:scale-95 ${
                      isPlayingThis ? 'bg-amber-500 text-stone-950' : 'bg-emerald-700 hover:bg-emerald-800'
                    }`}
                    title={isPlayingThis ? 'Toʻxtatish' : 'Tinglash'}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => removeDownload(item.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                    title="Xotiradan oʻchirish"
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
