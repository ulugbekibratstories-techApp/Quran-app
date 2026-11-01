import React, { useState } from 'react';
import { Youtube, Play, ExternalLink, Sparkles, Filter, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VideoMediaRecord } from '../shared/types';
import { ODILJON_QORI_VIDEOS, ODILJON_QORI_OFFICIAL_CHANNELS } from '../data/odiljonQoriData';

export const VideosView: React.FC = () => {
  const { loc } = useApp();
  const [videos, setVideos] = useState<VideoMediaRecord[]>(ODILJON_QORI_VIDEOS);
  const [activeVideo, setActiveVideo] = useState<VideoMediaRecord | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  React.useEffect(() => {
    setVideos(ODILJON_QORI_VIDEOS);
  }, []);

  const categories = [
    { id: 'all', labelLat: 'Barchasi', labelCyr: 'Барчаси' },
    { id: 'Tilovat', labelLat: 'Tilovatlar', labelCyr: 'Тиловатлар' },
    { id: 'Maruza', labelLat: 'Maʼruzalar', labelCyr: 'Маърузалар' },
  ];

  const filteredVideos = videos.filter((v) => {
    if (selectedCategory === 'all') return true;
    return v.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-semibold">
            <Youtube className="w-3.5 h-3.5" />
            <span>{loc('Qurʼon tilovatlari', 'Қуръон тиловатлари')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            {loc('Video tilovatlar', 'Видео тиловатлар')}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {loc(
              'Shayx Mishariy Roshid Alafasyning YouTube kanalidagi goʻzal Qurʼon tilovatlari.',
              'Шайх Мишарий Рошид Алафасининг YouTube каналдаги гўзал Қуръон тиловатлари.'
            )}
          </p>
        </div>

        <a
          href="https://www.youtube.com/@afasy"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition shrink-0"
        >
          <Youtube className="w-4 h-4" />
          <span>{loc('Kanalga oʻtish', 'Каналга ўтиш')}</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
        </a>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCategory === cat.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {loc(cat.labelLat, cat.labelCyr)}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-emerald-500/40 transition flex flex-col justify-between group"
          >
            {/* Visual Thumbnail Frame with High Fidelity Islamic Style */}
            <div
              onClick={() => setActiveVideo(video)}
              className="relative aspect-video rounded-2xl bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-900 overflow-hidden cursor-pointer flex items-center justify-center border border-emerald-900/30 group-hover:scale-[1.01] transition-all"
            >
              {/* Subtle geometric pattern */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#fbbf24 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />

              <div className="relative z-10 text-center space-y-2 p-4">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <div className="text-amber-300 font-arabic text-sm">
                  أوديلجان قاري إسماعيل جانوف
                </div>
              </div>

              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                YouTube
              </div>
            </div>

            <div className="pt-4 space-y-1.5">
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                {loc(video.titleLatin, video.titleCyrillic)}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                {loc(video.descriptionLatin, video.descriptionCyrillic)}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400">
                <span>{video.channelHandle}</span>
                <button
                  onClick={() => setActiveVideo(video)}
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  {loc('Tomosha qilish', 'Томоша қилиш')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-stone-950 rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between text-white pb-2 border-b border-stone-800">
              <h4 className="font-bold text-sm truncate max-w-md">
                {loc(activeVideo.titleLatin, activeVideo.titleCyrillic)}
              </h4>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive iframe or direct embed */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeVideoId}?autoplay=1`}
                title={activeVideo.titleLatin}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>{activeVideo.channelTitle} ({activeVideo.channelHandle})</span>
              <a
                href={activeVideo.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:underline flex items-center gap-1"
              >
                <span>YouTube ilovasida ochish</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
