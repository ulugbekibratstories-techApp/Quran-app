import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const { loc } = useApp();
  const [showIosModal, setShowIosModal] = useState<boolean>(false);
  const [showAndroidModal, setShowAndroidModal] = useState<boolean>(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await promptInstall();
    } else if (isIOS) {
      setShowIosModal(true);
    } else {
      setShowAndroidModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title={loc('Ilovani yuklab olish', 'Иловани юклаб олиш')}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95 border border-emerald-500/30"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{loc('Yuklab olish', 'Юклаб олиш')}</span>
      </button>

      {/* iOS manual install instructions modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 dark:border-stone-800 relative">
            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-2">
              {loc('iPhone va iPad uchun oʻrnatish', 'iPhone ва iPad учун ўрнатиш')}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 mb-4">
              {loc(
                'Qurʼon ilovasini oflayn va qulay ishlatish uchun telefoningiz asosiy ekraniga qoʻshing:',
                'Қуръон иловасини офлайн ва қулай ишлатиш учун телефонингиз асосий экранига қўшинг:'
              )}
            </p>

            <ol className="space-y-3 text-xs text-stone-700 dark:text-stone-200 mb-5">
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0">
                  1
                </span>
                <span>
                  Safari brauzerida pastdagi <Share className="w-3.5 h-3.5 inline mx-1 text-emerald-600" /> tugmasini bosing
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0">
                  2
                </span>
                <span>
                  Ochilgan menyudan <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-600" /> &quot;Asosiy ekranga qoʻshish&quot; (Add to Home Screen) bandini tanlang
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0">
                  3
                </span>
                <span>Yuqori burchakdagi &quot;Qoʻshish&quot; (Add) tugmasini bosing</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-medium transition"
            >
              {loc('Tushunarli', 'Тушунарли')}
            </button>
          </div>
        </div>
      )}

      {/* Android / Chrome install instructions modal */}
      {showAndroidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 dark:border-stone-800 relative">
            <button
              onClick={() => setShowAndroidModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {loc('Ilovani telefonga oʻrnatish', 'Иловани телефонон ўрнатиш')}
              </h3>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 mb-4">
              {loc(
                'QURʼON APP ilovasini telefoningizga oʻrnatib, oflayn va toʻliq ishlatishingiz mumkin:',
                'ҚУРЪОН APP иловасини телефонингизга ўрнатиб, офлайн ва тўлиқ ишлатишингиз мумкин:'
              )}
            </p>

            <ol className="space-y-3 text-xs text-stone-700 dark:text-stone-200 mb-5">
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0">1</span>
                <span>{loc('Brauzer menyusini oching (uchta nuqta ⋮ tugmasi)', 'Браузер менюсини очинг (учта нуқта ⋮ тугмаси)')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0">2</span>
                <span>{loc('"Ilovani oʻrnatish" yoki "Bosh ekranga qoʻshish" bandini tanlang', '"Иловани ўрнатиш" ёки "Бош экранга қўшиш" бандини танланг')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0">3</span>
                <span>{loc('Tasdiqlang — ilova asosiy ekranda paydo boʻladi', 'Тасдиқланг — илова асосий экранда пайдо бўлади')}</span>
              </li>
            </ol>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3 mb-4">
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                {loc('Oʻrnatilgandan soʻng ilova internetga ulanmasdan ham toʻliq ishlaydi — barcha 114 sura va 6236 oyat qurilmangiz xotirasida saqlanadi.', 'Ўрнатилгандан сўнг илова интернетга уланмасдан ҳам тўлиқ ишлайди — барча 114 сура ва 6236 оят қурмангиз хотирасида сақланади.')}
              </p>
            </div>

            <button
              onClick={() => setShowAndroidModal(false)}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-medium transition"
            >
              {loc('Tushunarli', 'Тушунарли')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
