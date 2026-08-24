import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  RotateCcw, 
  EyeOff, 
  Eye, 
  Award, 
  CheckCircle2, 
  Play, 
  Pause, 
  Check, 
  Sparkles,
  HelpCircle,
  Clock,
  Shuffle,
  ChevronRight,
  ChevronLeft,
  Square
} from 'lucide-react';
import { Surah, Ayah, RepeatScope, HifzRangeConfig } from '../types';
import { ALL_JUZ_AMMA_SURAHS } from '../data';
import { toArabicNumerals, AyahEndMarker } from './MushafView';

interface MemorizationModeProps {
  currentSurah: Surah;
  onSelectSurah: (surah: Surah) => void;
  onPlayAyah: (ayahIndex: number) => void;
  onStartHifzRepeat: (config: {
    fromAyah: number;
    toAyah: number;
    repeatPerAyah: number;
    repeatRangeCount: number;
    pauseDuration: number;
  }) => void;
  isPlaying: boolean;
  currentAyahIndex: number;
  repeatScope: RepeatScope;
  repeatCount: number;
  currentRepeatIteration: number;
  hifzRange: HifzRangeConfig | null;
  onStopHifzRepeat: () => void;
}

type HifzSubTab = 'repetition' | 'masking' | 'ordering' | 'tracker';

