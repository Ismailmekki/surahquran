import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Bookmark as BookmarkIcon, 
  BookOpen, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Languages,
  Sparkles,
  Repeat,
  Globe,
  Settings
} from 'lucide-react';
import { Surah, Ayah } from '../types';
import { IslamicSurahHeader } from './IslamicSurahHeader';
import { toArabicNumerals, AyahEndMarker } from './MushafView';
import { AVAILABLE_LANGUAGES, TranslationLanguage } from '../data/translations';
import { getAyahTranslation, fetchSurahTranslation, subscribeToTranslations } from '../data/translationService';

interface VerseByVerseViewProps {
  surah: Surah;
  currentAyahIndex: number;
  isPlaying: boolean;
  fontSize: number;
  fontFamily: string;
  showTranslation: boolean;
  showTafsir: boolean;
  selectedLanguageId: string;
  onChangeLanguage?: (langId: string) => void;
  onOpenLanguageModal?: () => void;
  bookmarks: { surahId: number; ayahNumber: number }[];
  onPlayAyah: (ayahIndex: number) => void;
  onToggleBookmark: (surahId: number, ayahNumber: number) => void;
  onNextSurah: () => void;
  onPrevSurah: () => void;
  hasPrevSurah: boolean;
  hasNextSurah: boolean;
}

