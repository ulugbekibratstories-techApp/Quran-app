import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Clock,
  Download,
  Check,
  BookOpen,
  Volume2,
  X,
  Gauge,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PersistentAudioBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    playbackRate,
    setPlaybackRate,
    repeatMode,
    setRepeatMode,
    sleepTimerRemaining,
    startSleepTimer,
    clearSleepTimer,
    nextTrack,
    prevTrack,
    downloadTrack,
    isDownloaded,
    downloadingIds,
    openSurah,
    loc,
    reciters,
  } = useApp();

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showTimerMenu, setShowTimerMenu] = useState(false);

  if (!currentTrack) {
    return null;
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isCurrentlyDownloaded = isDownloaded(currentTrack.reciterId, currentTrack.surahNumber);
  const isDownloading = downloadingIds.includes(`${currentTrack.reciterId}_${currentTrack.surahNumber}`);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const targetSeconds = (val / 100) * duration;
    seek(targetSeconds);
  };

  const toggleRepeat = () => {
    if (repeatMode === 'none') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('none');
  };

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-emerald-900/10 dark:border-emerald-500/20 shadow-xl transition-all">
      {/* Progress track slider */}
      <div className="relative group w-full h-1 bg-stone-200 dark:bg-stone-800 cursor-pointer">
        <div
          className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={isNaN(progressPercent) ? 0 : progressPercent}
          onChange={handleSeekChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title="Oʻtkazish"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Track info & reader jump */}
        <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial">
          <button
            onClick={() => openSurah(currentTrack.surahNumber)}
            className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-400 font-bold flex items-center justify-center shrink-0 shadow-sm border border-emerald-700/50 hover:scale-105 transition active:scale-95"
            title={loc('Qurʼonda ochish', 'Қуръонда очиш')}
          >
            <span className="text-sm">{currentTrack.surahNumber}</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                {loc(currentTrack.titleLatin, currentTrack.titleCyrillic)}
              </h4>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-arabic hidden sm:inline">
                {currentTrack.arabicSurahName}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
              {(() => {
                const rec = reciters.find((r) => r.id === currentTrack.reciterId);
                return rec ? loc(rec.nameLatin, rec.nameCyrillic) : loc('Qori tilovati', 'Қори тиловати');
              })()}
            </p>
          </div>
        </div>

        {/* Center player controls */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={prevTrack}
            className="p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            title="Oldingi sura"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition active:scale-95"
            title={isPlaying ? 'Toʻxtatish' : 'Tinglash'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={nextTrack}
            className="p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            title="Keyingi sura"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right audio options */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick open in reader */}
          <button
            onClick={() => openSurah(currentTrack.surahNumber)}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition"
            title="Mushafda oʻqish"
          >
            <BookOpen className="w-4 h-4" />
            <span>{loc('Oʻqish', 'Ўқиш')}</span>
          </button>

          {/* Speed selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSpeedMenu(!showSpeedMenu);
                setShowTimerMenu(false);
              }}
              className="px-2 py-1 text-xs font-semibold rounded text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center gap-0.5"
              title="Tezlik"
            >
              <Gauge className="w-3.5 h-3.5 mr-0.5 hidden sm:inline" />
              <span>{playbackRate}x</span>
            </button>

            {showSpeedMenu && (
              <div className="absolute bottom-10 right-0 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 p-1.5 flex flex-col gap-1 z-50">
                {[0.75, 1, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      setPlaybackRate(rate);
                      setShowSpeedMenu(false);
                    }}
                    className={`px-3 py-1 text-xs rounded-lg text-left transition ${
                      playbackRate === rate
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Repeat mode */}
          <button
            onClick={toggleRepeat}
            className={`p-1.5 rounded-lg transition ${
              repeatMode !== 'none'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title={`Takrorlash: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>

          {/* Sleep timer */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTimerMenu(!showTimerMenu);
                setShowSpeedMenu(false);
              }}
              className={`p-1.5 rounded-lg transition relative ${
                sleepTimerRemaining !== null
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60'
                  : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title="Kutish taymeri (uyqu)"
            >
              <Clock className="w-4 h-4" />
              {sleepTimerRemaining !== null && (
                <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-amber-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {Math.ceil(sleepTimerRemaining / 60)}
                </span>
              )}
            </button>

            {showTimerMenu && (
              <div className="absolute bottom-10 right-0 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 p-2 min-w-36 flex flex-col gap-1 z-50">
                <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 px-2 py-0.5">
                  {loc('Uyqu taymeri', 'Уйқу таймери')}
                </div>
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      startSleepTimer(mins);
                      setShowTimerMenu(false);
                    }}
                    className="px-2 py-1 text-xs rounded-lg text-left hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200"
                  >
                    {mins} {loc('daqiqa', 'дақиқа')}
                  </button>
                ))}
                {sleepTimerRemaining !== null && (
                  <button
                    onClick={() => {
                      clearSleepTimer();
                      setShowTimerMenu(false);
                    }}
                    className="px-2 py-1 text-xs rounded-lg text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    {loc('Oʻchirish', 'Ўчириш')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Download offline button */}
          <button
            onClick={() => !isCurrentlyDownloaded && downloadTrack(currentTrack)}
            disabled={isCurrentlyDownloaded || isDownloading}
            className={`p-1.5 rounded-lg transition ${
              isCurrentlyDownloaded
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 cursor-default'
                : isDownloading
                ? 'text-amber-600 animate-pulse'
                : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title={
              isCurrentlyDownloaded
                ? loc('Oflayn mavjud', 'Офлайн мавжуд')
                : isDownloading
                ? loc('Yuklanmoqda...', 'Юкланмоқда...')
                : loc('Oflayn saqlash', 'Офлайн сақлаш')
            }
          >
            {isCurrentlyDownloaded ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
