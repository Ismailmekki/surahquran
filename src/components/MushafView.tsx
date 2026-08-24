import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Bookmark as BookmarkIcon, 
  BookOpen, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Repeat
} from 'lucide-react';
import { Surah, Ayah } from '../types';
import { IslamicSurahHeader } from './IslamicSurahHeader';

interface MushafViewProps {
  surah: Surah;
  currentAyahIndex: number;
  isPlaying: boolean;
  fontSize: number;
  fontFamily: string;
  bookmarks: { surahId: number; ayahNumber: number }[];
  onPlayAyah: (ayahIndex: number) => void;
  onToggleBookmark: (surahId: number, ayahNumber: number) => void;
  onOpenTafsir: (ayah: Ayah) => void;
  onNextSurah?: () => void;
  onPrevSurah?: () => void;
  hasPrevSurah?: boolean;
  hasNextSurah?: boolean;
}

// Convert numbers to Eastern Arabic numerals
export function toArabicNumerals(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map((d) => arabicDigits[parseInt(d, 10)] || d).join('');
}

// Masterpiece authentic Medina Mushaf Rosette Ayah End Marker
export const AyahEndMarker: React.FC<{ number: number; isPlaying?: boolean }> = ({ number, isPlaying }) => {
  return (
    <span 
      className={`inline-flex items-center justify-center align-middle mx-1.5 sm:mx-2 select-none relative transition-transform duration-200 ${
        isPlaying ? 'scale-115' : 'hover:scale-105'
      }`}
      style={{ verticalAlign: 'middle' }}
    >
      <svg
        viewBox="0 0 44 44"
        className={`w-7 h-7 sm:w-8.5 sm:h-8.5 transition-colors duration-200 ${
          isPlaying ? 'text-orange-400' : 'text-amber-500/85 hover:text-amber-400'
        }`}
        fill="currentColor"
      >
        {/* Outer 8-petaled geometric star points */}
        <polygon 
          points="22,1.5 27.5,7.5 35.5,5.5 36.5,13.5 43.5,17.5 40.5,25 44,32 36.5,34.5 35,42.5 27.5,40 22,44 16.5,40 9,42.5 7.5,34.5 0,32 3.5,25 0.5,17.5 7.5,13.5 8.5,5.5 16.5,7.5"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.2" 
          opacity="0.8"
        />
        {/* Outer circular gold frame */}
        <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="1.3" />
        {/* Inner delicate beaded ring */}
        <circle cx="22" cy="22" r="15" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        {/* Center luminous medallion disc */}
        <circle cx="22" cy="22" r="13" fill="currentColor" fillOpacity={isPlaying ? "0.2" : "0.07"} />
        {/* 4 Cardinal decorative florets */}
        <circle cx="22" cy="5" r="1.4" fill="currentColor" />
        <circle cx="22" cy="39" r="1.4" fill="currentColor" />
        <circle cx="5" cy="22" r="1.4" fill="currentColor" />
        <circle cx="39" cy="22" r="1.4" fill="currentColor" />
      </svg>
      <span 
        className={`absolute inset-0 flex items-center justify-center font-uthmani text-xs sm:text-[14px] font-bold leading-none select-none transition-colors ${
          isPlaying ? 'text-white font-extrabold' : 'text-amber-200'
        }`}
        style={{ paddingTop: '1px' }}
      >
        {toArabicNumerals(number)}
      </span>
    </span>
  );
};