export const VerseByVerseView: React.FC<VerseByVerseViewProps> = ({
  surah,
  currentAyahIndex,
  isPlaying,
  fontSize,
  fontFamily,
  showTranslation: defaultShowTranslation,
  showTafsir: defaultShowTafsir,
  selectedLanguageId,
  onChangeLanguage,
  onOpenLanguageModal,
  bookmarks,
  onPlayAyah,
  onToggleBookmark,
  onNextSurah,
  onPrevSurah,
  hasPrevSurah,
  hasNextSurah,
}) => {
  const [localShowTranslation, setLocalShowTranslation] = useState<boolean>(defaultShowTranslation);
  const [localShowTafsir, setLocalShowTafsir] = useState<boolean>(defaultShowTafsir);
  const [expandedTafsirAyah, setExpandedTafsirAyah] = useState<number | null>(null);
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);
  const [forceUpdate, setForceUpdate] = useState<number>(0);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState<boolean>(false);

  // Sync with default props
  useEffect(() => {
    setLocalShowTranslation(defaultShowTranslation);
  }, [defaultShowTranslation]);

  useEffect(() => {
    setLocalShowTafsir(defaultShowTafsir);
  }, [defaultShowTafsir]);

  // Listen to translation loads
  useEffect(() => {
    const unsub = subscribeToTranslations((sId, lId) => {
      if (sId === surah.id && lId === selectedLanguageId) {
        setForceUpdate((prev) => prev + 1);
        setIsLoadingTranslation(false);
      }
    });
    return unsub;
  }, [surah.id, selectedLanguageId]);

  // Fetch translation if needed when surah or language changes
  useEffect(() => {
    if (selectedLanguageId !== 'en' && localShowTranslation) {
      setIsLoadingTranslation(true);
      fetchSurahTranslation(surah.id, selectedLanguageId).then(() => {
        setIsLoadingTranslation(false);
        setForceUpdate((c) => c + 1);
      });
    }
  }, [surah.id, selectedLanguageId, localShowTranslation]);

  const currentLang: TranslationLanguage = 
    AVAILABLE_LANGUAGES.find((l) => l.id === selectedLanguageId) || AVAILABLE_LANGUAGES[0];

  const handleCopy = (ayah: Ayah) => {
    const trans = getAyahTranslation(ayah, selectedLanguageId, surah.id);
    const text = `﴿ ${ayah.text} ﴾ [سورة ${surah.name}: ${ayah.number}]\n\nالتفسير: ${ayah.tafsir}\n\nTranslation (${currentLang.name}): ${trans}`;
    navigator.clipboard.writeText(text);
    setCopiedAyahNumber(ayah.number);
    setTimeout(() => setCopiedAyahNumber(null), 2000);
  };

  return (
    <div id="verse-by-verse-container" className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-44 sm:pb-40">
      {/* Authentic Islamic Surah Header Rectangle */}
      <IslamicSurahHeader surah={surah} showJuzBadge={true} />

      {/* Top Header & Global Toggles */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-zinc-800/90 backdrop-blur-md p-4 rounded-3xl border border-zinc-700 shadow-md">
        <div className="text-center sm:text-right">
          <h2 className="font-bold text-white text-base sm:text-lg flex items-center justify-center sm:justify-start gap-2">
            <span>سورة {surah.name}</span>
            <span className="text-xs text-orange-400 font-normal">({surah.englishName})</span>
          </h2>
          <span className="text-xs text-zinc-400">
            الصفحة {toArabicNumerals(surah.pageNumber)} بالمصحف الشريف
          </span>
        </div>

        {/* Global toggles for translation & tafsir */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Language Selector Modal Button */}
          {onOpenLanguageModal && (
            <button
              id="select-language-btn"
              onClick={onOpenLanguageModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-zinc-800 text-orange-300 border border-orange-500/40 hover:bg-orange-500/20 hover:text-white transition shadow-xs"
              title="تغيير لغة الترجمة لجميع اللغات"
            >
              <span className="text-sm">{currentLang.flag}</span>
              <span className="hidden xs:inline">{currentLang.name}</span>
              <Globe className="w-3.5 h-3.5 ml-0.5 text-orange-400" />
            </button>
          )}

          {/* Tafsir Toggle */}
          <button
            id="toggle-all-tafsir-btn"
            onClick={() => setLocalShowTafsir(!localShowTafsir)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
              localShowTafsir
                ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-950/40'
                : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:border-orange-500 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{localShowTafsir ? 'إخفاء التفسير' : 'إظهار التفسير'}</span>
          </button>

          {/* Translation Toggle */}
          <button
            id="toggle-all-translation-btn"
            onClick={() => {
              const next = !localShowTranslation;
              setLocalShowTranslation(next);
              if (next && selectedLanguageId !== 'en') {
                fetchSurahTranslation(surah.id, selectedLanguageId);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
              localShowTranslation
                ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-950/40'
                : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:border-orange-500 hover:text-white'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{localShowTranslation ? 'إخفاء الترجمة' : `ترجمة (${currentLang.name})`}</span>
          </button>
        </div>
      </div>

      {/* Surah Theme & Virtue card if available */}
      {surah.theme && (
        <div className="mb-6 p-5 rounded-3xl bg-[#1f222b] border border-zinc-700 shadow-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
              <span className="font-bold text-white block mb-1">
                محور وموضوع السورة:
              </span>
              {surah.theme}
              {surah.virtue && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-orange-950/40 border border-orange-700/40 text-orange-200 font-medium">
                  ★ فضلها: {surah.virtue}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bismillah Header */}
      {surah.id !== 9 && (
        <div className="text-center my-6 py-4 bg-[#1d2027] rounded-2xl border border-zinc-700">
          <span className="text-xl sm:text-2xl font-quran text-white">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </div>
      )}

      {/* List of Ayahs */}
      <div className="space-y-4">
        {surah.ayahs.map((ayah, index) => {
          const isCurrentPlaying = isPlaying && currentAyahIndex === index;
          const isBookmarked = bookmarks.some(
            (b) => b.surahId === surah.id && b.ayahNumber === ayah.number
          );
          const isTafsirOpen = localShowTafsir || expandedTafsirAyah === ayah.number;
          const translationText = getAyahTranslation(ayah, selectedLanguageId, surah.id);

          return (
            <div
              key={ayah.number}
              id={`ayah-card-${surah.id}-${ayah.number}`}
              className={`rounded-3xl transition-all duration-300 p-5 sm:p-6 border ${
                isCurrentPlaying
                  ? 'bg-[#222530] border-orange-500/80 shadow-lg border-b-4 border-b-orange-500'
                  : 'bg-[#1d2027] border-zinc-700 hover:border-zinc-600 shadow-md'
              }`}
            >
              {/* Ayah Header Toolbar */}
              <div className="flex items-center justify-between border-b border-zinc-750 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <AyahEndMarker number={ayah.number} isPlaying={isCurrentPlaying} />
                  <span className="text-xs text-zinc-400 font-medium">
                    الآية {ayah.number}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Play Single Ayah */}
                  <button
                    id={`play-ayah-btn-${ayah.number}`}
                    onClick={() => onPlayAyah(index)}
                    className={`p-2.5 rounded-xl transition ${
                      isCurrentPlaying
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-zinc-800 text-white hover:bg-orange-500 border border-zinc-700'
                    }`}
                    title={isCurrentPlaying ? 'إيقاف مؤقت' : 'استماع للآية'}
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  {/* Bookmark Button */}
                  <button
                    id={`bookmark-ayah-btn-${ayah.number}`}
                    onClick={() => onToggleBookmark(surah.id, ayah.number)}
                    className={`p-2.5 rounded-xl transition ${
                      isBookmarked
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-zinc-800 text-white hover:bg-orange-500 border border-zinc-700'
                    }`}
                    title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ الآية'}
                  >
                    <BookmarkIcon className="w-4 h-4 fill-current" />
                  </button>

                  {/* Copy Button */}
                  <button
                    id={`copy-ayah-btn-${ayah.number}`}
                    onClick={() => handleCopy(ayah)}
                    className="p-2.5 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 transition"
                    title="نسخ الآية والترجمة والتفسير"
                  >
                    {copiedAyahNumber === ayah.number ? (
                      <Check className="w-4 h-4 text-orange-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Toggle Individual Tafsir */}
                  <button
                    id={`toggle-tafsir-btn-${ayah.number}`}
                    onClick={() =>
                      setExpandedTafsirAyah(expandedTafsirAyah === ayah.number ? null : ayah.number)
                    }
                    className={`p-2.5 rounded-xl text-xs flex items-center gap-1 transition ${
                      isTafsirOpen
                        ? 'bg-orange-500 text-white font-bold border border-orange-400'
                        : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
                    }`}
                    title="التفسير الميسر"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Quranic Text */}
              <div
                className="font-quran leading-[2.4] text-white my-3 select-text"
                style={{
                  fontSize: `${fontSize}px`,
                  fontFamily:
                    fontFamily === 'Cairo'
                      ? 'Cairo, sans-serif'
                      : fontFamily === 'Noto Naskh'
                      ? 'Noto Naskh Arabic, serif'
                      : 'Amiri Quran, Amiri, serif',
                }}
              >
                {ayah.text}
              </div>

              {/* Tafsir Block */}
              {isTafsirOpen && (
                <div className="mt-4 p-4 rounded-2xl bg-[#252934] border border-zinc-700 text-xs sm:text-sm text-zinc-200 leading-relaxed animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-orange-400 font-bold mb-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>التفسير الميسر:</span>
                  </div>
                  <p>{ayah.tafsir}</p>
                </div>
              )}

              {/* Multi-Language Translation Block */}
              {localShowTranslation && (
                <div 
                  className="mt-3 p-4 rounded-2xl bg-[#191b22] border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans transition" 
                  dir={currentLang.direction}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-zinc-800/80">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-400">
                      <span>{currentLang.flag}</span>
                      <span>{currentLang.name} ({currentLang.translator}):</span>
                    </div>
                    {onOpenLanguageModal && (
                      <button
                        onClick={onOpenLanguageModal}
                        className="text-[10px] text-zinc-400 hover:text-orange-300 transition"
                      >
                        تغيير اللغة
                      </button>
                    )}
                  </div>
                  <p className="leading-relaxed">
                    {translationText}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
