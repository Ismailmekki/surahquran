import React, { useEffect, useState } from 'react';
import { BookOpen, X, Sparkles, Languages, Volume2, Globe } from 'lucide-react';
import { Ayah, Surah } from '../types';
import { toArabicNumerals } from './MushafView';
import { AVAILABLE_LANGUAGES, TranslationLanguage } from '../data/translations';
import { getAyahTranslation, fetchSurahTranslation, subscribeToTranslations } from '../data/translationService';

interface TafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  ayah: Ayah | null;
  surah: Surah | null;
  selectedLanguageId?: string;
  onOpenLanguageModal?: () => void;
  onPlayAyah?: () => void;
}

export const TafsirModal: React.FC<TafsirModalProps> = ({
  isOpen,
  onClose,
  ayah,
  surah,
  selectedLanguageId = 'en',
  onOpenLanguageModal,
  onPlayAyah,
}) => {
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  useEffect(() => {
    if (!isOpen || !surah || !ayah) return;
    if (selectedLanguageId !== 'en') {
      fetchSurahTranslation(surah.id, selectedLanguageId).then(() => {
        setForceUpdate((c) => c + 1);
      });
    }
  }, [isOpen, surah?.id, ayah?.number, selectedLanguageId]);

  useEffect(() => {
    const unsub = subscribeToTranslations((sId, lId) => {
      if (surah && sId === surah.id && lId === selectedLanguageId) {
        setForceUpdate((prev) => prev + 1);
      }
    });
    return unsub;
  }, [surah?.id, selectedLanguageId]);

  if (!isOpen || !ayah || !surah) return null;

  const currentLang: TranslationLanguage =
    AVAILABLE_LANGUAGES.find((l) => l.id === selectedLanguageId) || AVAILABLE_LANGUAGES[0];

  const translationText = getAyahTranslation(ayah, selectedLanguageId, surah.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#181a20] w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[88vh] text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600/30 via-zinc-800 to-zinc-800 border-b border-zinc-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-white">
                التفسير والترجمة • سورة {surah.name} (الآية {toArabicNumerals(ayah.number)})
              </h2>
              <p className="text-xs text-zinc-400">
                التفسير الميسر المعتمد وترجمة المعاني بمختلف اللغات
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Ayah Box */}
          <div className="p-5 rounded-3xl bg-[#1f222a] border border-zinc-700 text-center shadow-inner">
            <span className="text-xs text-orange-400 font-bold block mb-2">
              ﴿ سُورَةُ {surah.name} - الآية {ayah.number} ﴾
            </span>
            <div className="text-xl sm:text-2xl font-quran leading-loose text-white">
              {ayah.text}
            </div>
          </div>

          {/* Tafsir Al-Muyassar */}
          <div className="p-5 rounded-2xl bg-[#252833] border border-zinc-700/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>التفسير والبيان (التفسير الميسر):</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
              {ayah.tafsir}
            </p>
          </div>

          {/* Multi-Language Translation */}
          <div 
            className="p-4 sm:p-5 rounded-2xl bg-[#14161b] border border-zinc-800 space-y-2 transition" 
            dir={currentLang.direction}
          >
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                <span className="text-base">{currentLang.flag}</span>
                <span>ترجمة المعاني ({currentLang.name} - {currentLang.translator}):</span>
              </div>

              {onOpenLanguageModal && (
                <button
                  onClick={onOpenLanguageModal}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition"
                  title="تغيير لغة الترجمة"
                >
                  <Globe className="w-3.5 h-3.5 text-orange-400" />
                  <span>تغيير اللغة</span>
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {translationText}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#14161b] flex items-center justify-between">
          {onPlayAyah ? (
            <button
              onClick={() => {
                onPlayAyah();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-950/40 transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>استماع للتلاوة</span>
            </button>
          ) : <div />}

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
