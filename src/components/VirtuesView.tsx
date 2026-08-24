import React, { useState } from 'react';
import { Sparkles, BookOpen, Search, ChevronLeft } from 'lucide-react';
import { ALL_JUZ_AMMA_SURAHS, removeDiacritics } from '../data';
import { Surah } from '../types';

interface VirtuesViewProps {
  onSelectSurah: (surah: Surah) => void;
}

export const VirtuesView: React.FC<VirtuesViewProps> = ({ onSelectSurah }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = ALL_JUZ_AMMA_SURAHS.filter((s) => {
    if (!searchQuery) return true;
    const q = removeDiacritics(searchQuery.toLowerCase());
    const nameMatch = removeDiacritics(s.name.toLowerCase()).includes(q);
    const themeMatch = s.theme && removeDiacritics(s.theme.toLowerCase()).includes(q);
    const virtueMatch = s.virtue && removeDiacritics(s.virtue.toLowerCase()).includes(q);
    return nameMatch || themeMatch || virtueMatch;
  });

  return (
    <div id="virtues-view-container" className="max-w-5xl mx-auto px-3 sm:px-6 py-6 pb-44 sm:pb-40 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8 border border-zinc-700/80">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-orange-400" />
          <h2 className="text-xl sm:text-2xl font-bold font-uthmani text-white">
            فضائل ومقاصد سور جزء عم
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
          تعرف على أسرار ومقاصد وفضائل كل سورة من سور جزء عم المبارك، وأسباب نزولها ومحاورها الكبرى لتدبر آيات الله وتلاوتها بوعي وخشوع.
        </p>

        {/* Search Bar inside header */}
        <div className="mt-6 relative max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في فضائل السور أو أسمائها..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Grid of Surah Virtues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSurahs.map((surah) => (
          <div
            key={surah.id}
            className="bg-[#1c1f26] rounded-3xl p-5 border border-zinc-800 shadow-sm hover:border-orange-500/80 transition flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 text-orange-400 font-bold text-xs flex items-center justify-center border border-zinc-700">
                    {surah.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      سورة {surah.name}
                    </h3>
                    <span className="text-[11px] text-zinc-400">
                      {surah.englishName} • {surah.revelationType} • {surah.numberOfAyahs} آيات
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectSurah(surah)}
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white shadow-sm transition"
                >
                  <span>تلاوة السورة</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Theme & Topic */}
              {surah.theme && (
                <div className="text-xs text-zinc-300 leading-relaxed mb-3">
                  <span className="font-bold text-orange-400 block mb-1">
                    المحور والموضوع العام:
                  </span>
                  {surah.theme}
                </div>
              )}

              {/* Virtue Badge */}
              {surah.virtue && (
                <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 text-xs text-zinc-200 leading-relaxed">
                  <span className="font-bold text-orange-400 block mb-0.5">★ الفضل والأثر الإيماني:</span>
                  {surah.virtue}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
