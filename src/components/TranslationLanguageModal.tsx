import React, { useState, useMemo } from 'react';
import { Languages, X, Check, Search, Globe, Sparkles } from 'lucide-react';
import { AVAILABLE_LANGUAGES, TranslationLanguage } from '../data/translations';

interface TranslationLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguageId: string;
  onSelectLanguage: (langId: string) => void;
  showTranslation: boolean;
  onToggleShowTranslation: (show: boolean) => void;
}

export const TranslationLanguageModal: React.FC<TranslationLanguageModalProps> = ({
  isOpen,
  onClose,
  selectedLanguageId,
  onSelectLanguage,
  showTranslation,
  onToggleShowTranslation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return AVAILABLE_LANGUAGES;
    const q = searchQuery.toLowerCase().trim();
    return AVAILABLE_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nameAr.toLowerCase().includes(q) ||
        l.translator.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const currentLang = AVAILABLE_LANGUAGES.find((l) => l.id === selectedLanguageId) || AVAILABLE_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        id="translation-language-modal"
        className="bg-[#181a20] w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[90vh] text-white"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-800 border-b border-zinc-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                <span>لغات ترجمة معاني القرآن الكريم</span>
                <span className="text-[11px] font-sans px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  {AVAILABLE_LANGUAGES.length} لغة
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                اختر لغة الترجمة لعرضها تحت كل آية في القراءة التفسيرية ومود العرض
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

        {/* Global Visibility Switch */}
        <div className="p-3.5 sm:p-4 bg-[#14161b] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-orange-400" />
            <span className="text-xs sm:text-sm font-medium text-zinc-200">
              تفعيل وإظهار الترجمة مع الآيات
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showTranslation}
              onChange={(e) => onToggleShowTranslation(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        {/* Search input */}
        <div className="p-3 sm:p-4 bg-[#14161b] border-b border-zinc-800">
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اللغة أو المترجم (English, Français, اردو, Türkçe, Español...)..."
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
        </div>

        {/* Languages Grid */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 space-y-2">
          <div className="text-xs text-zinc-400 mb-2 px-1 flex items-center justify-between">
            <span>اللغات المتوفرة المعتمدة عالمياً</span>
            <span className="text-orange-400 font-medium">اللغة الحالية: {currentLang.flag} {currentLang.name}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredLanguages.map((lang) => {
              const isSelected = lang.id === selectedLanguageId;
              return (
                <button
                  key={lang.id}
                  id={`lang-btn-${lang.id}`}
                  onClick={() => {
                    onSelectLanguage(lang.id);
                    if (!showTranslation) {
                      onToggleShowTranslation(true);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-right transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#252833] border-orange-500 ring-2 ring-orange-500/40 text-white'
                      : 'bg-zinc-800/60 border-zinc-700/80 hover:border-orange-500/60 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl select-none">{lang.flag}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{lang.name}</span>
                        {lang.direction === 'rtl' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-700 text-zinc-300">
                            RTL
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-orange-400 mt-0.5">
                        {lang.nameAr}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-sans mt-0.5">
                        المترجم: {lang.translator}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="text-center py-10 text-zinc-400">
              <Languages className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
              <p className="text-sm">لم يتم العثور على لغة مطابقة لـ «{searchQuery}»</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-zinc-800 bg-[#14161b] flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>يتم تحميل وحفظ الترجمات المختارة للعمل أوفلاين</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-orange-950/40"
          >
            تم
          </button>
        </div>
      </div>
    </div>
  );
};
