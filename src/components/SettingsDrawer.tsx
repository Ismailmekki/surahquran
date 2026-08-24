import React from 'react';
import { Settings, X, Moon, Sun, Type, Sliders, Globe, Languages } from 'lucide-react';
import { RECITERS } from '../data/reciters';
import { AVAILABLE_LANGUAGES, TranslationLanguage } from '../data/translations';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  fontFamily: string;
  theme: string;
  reciterId: string;
  showTranslation: boolean;
  showTafsir: boolean;
  selectedLanguageId: string;
  onUpdateFontSize: (size: number) => void;
  onUpdateFontFamily: (font: string) => void;
  onUpdateTheme: (theme: string) => void;
  onUpdateReciter: (id: string) => void;
  onUpdateLanguage: (langId: string) => void;
  onToggleTranslation: (show: boolean) => void;
  onToggleTafsir: (show: boolean) => void;
  onOpenLanguageModal?: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  fontSize,
  fontFamily,
  theme,
  reciterId,
  showTranslation,
  showTafsir,
  selectedLanguageId,
  onUpdateFontSize,
  onUpdateFontFamily,
  onUpdateTheme,
  onUpdateReciter,
  onUpdateLanguage,
  onToggleTranslation,
  onToggleTafsir,
  onOpenLanguageModal,
}) => {
  if (!isOpen) return null;

  const currentLang = AVAILABLE_LANGUAGES.find((l) => l.id === selectedLanguageId) || AVAILABLE_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#181a20] w-full max-w-md h-full shadow-2xl border-r border-zinc-800 flex flex-col text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-400" />
            <h2 className="font-bold text-white text-base">
              إعدادات الخط والترجمة والمظهر
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Translation Language Selector */}
          <div className="p-4 rounded-2xl bg-[#1d2027] border border-orange-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold text-orange-400">
                <Globe className="w-4 h-4" />
                <span>لغة ترجمة القرآن ({AVAILABLE_LANGUAGES.length} لغة):</span>
              </label>
              {onOpenLanguageModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenLanguageModal();
                  }}
                  className="text-[11px] text-zinc-300 hover:text-orange-400 underline transition"
                >
                  استعراض الكل
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={selectedLanguageId}
                onChange={(e) => onUpdateLanguage(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-medium text-white focus:outline-hidden focus:border-orange-500 cursor-pointer"
              >
                {AVAILABLE_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.flag} {l.name} — {l.nameAr} ({l.translator})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <span>اللغة المختارة حالياً:</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>{currentLang.flag}</span>
                <span>{currentLang.name}</span>
              </span>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2">
              المظهر العام (الخلفية والألوان):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'gray-orange', label: 'رمادي وبرتقالي ⚡' },
                { id: 'dark-gray', label: 'رمادي غامق 🖤' },
                { id: 'slate', label: 'رمادي فاتح كلاسيكي 🩶' },
                { id: 'charcoal', label: 'فحمي عميق 🌑' },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => onUpdateTheme(th.id)}
                  className={`p-3 rounded-2xl text-xs font-bold border text-center transition ${
                    theme === th.id
                      ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-950/40'
                      : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:border-orange-500 hover:text-white'
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2">
              نوع الخط القرآني:
            </label>
            <div className="space-y-2">
              {[
                { id: 'Amiri', name: 'خط الأميري القرآني (رسم عثماني أصيل)', preview: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
                { id: 'Noto Naskh', name: 'خط النسخ (واضح ومريح للعين)', preview: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
                { id: 'Cairo', name: 'خط حديث (Cairo)', preview: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateFontFamily(f.id)}
                  className={`w-full p-3.5 rounded-2xl border text-right transition ${
                    fontFamily === f.id
                      ? 'bg-[#242833] border-orange-500 ring-2 ring-orange-500/30 text-white'
                      : 'bg-zinc-800/60 border-zinc-700 hover:border-zinc-500 text-zinc-300'
                  }`}
                >
                  <div className="text-xs font-bold text-white mb-1">{f.name}</div>
                  <div className="text-base text-orange-400" style={{ fontFamily: f.id === 'Cairo' ? 'Cairo' : f.id === 'Noto Naskh' ? 'Noto Naskh Arabic' : 'Amiri Quran' }}>
                    {f.preview}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-300">
                حجم خط الآيات ({fontSize}px):
              </label>
              <button
                onClick={() => onUpdateFontSize(28)}
                className="text-[11px] text-orange-400 hover:underline"
              >
                استعادة الافتراضي (28px)
              </button>
            </div>
            <input
              type="range"
              min="20"
              max="44"
              step="2"
              value={fontSize}
              onChange={(e) => onUpdateFontSize(Number(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
              <span>صغير (20px)</span>
              <span>متوسط (28px)</span>
              <span>كبير جداً (44px)</span>
            </div>
          </div>

          {/* Default Reciter */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2">
              القارئ الافتراضي ({RECITERS.length} قارئ ورواية):
            </label>
            <select
              value={reciterId}
              onChange={(e) => onUpdateReciter(e.target.value)}
              className="w-full p-3 rounded-2xl bg-zinc-800 border border-zinc-700 text-xs font-medium text-white focus:outline-hidden focus:border-orange-500 cursor-pointer"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} {r.style ? `[${r.style}]` : ''} ({r.quality})
                </option>
              ))}
            </select>
          </div>

          {/* Display Toggles */}
          <div className="space-y-3 pt-3 border-t border-zinc-800">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-zinc-300">
                إظهار التفسير الميسر افتراضياً
              </span>
              <input
                type="checkbox"
                checked={showTafsir}
                onChange={(e) => onToggleTafsir(e.target.checked)}
                className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <span>إظهار الترجمة ({currentLang.flag} {currentLang.name})</span>
              </span>
              <input
                type="checkbox"
                checked={showTranslation}
                onChange={(e) => onToggleTranslation(e.target.checked)}
                className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
