import React, { useState } from 'react';
import { Search, X, BookOpen, ChevronLeft } from 'lucide-react';
import { searchJuzAmma } from '../data';
import { Surah, Ayah } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (surah: Surah, ayahNumber: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = searchJuzAmma(query);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#181a20] w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[85vh] text-white">
        {/* Header with Search Input */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-orange-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن كلمة، آية، أو معنى في جزء عم..."
            className="w-full bg-transparent text-white placeholder-zinc-500 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-bold hover:bg-orange-500 hover:text-white transition"
          >
            إغلاق
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {query.trim().length === 0 ? (
            <div className="text-center py-12 text-zinc-400 text-xs sm:text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-orange-400" />
              اكتب للبحث في القرآن الكريم والتفسير الميسر والترجمة الإنجليزية
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 text-xs sm:text-sm">
              لم يتم العثور على نتائج مطابقة لـ "{query}" في جزء عم.
            </div>
          ) : (
            results.map((res, idx) => (
              <div
                key={`${res.surah.id}-${res.ayah.number}-${idx}`}
                onClick={() => {
                  onSelectResult(res.surah, res.ayah.number);
                  onClose();
                }}
                className="p-4 rounded-2xl bg-[#22252e] hover:bg-[#282d38] border border-zinc-700 hover:border-orange-500 cursor-pointer transition flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1 text-right flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-orange-400">
                      سورة {res.surah.name} • الآية {res.ayah.number}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {res.matchType === 'arabic'
                        ? 'نص الآية'
                        : res.matchType === 'tafsir'
                        ? 'في التفسير'
                        : 'في الترجمة'}
                    </span>
                  </div>

                  <div className="font-quran text-base sm:text-lg text-white">
                    {res.ayah.text}
                  </div>

                  <div className="text-xs text-zinc-400 line-clamp-1">
                    {res.ayah.tafsir}
                  </div>
                </div>

                <ChevronLeft className="w-4 h-4 text-zinc-500 group-hover:text-orange-400 mt-2 shrink-0 transition" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