export const MemorizationMode: React.FC<MemorizationModeProps> = ({
  currentSurah,
  onSelectSurah,
  onPlayAyah,
  onStartHifzRepeat,
  isPlaying,
  currentAyahIndex,
  repeatScope,
  repeatCount,
  currentRepeatIteration,
  hifzRange,
  onStopHifzRepeat,
}) => {
  const [activeTab, setActiveTab] = useState<HifzSubTab>('repetition');

  // Repetition Teacher state
  const [fromAyah, setFromAyah] = useState<number>(1);
  const [toAyah, setToAyah] = useState<number>(Math.min(5, currentSurah.numberOfAyahs));
  const [repeatPerAyah, setRepeatPerAyah] = useState<number>(3);
  const [repeatRangeCount, setRepeatRangeCount] = useState<number>(1); // 1, 3, 5, -1
  const [pauseDuration, setPauseDuration] = useState<number>(2); // seconds between repeats

  // Masking state
  const [maskType, setMaskType] = useState<'half' | 'ends' | 'first-letter' | 'all'>('half');
  const [revealedWords, setRevealedWords] = useState<Record<string, boolean>>({});

  // Ordering quiz state
  const [quizAyahs, setQuizAyahs] = useState<{ id: number; text: string; correctOrder: number }[]>([]);
  const [userSelection, setUserSelection] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number } | null>(null);

  // Hifz Tracker state (loaded from local storage)
  const [hifzStatus, setHifzStatus] = useState<Record<number, 'none' | 'memorizing' | 'completed' | 'revision'>>({});

  // Reset range defaults when surah changes
  useEffect(() => {
    setFromAyah(1);
    setToAyah(Math.min(5, currentSurah.numberOfAyahs));
  }, [currentSurah.id, currentSurah.numberOfAyahs]);

  // Load tracker from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('juz_amma_hifz_status');
      if (saved) {
        setHifzStatus(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update localStorage when hifzStatus changes
  const updateHifzStatus = (surahId: number, status: 'none' | 'memorizing' | 'completed' | 'revision') => {
    const updated = { ...hifzStatus, [surahId]: status };
    setHifzStatus(updated);
    try {
      localStorage.setItem('juz_amma_hifz_status', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Setup Ordering quiz when currentSurah or tab changes
  useEffect(() => {
    if (activeTab === 'ordering') {
      startNewQuiz();
    }
  }, [currentSurah, activeTab]);

  const startNewQuiz = () => {
    const count = Math.min(4, currentSurah.ayahs.length);
    // Take a slice of 4 ayahs (e.g. first 4 or random 4)
    const sliced = currentSurah.ayahs.slice(0, count).map((a, idx) => ({
      id: a.number,
      text: a.text,
      correctOrder: idx + 1,
    }));
    // Shuffle
    const shuffled = [...sliced].sort(() => Math.random() - 0.5);
    setQuizAyahs(shuffled);
    setUserSelection([]);
    setQuizFinished(false);
    setQuizScore(null);
  };

  const handleSelectQuizAyah = (ayahId: number) => {
    if (userSelection.includes(ayahId) || quizFinished) return;
    const nextSelection = [...userSelection, ayahId];
    setUserSelection(nextSelection);

    if (nextSelection.length === quizAyahs.length) {
      // Finished quiz, check score
      let correctCount = 0;
      nextSelection.forEach((selectedId, idx) => {
        if (selectedId === idx + 1) {
          correctCount++;
        }
      });
      setQuizScore({ correct: correctCount, total: quizAyahs.length });
      setQuizFinished(true);
    }
  };

  const toggleWordReveal = (key: string) => {
    setRevealedWords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderMaskedAyahText = (ayah: Ayah) => {
    const words = ayah.text.split(' ');

    return (
      <div className="flex flex-wrap gap-2 items-center leading-loose">
        {words.map((word, wIdx) => {
          const key = `${ayah.number}-${wIdx}`;
          const isRevealed = revealedWords[key];

          let shouldMask = false;
          let hintText = '';

          if (maskType === 'half') {
            shouldMask = wIdx % 2 === 1;
          } else if (maskType === 'ends') {
            shouldMask = wIdx >= words.length - 2;
          } else if (maskType === 'first-letter') {
            shouldMask = true;
            hintText = word.charAt(0) + '...';
          } else if (maskType === 'all') {
            shouldMask = true;
          }

          if (shouldMask && !isRevealed) {
            return (
              <button
                key={key}
                onClick={() => toggleWordReveal(key)}
                className="px-2 py-0.5 rounded-lg bg-amber-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-300 dark:hover:bg-stone-600 border border-amber-300 dark:border-stone-600 text-sm font-medium transition cursor-pointer"
                title="اضغط لكشف الكلمة"
              >
                {hintText || '[ ... ]'}
              </button>
            );
          }

          return (
            <span
              key={key}
              onClick={() => {
                if (shouldMask) toggleWordReveal(key);
              }}
              className={`transition duration-150 ${
                shouldMask && isRevealed ? 'text-emerald-700 dark:text-emerald-300 underline decoration-dotted' : ''
              }`}
            >
              {word}
            </span>
          );
        })}
        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-stone-800 rounded-full border border-amber-300 dark:border-stone-700">
          {toArabicNumerals(ayah.number)}
        </span>
      </div>
    );
  };

  // Calculate overall Hifz statistics
  const totalSurahs = ALL_JUZ_AMMA_SURAHS.length;
  const completedCount = Object.values(hifzStatus).filter((s) => s === 'completed').length;
  const memorizingCount = Object.values(hifzStatus).filter((s) => s === 'memorizing').length;
  const revisionCount = Object.values(hifzStatus).filter((s) => s === 'revision').length;
  const progressPercent = Math.round((completedCount / totalSurahs) * 100);

  return (
    <div id="memorization-mode-container" className="max-w-4xl mx-auto px-3 sm:px-6 py-6 pb-44 sm:pb-40">
      {/* Top Header & Sub-Tabs Navigation */}
      <div className="bg-[#1d2027] rounded-3xl p-5 sm:p-6 border border-zinc-700 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-orange-950/40">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                المصحف المعلم وأدوات التحفيظ
              </h2>
              <p className="text-xs text-zinc-400">
                سورة {currentSurah.name} • {currentSurah.numberOfAyahs} آيات
              </p>
            </div>
          </div>

          {/* Hifz Quick Status for current Surah */}
          <div className="flex items-center gap-1.5 bg-zinc-800/90 p-1.5 rounded-2xl border border-zinc-700">
            <button
              onClick={() => updateHifzStatus(currentSurah.id, 'memorizing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                hifzStatus[currentSurah.id] === 'memorizing'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-zinc-300 hover:text-orange-400'
              }`}
            >
              قيد الحفظ
            </button>
            <button
              onClick={() => updateHifzStatus(currentSurah.id, 'completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                hifzStatus[currentSurah.id] === 'completed'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-zinc-300 hover:text-emerald-400'
              }`}
            >
              تم الحفظ ✓
            </button>
            <button
              onClick={() => updateHifzStatus(currentSurah.id, 'revision')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                hifzStatus[currentSurah.id] === 'revision'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-zinc-300 hover:text-blue-400'
              }`}
            >
              مراجعة
            </button>
          </div>
        </div>

        {/* Sub-Tabs selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-zinc-750">
          <button
            id="tab-repetition"
            onClick={() => setActiveTab('repetition')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'repetition'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-950/40'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-750 hover:text-white border border-zinc-700/60'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>تكرار التلاوة</span>
          </button>

          <button
            id="tab-masking"
            onClick={() => setActiveTab('masking')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'masking'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-950/40'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-750 hover:text-white border border-zinc-700/60'
            }`}
          >
            <EyeOff className="w-4 h-4" />
            <span>إخفاء الكلمات</span>
          </button>

          <button
            id="tab-ordering"
            onClick={() => setActiveTab('ordering')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'ordering'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-950/40'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-750 hover:text-white border border-zinc-700/60'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span>اختبار الترتيب</span>
          </button>

          <button
            id="tab-tracker"
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'tracker'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-950/40'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-750 hover:text-white border border-zinc-700/60'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>سجل الحفظ ({progressPercent}%)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: REPETITION TEACHER MODE */}
      {activeTab === 'repetition' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-[#1d2027] p-5 sm:p-6 rounded-3xl border border-zinc-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-orange-400 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>إعدادات حلقة التكرار للتحفيظ (سورة {currentSurah.name}):</span>
              </h3>

              {hifzRange && isPlaying && (
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 animate-pulse font-medium">
                  حلقة التحفيظ تعمل الآن
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs sm:text-sm">
              {/* Range Selector */}
              <div>
                <label className="block text-zinc-300 mb-1.5 font-medium">
                  نطاق المقطع للحفظ:
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">من:</span>
                  <select
                    value={fromAyah}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFromAyah(val);
                      if (val > toAyah) setToAyah(val);
                    }}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-xs text-white flex-1"
                  >
                    {currentSurah.ayahs.map((a) => (
                      <option key={a.number} value={a.number}>
                        آية {a.number}
                      </option>
                    ))}
                  </select>

                  <span className="text-xs text-zinc-400">إلى:</span>
                  <select
                    value={toAyah}
                    onChange={(e) => setToAyah(Number(e.target.value))}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-xs text-white flex-1"
                  >
                    {currentSurah.ayahs
                      .filter((a) => a.number >= fromAyah)
                      .map((a) => (
                        <option key={a.number} value={a.number}>
                          آية {a.number}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Repetition Count per Ayah */}
              <div>
                <label className="block text-zinc-300 mb-1.5 font-medium">
                  تكرار كل آية:
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 5, 7, 10].map((count) => (
                    <button
                      key={count}
                      onClick={() => setRepeatPerAyah(count)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex-1 text-center ${
                        repeatPerAyah === count
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-orange-500'
                      }`}
                    >
                      {count}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Range Repeat Count */}
              <div>
                <label className="block text-zinc-300 mb-1.5 font-medium">
                  تكرار المقطع بالكامل:
                </label>
                <div className="flex items-center gap-1">
                  {[
                    { label: '١x', val: 1 },
                    { label: '٣x', val: 3 },
                    { label: '٥x', val: 5 },
                    { label: '∞', val: -1 },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setRepeatRangeCount(opt.val)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex-1 text-center ${
                        repeatRangeCount === opt.val
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-orange-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-end gap-2">
                {hifzRange && isPlaying ? (
                  <button
                    id="stop-hifz-repeat-btn"
                    onClick={onStopHifzRepeat}
                    className="w-full py-2.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/50 transition active:scale-98"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>إيقاف حلقة التحفيظ</span>
                  </button>
                ) : (
                  <button
                    id="start-hifz-repeat-btn"
                    onClick={() =>
                      onStartHifzRepeat({
                        fromAyah,
                        toAyah,
                        repeatPerAyah,
                        repeatRangeCount,
                        pauseDuration,
                      })
                    }
                    className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-orange-950/50 transition active:scale-98"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>بدء حلقة التحفيظ [{fromAyah} - {toAyah}]</span>
                  </button>
                )}
              </div>
            </div>

            {/* Pause setting bar */}
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-zinc-800 text-xs">
              <div className="flex items-center gap-2 text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>فاصل زمني للترديد والترتيل بعد كل تلاوة:</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 sm:mt-0">
                {[
                  { label: 'بدون فاصل', val: 0 },
                  { label: '١ ثانية', val: 1 },
                  { label: '٢ ثانية', val: 2 },
                  { label: '٣ ثوانٍ', val: 3 },
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setPauseDuration(p.val)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition ${
                      pauseDuration === p.val
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500 font-bold'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Repeating Status notification */}
          {hifzRange && isPlaying && (
            <div className="bg-gradient-to-r from-orange-950/80 to-amber-950/80 border border-orange-500/40 p-4 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                  {currentAyahIndex + 1}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    جاري تلاوة وتكرار الآية {currentAyahIndex + 1} (التكرار {currentRepeatIteration + 1} من {hifzRange.repeatPerAyah})
                  </div>
                  <div className="text-xs text-orange-300/80">
                    المقطع من الآية {hifzRange.fromAyah} إلى الآية {hifzRange.toAyah} • سورة {currentSurah.name}
                  </div>
                </div>
              </div>
              <button
                onClick={onStopHifzRepeat}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs border border-zinc-700 transition shrink-0"
              >
                إلغاء التكرار
              </button>
            </div>
          )}

          {/* Ayahs Display for Repetition with Live Highlight */}
          <div className="space-y-3">
            {currentSurah.ayahs
              .filter((a) => a.number >= fromAyah && a.number <= toAyah)
              .map((ayah) => {
                const isActive = currentAyahIndex === ayah.number - 1 && isPlaying;
                return (
                  <div
                    key={ayah.number}
                    onClick={() => onPlayAyah(ayah.number - 1)}
                    className={`p-5 rounded-3xl cursor-pointer border transition-all duration-200 ${
                      isActive
                        ? 'bg-[#222530] border-orange-500/80 border-b-4 border-b-orange-500 shadow-md'
                        : 'bg-[#1d2027] border-zinc-700 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AyahEndMarker number={ayah.number} isPlaying={isActive} />
                        <span className="text-xs font-bold text-zinc-300">
                          الآية {ayah.number}
                        </span>
                      </div>
                      {isActive && (
                        <span className="text-xs font-bold text-orange-400 flex items-center gap-1 animate-pulse">
                          <span>جارِ التلاوة</span>
                          <Sparkles className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="text-lg sm:text-xl font-quran leading-loose text-white">
                      {ayah.text}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 2: WORD MASKING / BLANKS TEST */}
      {activeTab === 'masking' && (
        <div className="space-y-6">
          {/* Mask Options */}
          <div className="bg-[#1d2027] p-5 rounded-3xl border border-zinc-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-bold text-white text-sm block mb-1">
                نمط إخفاء الكلمات للتسميع الذاتي:
              </span>
              <span className="text-xs text-zinc-400">
                اضغط على أي كلمة مخفية لكشفها عند الحاجة.
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'half', label: 'إخفاء ٥٠٪ من الكلمات' },
                { id: 'ends', label: 'إخفاء أواخر الآيات' },
                { id: 'first-letter', label: 'الحرف الأول فقط' },
                { id: 'all', label: 'إخفاء الآية كاملة' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setMaskType(opt.id as any);
                    setRevealedWords({});
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    maskType === opt.id
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-orange-500 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}

              <button
                onClick={() => setRevealedWords({})}
                className="px-3 py-1.5 rounded-xl text-xs bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 transition"
                title="إعادة إخفاء الكل"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Masked Quran Container */}
          <div className="bg-[#1d2027] rounded-3xl p-6 sm:p-8 border border-zinc-700 shadow-xl space-y-4">
            {currentSurah.ayahs.map((ayah) => (
              <div
                key={ayah.number}
                className="p-5 rounded-2xl bg-[#242833] border border-zinc-700"
              >
                <div className="text-xs text-orange-400 font-bold mb-2">
                  الآية {toArabicNumerals(ayah.number)}:
                </div>
                <div className="font-quran text-lg sm:text-xl text-white">
                  {renderMaskedAyahText(ayah)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AYAH ORDERING QUIZ */}
      {activeTab === 'ordering' && (
        <div className="space-y-6">
          <div className="bg-[#1d2027] p-6 sm:p-8 rounded-3xl border border-zinc-700 shadow-xl text-center">
            <h3 className="text-lg font-bold text-white mb-2">
              اختبار ترتيب آيات سورة {currentSurah.name}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-6">
              اختر الآيات بالترتيب الصحيح من البداية إلى النهاية لاختبار قوة حفظك وترابط السورة.
            </p>

            {/* Quiz Result if finished */}
            {quizFinished && quizScore && (
              <div className="mb-6 p-5 rounded-2xl bg-[#252934] border border-orange-500/80 animate-in zoom-in-95">
                <div className="flex items-center justify-center gap-2 text-white font-bold text-base mb-1">
                  <CheckCircle2 className="w-6 h-6 text-orange-400" />
                  <span>
                    النتيجة: {quizScore.correct} من {quizScore.total} آيات صحيحة!
                  </span>
                </div>
                <p className="text-xs text-zinc-300">
                  {quizScore.correct === quizScore.total
                    ? 'ما شاء الله تبارك الله! حفظك متقن وممتاز.'
                    : 'أحسنت المحاولة! استمر في المراجعة لترسيخ الآيات.'}
                </p>
                <button
                  onClick={startNewQuiz}
                  className="mt-3 px-5 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-400 shadow-md transition"
                >
                  إعادة الاختبار
                </button>
              </div>
            )}

            {/* Selected Sequence Slots */}
            <div className="space-y-2.5 mb-6 text-right">
              <span className="text-xs font-bold text-zinc-300 block mb-2">
                ترتيبك الحالي:
              </span>
              {userSelection.length === 0 ? (
                <div className="p-5 rounded-2xl border-2 border-dashed border-zinc-700 text-center text-xs text-zinc-500">
                  اضغط على الآيات في الأسفل لترتيبها بالتسلسل
                </div>
              ) : (
                userSelection.map((selectedId, idx) => {
                  const ayahObj = currentSurah.ayahs.find((a) => a.number === selectedId);
                  const isCorrect = selectedId === idx + 1;
                  return (
                    <div
                      key={selectedId}
                      className={`p-3.5 rounded-2xl flex items-center justify-between border text-xs sm:text-sm font-quran ${
                        quizFinished
                          ? isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950/60 border-rose-500 text-rose-200'
                          : 'bg-[#242833] border-zinc-700 text-white'
                      }`}
                    >
                      <span>
                        [{idx + 1}] {ayahObj?.text}
                      </span>
                      <span className="font-sans font-bold text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-white border border-zinc-700">
                        {quizFinished ? (isCorrect ? '✓ صحيح' : '✕ خطأ') : `الآية ${selectedId}`}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Shuffled Ayahs Pool */}
            <div className="text-right">
              <span className="text-xs font-bold text-zinc-300 block mb-2">
                الآيات المتاحة للاختيار:
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {quizAyahs.map((q) => {
                  const isSelected = userSelection.includes(q.id);
                  return (
                    <button
                      key={q.id}
                      disabled={isSelected || quizFinished}
                      onClick={() => handleSelectQuizAyah(q.id)}
                      className={`p-4 rounded-2xl text-right font-quran text-sm sm:text-base border transition ${
                        isSelected
                          ? 'opacity-30 bg-zinc-800 border-zinc-800 cursor-not-allowed text-zinc-500'
                          : 'bg-[#242833] border-zinc-700 hover:border-orange-500 hover:shadow-lg cursor-pointer text-white'
                      }`}
                    >
                      {q.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HIFZ PROGRESS TRACKER */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Statistics Card */}
          <div className="bg-gradient-to-br from-zinc-800 via-zinc-850 to-zinc-900 text-white p-6 sm:p-7 rounded-3xl border border-zinc-700 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1">سجل إنجاز حفظ جزء عم</h3>
                <p className="text-xs text-zinc-400">
                  تابع تقدمك في حفظ سور جزء عم الـ ٣٧ سورة خطوة بخطوة.
                </p>
              </div>
              <div className="text-center sm:text-left bg-orange-500/20 px-5 py-2.5 rounded-2xl border border-orange-500/40">
                <span className="text-3xl font-black text-orange-400">{progressPercent}%</span>
                <span className="text-[11px] block text-zinc-300">نسبة الإنجاز</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-950 rounded-full h-3.5 mb-5 p-0.5 border border-zinc-700">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Sub stats */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs pt-2">
              <div className="bg-zinc-800 p-3 rounded-2xl border border-zinc-700">
                <span className="font-bold text-lg block text-emerald-400">{completedCount}</span>
                <span className="text-[11px] text-zinc-400">تم حفظها</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-2xl border border-zinc-700">
                <span className="font-bold text-lg block text-orange-400">{memorizingCount}</span>
                <span className="text-[11px] text-zinc-400">قيد الحفظ</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-2xl border border-zinc-700">
                <span className="font-bold text-lg block text-blue-400">{revisionCount}</span>
                <span className="text-[11px] text-zinc-400">تحتاج مراجعة</span>
              </div>
            </div>
          </div>

          {/* Grid of All 37 Surahs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALL_JUZ_AMMA_SURAHS.map((s) => {
              const status = hifzStatus[s.id] || 'none';
              return (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl bg-[#1d2027] border border-zinc-700 shadow-md hover:border-orange-500/60 transition flex items-center justify-between"
                >
                  <div>
                    <button
                      onClick={() => onSelectSurah(s)}
                      className="font-bold text-sm text-white hover:text-orange-400 text-right block"
                    >
                      سورة {s.name}
                    </button>
                    <span className="text-[11px] text-zinc-400">
                      {s.numberOfAyahs} آيات • {s.revelationType}
                    </span>
                  </div>

                  <select
                    value={status}
                    onChange={(e) => updateHifzStatus(s.id, e.target.value as any)}
                    className={`text-xs font-semibold rounded-xl px-2.5 py-1.5 border transition cursor-pointer ${
                      status === 'completed'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                        : status === 'memorizing'
                        ? 'bg-orange-950/80 text-orange-300 border-orange-600'
                        : status === 'revision'
                        ? 'bg-blue-950/80 text-blue-300 border-blue-600'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    <option value="none">لم تبدأ</option>
                    <option value="memorizing">قيد الحفظ</option>
                    <option value="completed">تم الحفظ ✓</option>
                    <option value="revision">مراجعة</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
