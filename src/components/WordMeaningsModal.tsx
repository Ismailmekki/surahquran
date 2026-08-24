import React, { useState, useMemo } from 'react';
import { BookOpen, Search, X, Copy, Check, Volume2, Sparkles, Filter, ChevronDown } from 'lucide-react';
import { JUZ_AMMA_WORD_MEANINGS, searchWordMeanings, removeDiacritics, ALL_JUZ_AMMA_SURAHS, WordMeaning } from '../data';
import { toArabicNumerals, AyahEndMarker } from './MushafView';
import { Surah } from '../types';

interface WordMeaningsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSurahId: number;
  onSelectSurah?: (surahId: number) => void;
  onPlayAyah?: (surahId: number, ayahNumber: number) => void;
}

export const WordMeaningsModal: React.FC<WordMeaningsModalProps> = ({
  isOpen,
  onClose,
  currentSurahId,
  onSelectSurah,
  onPlayAyah,
}) => {
  const [selectedSurahId, setSelectedSurahId] = useState<number>(currentSurahId);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Synchronize with currentSurahId when opened
  React.useEffect(() => {
    if (isOpen) {
      setSelectedSurahId(currentSurahId);
      setSearchQuery('');
    }
  }, [isOpen, currentSurahId]);

  const currentSurahData = useMemo(() => {
    return JUZ_AMMA_WORD_MEANINGS.find((s) => s.surahId === selectedSurahId);
  }, [selectedSurahId]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchWordMeanings(searchQuery, removeDiacritics);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleCopy = (word: WordMeaning, surahName: string) => {
    const textToCopy = `«${word.word}» (سورة ${surahName} - الآية ${word.ayahNumber}): ${word.meaning}`;
    navigator.clipboard.writeText(textToCopy);
    const key = `${surahName}-${word.word}-${word.ayahNumber}`;
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const totalWordsInJuz = JUZ_AMMA_WORD_MEANINGS.reduce((acc, curr) => acc + curr.words.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        id="word-meanings-modal"
        className="bg-[#181a20] w-full max-w-4xl rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[92vh] text-white"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-800 border-b border-zinc-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-xl font-uthmani text-white flex items-center gap-2">
                <span>معاني الكلمات وغريب القرآن</span>
                <span className="text-[11px] sm:text-xs font-sans font-normal px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  جزء عمّ ({totalWordsInJuz} كلمة مشروحة)
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400 hidden sm:block">
                شرح وتبيان المفردات والألفاظ الغريبة في سور جزء عم بحسب كتب غريب القرآن والتفاسير المعتمدة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3 sm:p-4 bg-[#14161b] border-b border-zinc-800 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن كلمة قرآنية أو معنى (مثال: عَمَّ، غاسق، سجيل، كواعب)..."
              className="w-full pr-10 pl-9 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-orange-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Surah Selector Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-zinc-400 whitespace-nowrap hidden sm:inline">السورة:</span>
            <div className="relative flex-1 sm:w-56">
              <select
                value={selectedSurahId}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedSurahId(id);
                  setSearchQuery('');
                  if (onSelectSurah) onSelectSurah(id);
                }}
                className="w-full appearance-none bg-zinc-800 text-white text-xs sm:text-sm px-3.5 py-2.5 pr-8 pl-8 rounded-xl border border-zinc-700 focus:outline-hidden focus:border-orange-500 cursor-pointer font-medium"
              >
                {ALL_JUZ_AMMA_SURAHS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}. سورة {s.name} ({s.numberOfAyahs} آيات)
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* SEARCH RESULTS VIEW */}
          {searchResults !== null ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1 pb-1 border-b border-zinc-800">
                <span>نتائج البحث عن: «{searchQuery}»</span>
                <span className="text-orange-400 font-bold">{searchResults.length} نتيجة</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  <Search className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
                  <p className="text-sm font-medium">لم يتم العثور على نتائج مطابقة لـ «{searchQuery}»</p>
                  <p className="text-xs text-zinc-500 mt-1">جرب كتابة الكلمة بدون تشكيل أو البحث بجزء من المعنى</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {searchResults.map((item, idx) => {
                    const key = `${item.surahName}-${item.word.word}-${item.word.ayahNumber}`;
                    const isCopied = copiedKey === key;
                    return (
                      <div
                        key={idx}
                        className="bg-[#1f222a] p-4 rounded-2xl border border-zinc-700/80 hover:border-orange-500/60 transition shadow-sm space-y-2.5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                سورة {item.surahName}
                              </span>
                              <span className="text-xs text-zinc-400">
                                الآية {toArabicNumerals(item.word.ayahNumber)}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopy(item.word, item.surahName)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                              title="نسخ المعنى"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          <div className="text-lg font-bold font-uthmani text-white mb-1.5 text-right leading-relaxed flex items-center gap-2">
                            <span className="text-orange-400">﴿</span>
                            <span>{item.word.word}</span>
                            <span className="text-orange-400">﴾</span>
                          </div>

                          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed text-right font-sans">
                            {item.word.meaning}
                          </p>
                        </div>

                        {onPlayAyah && (
                          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-end">
                            <button
                              onClick={() => {
                                onPlayAyah(item.surahId, item.word.ayahNumber);
                                onClose();
                              }}
                              className="flex items-center gap-1.5 text-[11px] font-bold text-orange-400 hover:text-orange-300 transition"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>استمع للآية</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* SURAH WORDS LIST VIEW */
            <div className="space-y-4">
              {/* Surah title banner inside modal */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-gradient-to-r from-orange-600/20 via-zinc-800 to-zinc-800/80 border border-orange-500/30 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-orange-400 text-base">۞</span>
                  <h3 className="font-bold text-base sm:text-lg font-uthmani text-white">
                    معاني كلمات سورة {currentSurahData?.surahName}
                  </h3>
                </div>
                <div className="text-xs text-zinc-300">
                  عدد المفردات المشروحة: <span className="text-orange-400 font-bold">{currentSurahData?.words.length || 0} كلمة</span>
                </div>
              </div>

              {/* Grid of words */}
              {currentSurahData && currentSurahData.words.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentSurahData.words.map((word, idx) => {
                    const key = `${currentSurahData.surahName}-${word.word}-${word.ayahNumber}`;
                    const isCopied = copiedKey === key;

                    return (
                      <div
                        key={idx}
                        className="bg-[#1f222a] p-4 rounded-2xl border border-zinc-700/80 hover:border-orange-500/60 transition shadow-sm space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          {/* Top Meta */}
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-zinc-800 text-orange-400 border border-zinc-700 flex items-center gap-1">
                                <span>الآية</span>
                                <span>{toArabicNumerals(word.ayahNumber)}</span>
                              </span>
                            </div>

                            <button
                              onClick={() => handleCopy(word, currentSurahData.surahName)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                              title="نسخ المعنى"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {/* Quranic Word */}
                          <div className="text-lg sm:text-xl font-bold font-uthmani text-white mb-2 text-right leading-relaxed flex items-center gap-1.5">
                            <span className="text-orange-400 text-sm">﴿</span>
                            <span className="text-orange-100">{word.word}</span>
                            <span className="text-orange-400 text-sm">﴾</span>
                          </div>

                          {/* Meaning text */}
                          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed text-right font-sans">
                            {word.meaning}
                          </p>
                        </div>

                        {onPlayAyah && (
                          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-end">
                            <button
                              onClick={() => {
                                onPlayAyah(currentSurahData.surahId, word.ayahNumber);
                                onClose();
                              }}
                              className="flex items-center gap-1.5 text-[11px] font-bold text-orange-400 hover:text-orange-300 transition"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>استمع للآية</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-zinc-400">
                  لا توجد كلمات مسجلة لهذه السورة.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-zinc-800 bg-[#14161b] flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">منتقى من التفاسير وكتب غريب القرآن المعتمدة للناشئة والقراء</span>
            <span className="sm:hidden">غريب ألفاظ جزء عم</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-semibold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
