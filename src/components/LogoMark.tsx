import React from 'react';

interface LogoMarkProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ size = 40, className = '', showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Authentic Rub el Hizb (8-pointed star) geometric Islamic medallion */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:rotate-45"
      >
        <defs>
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="50%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Outer square rotated 0 deg */}
        <rect
          x="18"
          y="18"
          width="64"
          height="64"
          rx="6"
          fill="url(#emeraldGrad)"
          stroke="url(#goldGrad)"
          strokeWidth="2.5"
        />
        {/* Intersecting square rotated 45 deg */}
        <rect
          x="18"
          y="18"
          width="64"
          height="64"
          rx="6"
          transform="rotate(45 50 50)"
          fill="url(#emeraldGrad)"
          stroke="url(#goldGrad)"
          strokeWidth="2.5"
        />

        {/* Inner gold circular frame */}
        <circle cx="50" cy="50" r="22" stroke="url(#goldGrad)" strokeWidth="2" fill="#022c22" />

        {/* Mini 8-point inner star or Quran icon */}
        <path
          d="M50 36L53.5 44.5L62.5 45L55.5 51L58 60L50 55L42 60L44.5 51L37.5 45L46.5 44.5Z"
          fill="url(#goldGrad)"
        />
        <circle cx="50" cy="50" r="4" fill="#fef3c7" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="font-bold tracking-tight text-emerald-950 dark:text-emerald-100 text-lg flex items-center gap-1.5 font-sans">
            <span>QUR’ON</span>
            <span className="text-amber-600 dark:text-amber-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              APP
            </span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-emerald-700/80 dark:text-emerald-300/70 font-medium">
            Muqaddas Qurʼon · 114 Sura
          </span>
        </div>
      )}
    </div>
  );
};