export const MushafView: React.FC<MushafViewProps> = ({
  surah,
  currentAyahIndex,
  isPlaying,
  fontSize,
  fontFamily,
  bookmarks,
  onPlayAyah,
  onToggleBookmark,
  onOpenTafsir,
}) => {
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);

  const handleCopy = (ayah: Ayah) => {
    navigator.clipboard.writeText(`﴿ ${ayah.text} ﴾ [سورة ${surah.name}: ${ayah.number}]`);
    setCopiedAyahNumber(ayah.number);
    setTimeout(() => setCopiedAyahNumber(null), 2000);
  };

  const isBismillahOmitted = surah.id === 9;

  return (
    <div id="mushaf-view-container" className="max-w-4xl mx-auto px-3 sm:px-8 py-2 sm:py-4 pb-44 sm:pb-40">
      {/* Pure Quranic Text Presentation (Frameless, Distraction-free) */}
      <div className="relative py-2 sm:py-4 transition-colors">
        {/* Authentic Islamic Surah Header Rectangle */}
        <IslamicSurahHeader surah={surah} showJuzBadge={true} />

        {/* Bismillah Banner */}
        {!isBismillahOmitted && (
          <div className="mb-8 sm:mb-10 text-center select-none">
            <div className="text-2xl sm:text-3xl font-quran text-amber-100/95 tracking-wide leading-loose">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div className="w-24 sm:w-36 h-0.5 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent mx-auto mt-2" />
          </div>
        )}

        {/* Continuous Flow Quranic Text with Authentic Rosettes and Sleek Word Underlining */}
        <div 
          className="text-justify font-quran leading-[2.7] sm:leading-[3.1] text-white selection:bg-orange-500 selection:text-white"
          style={{ 
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily === 'Cairo' ? 'Cairo, sans-serif' : fontFamily === 'Noto Naskh' ? 'Noto Naskh Arabic, serif' : 'Amiri Quran, Amiri, serif',
            textAlignLast: 'center',
            textJustify: 'revert'
          }}
        >
          {surah.ayahs.map((ayah, index) => {
            const isCurrentPlaying = isPlaying && currentAyahIndex === index;
            const isSelected = selectedAyah?.number === ayah.number;
            const isBookmarked = bookmarks.some(
              (b) => b.surahId === surah.id && b.ayahNumber === ayah.number
            );

            return (
              <span 
                key={ayah.number}
                id={`ayah-mushaf-${surah.id}-${ayah.number}`}
                onClick={() => setSelectedAyah(isSelected ? null : ayah)}
                className={`inline cursor-pointer transition-all duration-200 relative group touch-manipulation pb-1.5 ${
                  isCurrentPlaying 
                    ? 'border-b-2 border-orange-400 text-orange-200 font-medium' 
                    : isSelected
                    ? 'border-b-2 border-amber-400 text-white font-medium'
                    : isBookmarked
                    ? 'border-b-2 border-dashed border-amber-500/80 text-white'
                    : 'text-white hover:border-b-2 hover:border-zinc-500/50'
                }`}
                title={`الآية ${ayah.number} (انقر للخيارات والتفسير والاستماع)`}
              >
                <span className="text-white transition-colors group-hover:text-amber-100">{ayah.text}</span>

                {/* Masterpiece Medina Ayah Rosette */}
                <AyahEndMarker number={ayah.number} isPlaying={isCurrentPlaying} />
              </span>
            );
          })}
        </div>
      </div>

      {/* Selected Ayah Mobile Bottom Sheet / Modal */}
      {selectedAyah && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div 
            className="w-full sm:max-w-lg bg-[#22252e] text-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border-t sm:border border-zinc-700 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle on Mobile */}
            <div className="w-12 h-1.5 bg-zinc-600 rounded-full mx-auto mb-3 sm:hidden" />

            <div className="flex items-center justify-between border-b border-zinc-700 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center border border-orange-500/40">
                  {selectedAyah.number}
                </span>
                <span className="font-bold text-sm text-white">
                  سورة {surah.name} • الآية {selectedAyah.number}
                </span>
              </div>
              <button
                onClick={() => setSelectedAyah(null)}
                className="text-zinc-400 hover:text-white text-xs px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 touch-manipulation"
              >
                ✕ إغلاق
              </button>
            </div>

            <div className="text-sm font-quran leading-relaxed mb-3 text-white bg-zinc-850 p-3 rounded-2xl border border-zinc-750">
              {selectedAyah.text}
            </div>

            <div className="text-xs text-zinc-300 mb-4 bg-zinc-800/80 p-3 rounded-xl border border-zinc-700">
              <span className="text-orange-400 font-bold block mb-1">التفسير الميسر:</span>
              {selectedAyah.tafsir}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                id="popover-play-btn"
                onClick={() => {
                  onPlayAyah(selectedAyah.number - 1);
                  setSelectedAyah(null);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-950/40 border border-orange-400/40 transition touch-manipulation"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>استماع</span>
              </button>

              <button
                id="popover-tafsir-btn"
                onClick={() => {
                  onOpenTafsir(selectedAyah);
                  setSelectedAyah(null);
                }}
                className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs border border-zinc-700 hover:border-orange-500 transition touch-manipulation"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>تفسير مفصل</span>
              </button>

              <button
                id="popover-bookmark-btn"
                onClick={() => {
                  onToggleBookmark(surah.id, selectedAyah.number);
                }}
                className={`flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl text-xs border transition touch-manipulation ${
                  bookmarks.some((b) => b.surahId === surah.id && b.ayahNumber === selectedAyah.number)
                    ? 'bg-orange-500 text-white border-orange-400'
                    : 'bg-zinc-800 text-white border-zinc-700 hover:border-orange-500'
                }`}
              >
                <BookmarkIcon className="w-3.5 h-3.5 fill-current" />
                <span>حفظ</span>
              </button>

              <button
                id="popover-copy-btn"
                onClick={() => handleCopy(selectedAyah)}
                className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs border border-zinc-700 transition touch-manipulation"
              >
                {copiedAyahNumber === selectedAyah.number ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-orange-400">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
