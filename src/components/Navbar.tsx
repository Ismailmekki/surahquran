import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  Search, 
  Bookmark as BookmarkIcon, 
  Settings, 
  Check, 
  ChevronRight,
  ChevronLeft,
  X,
  Smartphone,
  Download
} from 'lucide-react';
import { Surah, ViewMode } from '../types';
import { ALL_JUZ_AMMA_SURAHS, removeDiacritics } from '../data';
import { toArabicNumerals } from './MushafView';

interface NavbarProps {
  currentSurah: Surah;
  viewMode?: ViewMode;
  onSelectSurah: (surah: Surah) => void;
  onChangeViewMode?: (mode: ViewMode) => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
  onOpenWordMeanings?: () => void;
  onOpenDuaKhatm?: () => void;
  onOpenInstallModal?: () => void;
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSurah,
  onSelectSurah,
  onOpenSearch,
  onOpenBookmarks,
  onOpenSettings,
  onOpenInstallModal,
  onGoHome,
}) => {
  const [showSurahMenu, setShowSurahMenu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'مكية' | 'مدنية'>('all');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSurahMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentIndex = ALL_JUZ_AMMA_SURAHS.findIndex((s) => s.id === currentSurah.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < ALL_JUZ_AMMA_SURAHS.length - 1;

  const handlePrevSurah = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasPrev) {
      onSelectSurah(ALL_JUZ_AMMA_SURAHS[currentIndex - 1]);
    }
  };

  const handleNextSurah = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasNext) {
      onSelectSurah(ALL_JUZ_AMMA_SURAHS[currentIndex + 1]);
    }
  };

  const filteredSurahs = ALL_JUZ_AMMA_SURAHS.filter((s) => {
    const matchesFilter = filterType === 'all' || s.revelationType === filterType;
    if (!matchesFilter) return false;

    if (!searchQuery.trim()) return true;
    const cleanQ = removeDiacritics(searchQuery.trim().toLowerCase());
    const cleanName = removeDiacritics(s.name.toLowerCase());
    const cleanEnglish = s.englishName.toLowerCase();
    const idMatch = s.id.toString() === searchQuery.trim();

    return cleanName.includes(cleanQ) || cleanEnglish.includes(cleanQ) || idMatch;
  });

  return (
    <header id="app-navbar" className="sticky top-0 z-40 bg-[#16181f]/95 backdrop-blur-md border-b border-zinc-800 shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Top Primary Bar */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Right: Brand Title "جزء عم" */}
          <div className="flex items-center gap-2 shrink-0">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={onGoHome}
              role="button"
              aria-label="الرئيسية"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-950/40 border border-amber-400/50 group-hover:scale-105 transition-transform shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="hidden xs:block">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg sm:text-xl font-bold font-uthmani text-amber-300 leading-tight">
                    جُزْءُ عَمَّ
                  </h1>
                  <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 font-arabic hidden md:inline-block">
                    الجزء ٣٠
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Prominent Surah Selector Button (واضح جداً في أعلى الصفحة لسهولة تغيير السورة) */}
          <div className="relative flex-1 max-w-sm sm:max-w-md mx-1" ref={dropdownRef}>
            <div className="flex items-center justify-center gap-1">
              
              {/* Previous Surah Quick Button */}
              <button
                onClick={handlePrevSurah}
                disabled={!hasPrev}
                className={`p-1.5 rounded-xl border border-zinc-700/80 bg-zinc-800/80 text-zinc-300 transition shrink-0 ${
                  hasPrev ? 'hover:bg-zinc-700 hover:text-white active:scale-95' : 'opacity-40 cursor-not-allowed'
                }`}
                title="السورة السابقة"
                aria-label="السورة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Main Surah Switcher Button */}
              <button
                id="top-surah-switcher-btn"
                onClick={() => setShowSurahMenu(!showSurahMenu)}
                className="flex-1 flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-orange-950/60 via-zinc-800 to-zinc-800/90 hover:from-orange-900/60 hover:to-zinc-700/90 border border-orange-500/50 hover:border-orange-400 text-white shadow-md shadow-black/30 transition-all touch-manipulation group"
                title="انقر هنا لتغيير السورة"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] sm:text-xs font-bold font-uthmani flex items-center justify-center shrink-0">
                    {toArabicNumerals(currentSurah.id)}
                  </span>
                  <div className="text-right min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm font-bold font-uthmani text-amber-200 group-hover:text-amber-100 truncate">
                        سُورَةُ {currentSurah.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-orange-500 text-white font-medium shadow-xs hidden sm:inline-block">
                    تغيير السورة
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-orange-500/30 text-orange-300 sm:hidden">
                    تغيير
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-orange-400 transition-transform duration-200 ${showSurahMenu ? 'rotate-180 text-orange-300' : ''}`} />
                </div>
              </button>

              {/* Next Surah Quick Button */}
              <button
                onClick={handleNextSurah}
                disabled={!hasNext}
                className={`p-1.5 rounded-xl border border-zinc-700/80 bg-zinc-800/80 text-zinc-300 transition shrink-0 ${
                  hasNext ? 'hover:bg-zinc-700 hover:text-white active:scale-95' : 'opacity-40 cursor-not-allowed'
                }`}
                title="السورة التالية"
                aria-label="السورة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Surah Selection Dropdown / Bottom Sheet */}
            {showSurahMenu && (
              <div 
                id="top-surah-dropdown-menu"
                className="fixed inset-x-2 top-16 sm:inset-x-auto sm:absolute sm:top-full sm:mt-2 sm:right-0 sm:left-auto w-auto sm:w-[380px] bg-[#1f222b] border border-zinc-700 rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 max-h-[75vh] flex flex-col"
              >
                {/* Header of Surah Selector */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-700/80 mb-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm font-uthmani">
                    <BookOpen className="w-4 h-4 text-orange-400" />
                    <span>فهرس سور جزء عم (٣٧ سورة)</span>
                  </div>
                  <button
                    onClick={() => setShowSurahMenu(false)}
                    className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs"
                    aria-label="إغلاق القائمة"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="mb-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ابحث باسم السورة أو رقمها (مثل: 78، النبأ)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pr-8 pl-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-400 focus:outline-hidden focus:border-orange-500"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Type Filter Chips */}
                <div className="flex items-center gap-1.5 pb-2 mb-1 text-[11px]">
                  {[
                    { id: 'all', label: 'جميع السور (٣٧)' },
                    { id: 'مكية', label: 'مكية (٣٤)' },
                    { id: 'مدنية', label: 'مدنية (٣)' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setFilterType(filter.id as any)}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        filterType === filter.id
                          ? 'bg-orange-500 text-white font-bold shadow-xs'
                          : 'bg-zinc-800/80 text-zinc-400 hover:text-white border border-zinc-700/60'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* List of Surahs */}
                <div className="overflow-y-auto space-y-1 p-1 max-h-[50vh] divide-y divide-zinc-800/60">
                  {filteredSurahs.map((surah) => {
                    const isSelected = surah.id === currentSurah.id;
                    return (
                      <button
                        key={surah.id}
                        onClick={() => {
                          onSelectSurah(surah);
                          setShowSurahMenu(false);
                        }}
                        className={`w-full text-right p-2.5 rounded-2xl text-xs flex items-center justify-between transition group ${
                          isSelected
                            ? 'bg-orange-500 text-white font-bold shadow-sm'
                            : 'text-zinc-200 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-uthmani text-xs font-bold shrink-0 ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-zinc-800 text-amber-300 border border-zinc-700'
                            }`}
                          >
                            {toArabicNumerals(surah.id)}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-uthmani text-sm font-bold">
                                سورة {surah.name}
                              </span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                                  isSelected
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                                }`}
                              >
                                {surah.revelationType === 'مكية' ? 'مكية' : 'مدنية'}
                              </span>
                            </div>
                            <div
                              className={`text-[10px] truncate ${
                                isSelected ? 'text-orange-100' : 'text-zinc-400'
                              }`}
                            >
                              {surah.englishName} • {toArabicNumerals(surah.numberOfAyahs)} آية
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-white shrink-0" />
                        )}
                      </button>
                    );
                  })}

                  {filteredSurahs.length === 0 && (
                    <div className="text-center py-6 text-zinc-400 text-xs">
                      لا توجد سورة مطابقة لبحثك
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Left: Quick Actions & Tools */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Install App Button */}
            {onOpenInstallModal && (
              <button
                id="navbar-install-app-btn"
                onClick={onOpenInstallModal}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 transition touch-manipulation group"
                title="تنزيل وتثبيت التطبيق على هاتفك (أندرويد وآيفون)"
                aria-label="تثبيت التطبيق"
              >
                <Download className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold hidden sm:inline">تحميل التطبيق</span>
              </button>
            )}

            {/* Search Button */}
            <button
              id="navbar-search-btn"
              onClick={onOpenSearch}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition touch-manipulation"
              title="البحث في جزء عم"
              aria-label="البحث"
            >
              <Search className="w-4 h-4 text-orange-400" />
            </button>

            {/* Bookmarks Button */}
            <button
              id="navbar-bookmarks-btn"
              onClick={onOpenBookmarks}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition touch-manipulation"
              title="العلامات المرجعية"
              aria-label="العلامات المرجعية"
            >
              <BookmarkIcon className="w-4 h-4 text-amber-400" />
            </button>

            {/* Settings Button */}
            <button
              id="navbar-settings-btn"
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition touch-manipulation"
              title="الإعدادات والخطوط والقارئ"
              aria-label="الإعدادات"
            >
              <Settings className="w-4 h-4 text-zinc-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
