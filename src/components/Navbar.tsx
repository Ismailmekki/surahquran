import React from 'react';
import { BookOpen } from 'lucide-react';

interface NavbarProps {
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
}) => {
  return (
    <header id="app-navbar" className="sticky top-0 z-30 bg-[#1a1d24]/95 backdrop-blur-md border-b border-zinc-800 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-13 sm:h-14">
          {/* Logo & App Brand */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer" 
            onClick={onGoHome}
            role="button"
            aria-label="الرئيسية"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-950/50 border border-amber-400/60 shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-bold font-uthmani text-amber-300 leading-tight drop-shadow-xs">
                  جُزْءُ عَمَّ
                </h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 font-arabic hidden sm:inline-block">
                  الجزء ٣٠
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-zinc-300 font-sans">
                المصحف المعلم والتدبر التفاعلي
              </span>
            </div>
          </div>

          <div className="text-xs text-zinc-400 font-arabic hidden xs:block">
            بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
          </div>
        </div>
      </div>
    </header>
  );
};


