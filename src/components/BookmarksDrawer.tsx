import React from 'react';
import { Bookmark, X, Trash2, ChevronLeft } from 'lucide-react';
import { ALL_JUZ_AMMA_SURAHS, getSurahById } from '../data';
import { Surah, Ayah } from '../types';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: { surahId: number; ayahNumber: number }[];
  onSelectBookmark: (surah: Surah, ayahNumber: number) => void;
  onRemoveBookmark: (surahId: number, ayahNumber: number) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectBookmark,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#181a20] w-full max-w-md h-full shadow-2xl border-l border-zinc-800 flex flex-col text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-orange-400 fill-current" />
            <h2 className="font-bold text-white text-base">
              الآيات المحفوظة ({bookmarks.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="text-center py-16 text-zinc-400 text-xs sm:text-sm">
              <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-30 text-orange-400" />
              لا توجد آيات محفوظة حالياً.
              <p className="mt-1 text-zinc-500 text-xs">
                اضغط على أيقونة الإشارة المرجعية 🔖 عند أي آية لحفظها هنا والرجوع إليها لاحقاً.
              </p>
            </div>
          ) : (
            bookmarks.map((bm) => {
              const surah = getSurahById(bm.surahId);
              const ayah = surah?.ayahs.find((a) => a.number === bm.ayahNumber);
              if (!surah || !ayah) return null;

              return (
                <div
                  key={`${bm.surahId}-${bm.ayahNumber}`}
                  className="p-4 rounded-2xl bg-[#22252e] border border-zinc-700 hover:border-orange-500/80 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-orange-400">
                      سورة {surah.name} • الآية {ayah.number}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onSelectBookmark(surah, ayah.number);
                          onClose();
                        }}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold shadow-sm transition"
                      >
                        <span>انتقال</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onRemoveBookmark(surah.id, ayah.number)}
                        className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition"
                        title="حذف من المحفوظات"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="font-quran text-base sm:text-lg text-white leading-relaxed">
                    {ayah.text}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
