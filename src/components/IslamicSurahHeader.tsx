import React from 'react';
import { Surah } from '../types';
import { toArabicNumerals } from './MushafView';
import { ChevronDown } from 'lucide-react';

interface IslamicSurahHeaderProps {
  surah: Surah;
  showJuzBadge?: boolean;
  onOpenSurahSelector?: () => void;
}

export const IslamicSurahHeader: React.FC<IslamicSurahHeaderProps> = ({
  surah,
  showJuzBadge = false,
  onOpenSurahSelector,
}) => {
  return (
    <div className="w-full my-5 sm:my-8 flex flex-col items-center select-none text-center">
      {/* Optional Top Juz Amma Badge */}
      {showJuzBadge && (
        <div className="flex items-center gap-2 mb-3">
          <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-amber-500/60" />
          <span className="text-xs sm:text-sm font-uthmani text-amber-300/90 tracking-wider">
            جُزْءُ عَمَّ • الجزء الثلاثون
          </span>
          <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-amber-500/60" />
        </div>
      )}

      {/* Royal Authentic Quranic Heading (انسيابي وراقي) */}
      <div 
        className={`relative w-full max-w-xl flex items-center justify-center px-4 ${
          onOpenSurahSelector ? 'cursor-pointer group' : ''
        }`}
        onClick={onOpenSurahSelector}
        role={onOpenSurahSelector ? 'button' : undefined}
        title={onOpenSurahSelector ? 'انقر لتغيير السورة' : undefined}
      >
        {/* Right Flourish Divider */}
        <div className="flex-1 flex items-center justify-end pl-2 sm:pl-4">
          <div className="h-[1.5px] w-full max-w-[120px] bg-gradient-to-l from-amber-400/90 via-orange-400/50 to-transparent rounded-full" />
          <span className="text-amber-400/80 text-sm sm:text-lg mr-1 font-uthmani select-none">❧</span>
        </div>

        {/* Center Name of Surah */}
        <div className="px-4 sm:px-6 py-1 shrink-0">
          <h1 className="text-2xl sm:text-4xl font-bold font-uthmani text-amber-200 tracking-wide drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)] flex items-center gap-2 sm:gap-3 group-hover:text-amber-100 transition">
            <span className="text-amber-400 text-sm sm:text-xl">۞</span>
            <span>سُورَةُ {surah.name}</span>
            {onOpenSurahSelector && (
              <ChevronDown className="w-4 h-4 text-orange-400/80 group-hover:text-orange-300 transition-transform group-hover:translate-y-0.5" />
            )}
            <span className="text-amber-400 text-sm sm:text-xl">۞</span>
          </h1>
        </div>

        {/* Left Flourish Divider */}
        <div className="flex-1 flex items-center justify-start pr-2 sm:pr-4">
          <span className="text-amber-400/80 text-sm sm:text-lg ml-1 font-uthmani select-none rotate-180">❧</span>
          <div className="h-[1.5px] w-full max-w-[120px] bg-gradient-to-r from-amber-400/90 via-orange-400/50 to-transparent rounded-full" />
        </div>
      </div>

      {/* Subtle Details Subtitle (آياتها ومكان النزول) */}
      <div className="mt-2.5 flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-arabic text-zinc-300">
        <span className="text-amber-400/90 font-medium">
          آيَاتُهَا {toArabicNumerals(surah.numberOfAyahs)}
        </span>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-300">
          {surah.revelationType === 'مكية' ? 'مَكِّيَّة' : 'مَدَنِيَّة'}
        </span>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-400 text-[11px] sm:text-xs">
          الصفحة {toArabicNumerals(surah.pageNumber)}
        </span>
      </div>
    </div>
  );
};
