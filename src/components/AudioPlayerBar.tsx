import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Volume1, 
  Volume2, 
  VolumeX, 
  Plus, 
  Minus, 
  User, 
  Gauge, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  BookOpen, 
  Layers, 
  Brain, 
  Search, 
  Bookmark, 
  BookMarked, 
  Languages, 
  Settings,
  Clock,
  Check
} from 'lucide-react';
import { RECITERS, getAyahAudioUrl } from '../data/reciters';
import { ALL_JUZ_AMMA_SURAHS, removeDiacritics } from '../data';
import { Surah, ViewMode, RepeatScope, HifzRangeConfig } from '../types';

interface AudioPlayerBarProps {
  currentSurah: Surah;
  currentAyahIndex: number;
  isPlaying: boolean;
  reciterId: string;
  repeatScope: RepeatScope;
  repeatCount: number; // 1, 2, 3, 5, 7, 10, -1 (infinity)
  currentRepeatIteration: number;
  pauseDuration: number;
  hifzRange: HifzRangeConfig | null;
  playbackSpeed: number;
  autoScroll: boolean;
  viewMode: ViewMode;
  bookmarksCount: number;
  replayNonce: number;
  onChangeViewMode: (mode: ViewMode) => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenWordMeanings: () => void;
  onOpenLanguageModal?: () => void;
  onOpenSettings: () => void;
  onSelectSurah: (surah: Surah) => void;
  onPlayPause: () => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  onSelectReciter: (id: string) => void;
  onSetRepeatConfig: (config: {
    repeatScope: RepeatScope;
    repeatCount: number;
    pauseDuration?: number;
    hifzRange?: HifzRangeConfig | null;
  }) => void;
  onSelectSpeed: (speed: number) => void;
  onToggleAutoScroll: () => void;
  onAyahEnded: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentSurah,
  currentAyahIndex,
  isPlaying,
  reciterId,
  repeatScope,
  repeatCount,
  currentRepeatIteration,
  pauseDuration,
  hifzRange,
  playbackSpeed,
  autoScroll,
  viewMode,
  bookmarksCount,
  replayNonce,
  onChangeViewMode,
  onOpenSearch,
  onOpenBookmarks,
  onOpenWordMeanings,
  onOpenLanguageModal,
  onOpenSettings,
  onSelectSurah,
  onPlayPause,
  onNextAyah,
  onPrevAyah,
  onSelectReciter,
  onSetRepeatConfig,
  onSelectSpeed,
  onToggleAutoScroll,
  onAyahEnded,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeDropdownRef = useRef<HTMLDivElement | null>(null);
  const repeatDropdownRef = useRef<HTMLDivElement | null>(null);
  const reciterDropdownRef = useRef<HTMLDivElement | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('juz_amma_volume');
    return saved !== null ? parseFloat(saved) : 1;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showReciterMenu, setShowReciterMenu] = useState<boolean>(false);
  const [reciterSearchFilter, setReciterSearchFilter] = useState<string>('');
  const [reciterCategoryFilter, setReciterCategoryFilter] = useState<string>('all');
  const [showRepeatMenu, setShowRepeatMenu] = useState<boolean>(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [showVolumeMenu, setShowVolumeMenu] = useState<boolean>(false);
  const [isWaitingForRepeatPause, setIsWaitingForRepeatPause] = useState<boolean>(false);

  // Local state for Range repeat editing in the popup
  const [localScopeTab, setLocalScopeTab] = useState<RepeatScope>(repeatScope);
  const [localFromAyah, setLocalFromAyah] = useState<number>(hifzRange ? hifzRange.fromAyah : 1);
  const [localToAyah, setLocalToAyah] = useState<number>(hifzRange ? hifzRange.toAyah : Math.min(5, currentSurah.numberOfAyahs));
  const [localRepeatPerAyah, setLocalRepeatPerAyah] = useState<number>(hifzRange ? hifzRange.repeatPerAyah : 3);
  const [localRangeCount, setLocalRangeCount] = useState<number>(hifzRange ? hifzRange.repeatRangeCount : 1);
  const [localPauseDuration, setLocalPauseDuration] = useState<number>(pauseDuration);

  const selectedReciter = RECITERS.find((r) => r.id === reciterId) || RECITERS[0];
  const currentAyah = currentSurah.ayahs[currentAyahIndex] || currentSurah.ayahs[0];

  const audioUrl = getAyahAudioUrl(selectedReciter.serverSubpath, currentSurah.id, currentAyah.number);

  // Keep local range inputs in sync when surah changes
  useEffect(() => {
    setLocalFromAyah(1);
    setLocalToAyah(Math.min(5, currentSurah.numberOfAyahs));
  }, [currentSurah.id, currentSurah.numberOfAyahs]);

  // Keep local scope tab in sync with global scope
  useEffect(() => {
    setLocalScopeTab(repeatScope);
    if (hifzRange) {
      setLocalFromAyah(hifzRange.fromAyah);
      setLocalToAyah(hifzRange.toAyah);
      setLocalRepeatPerAyah(hifzRange.repeatPerAyah);
      setLocalRangeCount(hifzRange.repeatRangeCount);
    }
    setLocalPauseDuration(pauseDuration);
  }, [repeatScope, hifzRange, pauseDuration]);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (volumeDropdownRef.current && !volumeDropdownRef.current.contains(event.target as Node)) {
        setShowVolumeMenu(false);
      }
      if (repeatDropdownRef.current && !repeatDropdownRef.current.contains(event.target as Node)) {
        setShowRepeatMenu(false);
      }
      if (reciterDropdownRef.current && !reciterDropdownRef.current.contains(event.target as Node)) {
        setShowReciterMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, Math.round(newVol * 100) / 100));
    setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
    localStorage.setItem('juz_amma_volume', clamped.toString());
  };

  const handleIncreaseVolume = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    handleVolumeChange(Math.min(1, Math.round((volume + 0.1) * 10) / 10));
  };

  const handleDecreaseVolume = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    handleVolumeChange(Math.max(0, Math.round((volume - 0.1) * 10) / 10));
  };

  const handleToggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsMuted(!isMuted);
  };

  // Update audio source when surah, ayah, or reciter changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.playbackRate = playbackSpeed;
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.log('Audio autoplay prevented or error:', e);
        });
      }
    }
  }, [audioUrl, playbackSpeed]);

  // Handle explicit audio replay trigger (crucial for repetition of same ayah / loop)
  useEffect(() => {
    if (replayNonce > 0 && audioRef.current && isPlaying) {
      if (pauseDuration > 0) {
        setIsWaitingForRepeatPause(true);
        if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = setTimeout(() => {
          setIsWaitingForRepeatPause(false);
          if (audioRef.current && isPlaying) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((e) => console.log('Replay error:', e));
          }
        }, pauseDuration * 1000);
      } else {
        setIsWaitingForRepeatPause(false);
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((e) => console.log('Replay error:', e));
      }
    }
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [replayNonce, pauseDuration]);

  // Handle play/pause toggle
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log('Audio play error:', e));
      } else {
        audioRef.current.pause();
        setIsWaitingForRepeatPause(false);
        if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      }
    }
  }, [isPlaying]);

  // Handle volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Helper label for repeat button
  const getRepeatButtonLabel = () => {
    if (repeatScope === 'range' && hifzRange) {
      return `مقطع [${hifzRange.fromAyah}-${hifzRange.toAyah}] (${currentRepeatIteration + 1}/${hifzRange.repeatPerAyah})`;
    }
    if (repeatScope === 'surah') {
      return `سورة (${repeatCount === -1 ? '∞' : `${currentRepeatIteration + 1}/${repeatCount}`})`;
    }
    if (repeatCount > 1 || repeatCount === -1) {
      return `آية (${repeatCount === -1 ? '∞' : `${currentRepeatIteration + 1}/${repeatCount}`})`;
    }
    return 'تكرار';
  };

  const isRepeatActive = repeatScope !== 'ayah' || repeatCount > 1 || repeatCount === -1;

  return (
    <div id="audio-player-container" className="fixed bottom-0 left-0 right-0 z-40 bg-[#16181d]/98 backdrop-blur-lg text-white border-t border-zinc-800 shadow-2xl transition-all duration-300">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onAyahEnded}
        onError={() => {
          console.warn('Audio stream fallback');
        }}
      />

      {/* --- Section 1: Audio Playback Controls Bar --- */}
      <div className="border-b border-zinc-800/80 bg-[#1b1e25]/90">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5">
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] sm:text-[11px] text-zinc-400 tabular-nums min-w-[28px]">{formatTime(currentTime)}</span>
            <input
              id="audio-seek-slider"
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
              aria-label="شريط تقدم التلاوة"
            />
            <span className="text-[10px] sm:text-[11px] text-zinc-400 tabular-nums min-w-[28px]">{formatTime(duration)}</span>
          </div>

          {/* Optional Repetition / Pause Status banner */}
          {isWaitingForRepeatPause && (
            <div className="flex items-center justify-center gap-1.5 py-1 mb-1.5 bg-orange-950/70 border border-orange-500/50 rounded-xl text-[11px] text-orange-200 animate-pulse">
              <Clock className="w-3 h-3 text-orange-400" />
              <span>وقفة للترديد والترتيل ({pauseDuration} ثوانٍ)...</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Juz Amma Brand Info & Reciter Selection under it */}
            <div className="relative flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 sm:flex-initial" ref={reciterDropdownRef}>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-md border border-orange-400/40 text-white font-bold text-xs shrink-0">
                <BookOpen className="w-4 h-4 text-white" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="font-bold text-amber-200 text-xs sm:text-sm font-uthmani tracking-wide truncate">
                    جُزْءُ عَمَّ
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-orange-950/80 text-orange-300 border border-orange-700/50 hidden xs:inline shrink-0 font-arabic">
                    الجزء ٣٠
                  </span>
                </div>

                {/* Reciter selector directly under "جزء عم" */}
                <button
                  id="player-reciter-btn"
                  onClick={() => setShowReciterMenu(!showReciterMenu)}
                  className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-amber-300 transition group mt-0.5 max-w-[150px] sm:max-w-[220px] truncate"
                  title="انقر لاختيار وتغيير القارئ"
                >
                  <User className="w-3 h-3 text-orange-400 shrink-0 group-hover:text-amber-300" />
                  <span className="truncate text-zinc-300 group-hover:text-amber-200">{selectedReciter.name}</span>
                  <ChevronDown className={`w-3 h-3 text-zinc-400 group-hover:text-amber-300 shrink-0 transition-transform ${showReciterMenu ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Reciter Selection Modal / Popup */}
              {showReciterMenu && (
                <div className="fixed inset-x-2 sm:inset-x-auto bottom-24 sm:absolute sm:bottom-full sm:mb-2 sm:right-0 sm:left-auto w-auto sm:w-84 md:w-96 bg-[#22252e] border border-zinc-700 rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 max-h-[70vh] sm:max-h-[75vh] flex flex-col text-right">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-700/80 mb-2">
                    <div className="flex items-center gap-2 text-orange-400 font-bold text-xs sm:text-sm">
                      <User className="w-4 h-4" />
                      <span>اختر القارئ والتلاوة ({RECITERS.length} قارئ ورواية)</span>
                    </div>
                    <button
                      onClick={() => setShowReciterMenu(false)}
                      className="px-2 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs"
                    >
                      إغلاق
                    </button>
                  </div>

                  {/* Search bar */}
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="ابحث باسم القارئ أو الرواية..."
                      value={reciterSearchFilter}
                      autoFocus
                      onChange={(e) => setReciterSearchFilter(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-400 focus:outline-hidden focus:border-orange-500"
                    />
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-1 scrollbar-none text-[10px]">
                    {[
                      { id: 'all', label: 'الكل' },
                      { id: 'المصحف المعلم', label: 'المصحف المعلم (للتحفيظ)' },
                      { id: 'مرتل', label: 'مرتل' },
                      { id: 'الحرم المكي', label: 'أئمة الحرمين' },
                      { id: 'مجود', label: 'تجويد كلاسيكي' },
                      { id: 'رواية ورش', label: 'رواية ورش' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setReciterCategoryFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
                          reciterCategoryFilter === cat.id
                            ? 'bg-orange-500 text-white font-bold'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/60'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Reciters List */}
                  <div className="overflow-y-auto space-y-1 p-1 max-h-64 divide-y divide-zinc-800/40">
                    {RECITERS.filter((r) => {
                      const matchesCategory =
                        reciterCategoryFilter === 'all' ||
                        (reciterCategoryFilter === 'الحرم المكي' && (r.style === 'الحرم المكي' || r.style === 'الحرم النبوي')) ||
                        (reciterCategoryFilter === 'مجود' && (r.style === 'مجود' || r.style === 'مجود خاشع')) ||
                        r.style === reciterCategoryFilter;

                      const cleanQ = reciterSearchFilter.trim().toLowerCase();
                      const matchesSearch =
                        !cleanQ ||
                        r.name.toLowerCase().includes(cleanQ) ||
                        r.subname.toLowerCase().includes(cleanQ) ||
                        (r.style && r.style.toLowerCase().includes(cleanQ));

                      return matchesCategory && matchesSearch;
                    }).map((r) => {
                      const isSelected = r.id === reciterId;
                      return (
                        <button
                          key={r.id}
                          onClick={() => {
                            onSelectReciter(r.id);
                            setShowReciterMenu(false);
                          }}
                          className={`w-full text-right p-2 rounded-xl text-xs flex items-center justify-between transition group ${
                            isSelected
                              ? 'bg-orange-500 text-white font-bold shadow-sm'
                              : 'text-zinc-200 hover:bg-zinc-800 hover:text-white'
                          }`}
                        >
                          <div className="min-w-0 flex-1 pl-2">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate">{r.name}</span>
                              {r.style && (
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                                    isSelected
                                      ? 'bg-orange-600 text-white'
                                      : 'bg-zinc-800 text-orange-400/90 border border-zinc-700'
                                  }`}
                                >
                                  {r.style}
                                </span>
                              )}
                            </div>
                            <div
                              className={`text-[10px] truncate ${
                                isSelected ? 'text-orange-100' : 'text-zinc-400'
                              }`}
                            >
                              {r.subname}
                            </div>
                          </div>
                          {isSelected ? (
                            <Check className="w-4 h-4 text-white shrink-0" />
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-400 shrink-0">
                              {r.quality}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Core Playback Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Previous Ayah */}
              <button
                id="prev-ayah-btn"
                onClick={onPrevAyah}
                disabled={currentAyahIndex === 0}
                className="p-1.5 sm:p-2 text-zinc-300 hover:text-orange-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl hover:bg-zinc-800"
                title="الآية السابقة"
                aria-label="الآية السابقة"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Main Play/Pause */}
              <button
                id="main-play-pause-btn"
                onClick={onPlayPause}
                className="p-2.5 sm:p-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold shadow-lg shadow-orange-950/60 hover:scale-105 active:scale-95 border border-orange-400/50 transition touch-manipulation min-w-[42px] min-h-[42px] sm:min-w-[46px] sm:min-h-[46px] flex items-center justify-center"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              {/* Next Ayah */}
              <button
                id="next-ayah-btn"
                onClick={onNextAyah}
                disabled={currentAyahIndex === currentSurah.ayahs.length - 1}
                className="p-1.5 sm:p-2 text-zinc-300 hover:text-orange-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl hover:bg-zinc-800"
                title="الآية التالية"
                aria-label="الآية التالية"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Tools Settings */}
            <div className="flex items-center gap-1.5 sm:gap-2">

              {/* Advanced Quranic Repetition & Hifz Controller (تكرار التحفيظ والاستماع) */}
              <div className="relative" ref={repeatDropdownRef}>
                <button
                  id="repeat-mode-btn"
                  onClick={() => setShowRepeatMenu(!showRepeatMenu)}
                  className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs border transition touch-manipulation ${
                    isRepeatActive
                      ? 'bg-orange-500 text-white border-orange-400 font-bold shadow-md shadow-orange-950/40'
                      : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:border-orange-500'
                  }`}
                  title="خيارات تكرار التلاوة والتحفيظ"
                >
                  <Repeat className={`w-3.5 h-3.5 ${isRepeatActive ? 'animate-spin-slow' : ''}`} />
                  <span className="text-[11px] hidden xs:inline max-w-[130px] truncate">
                    {getRepeatButtonLabel()}
                  </span>
                </button>

                {showRepeatMenu && (
                  <div className="fixed inset-x-2 sm:inset-x-auto bottom-24 sm:absolute sm:bottom-full sm:mb-3 sm:left-0 sm:right-auto md:right-0 md:left-auto w-auto sm:w-80 md:w-96 bg-[#22252e] border border-zinc-700 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 text-white select-none max-h-[75vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-zinc-700/80 mb-3">
                      <div className="flex items-center gap-2 text-orange-400 font-bold text-xs sm:text-sm">
                        <Repeat className="w-4 h-4" />
                        <span>إعدادات تكرار التلاوة والتحفيظ</span>
                      </div>
                      {isRepeatActive && (
                        <button
                          onClick={() => {
                            onSetRepeatConfig({ repeatScope: 'ayah', repeatCount: 1, pauseDuration: 0, hifzRange: null });
                            setShowRepeatMenu(false);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition"
                        >
                          إلغاء التكرار
                        </button>
                      )}
                    </div>

                    {/* Scope Selector Tabs (آية / سورة / مقطع) */}
                    <div className="grid grid-cols-3 gap-1.5 bg-zinc-850 p-1 rounded-2xl border border-zinc-700/80 mb-3.5 text-xs font-semibold">
                      <button
                        onClick={() => setLocalScopeTab('ayah')}
                        className={`py-1.5 rounded-xl transition ${
                          localScopeTab === 'ayah'
                            ? 'bg-orange-500 text-white shadow-sm font-bold'
                            : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        تكرار الآية
                      </button>
                      <button
                        onClick={() => setLocalScopeTab('surah')}
                        className={`py-1.5 rounded-xl transition ${
                          localScopeTab === 'surah'
                            ? 'bg-orange-500 text-white shadow-sm font-bold'
                            : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        تكرار السورة
                      </button>
                      <button
                        onClick={() => setLocalScopeTab('range')}
                        className={`py-1.5 rounded-xl transition ${
                          localScopeTab === 'range'
                            ? 'bg-orange-500 text-white shadow-sm font-bold'
                            : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        مقطع تحفيظ
                      </button>
                    </div>

                    {/* TAB 1: AYAH REPEAT */}
                    {localScopeTab === 'ayah' && (
                      <div className="space-y-3">
                        <div className="text-[11px] text-zinc-300">
                          اختر عدد مرات تكرار الآية الحالية (الآية {currentAyah.number}):
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { label: '١x عادي', val: 1 },
                            { label: '٢x مرتان', val: 2 },
                            { label: '٣x مرات', val: 3 },
                            { label: '٥x مرات', val: 5 },
                            { label: '٧x مرات', val: 7 },
                            { label: '١٠x مرات', val: 10 },
                            { label: '٢٠x مرة', val: 20 },
                            { label: '∞ مستمر', val: -1 },
                          ].map((opt) => (
                            <button
                              key={opt.val}
                              onClick={() => {
                                onSetRepeatConfig({
                                  repeatScope: 'ayah',
                                  repeatCount: opt.val,
                                  pauseDuration: localPauseDuration,
                                  hifzRange: null,
                                });
                                setShowRepeatMenu(false);
                              }}
                              className={`py-1.5 px-1 rounded-xl text-xs font-semibold border transition ${
                                repeatScope === 'ayah' && repeatCount === opt.val
                                  ? 'bg-orange-500 text-white border-orange-400 font-bold shadow-sm'
                                  : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:border-orange-500 hover:text-white'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB 2: SURAH REPEAT */}
                    {localScopeTab === 'surah' && (
                      <div className="space-y-3">
                        <div className="text-[11px] text-zinc-300">
                          تكرار سورة {currentSurah.name} كاملة ({currentSurah.numberOfAyahs} آية):
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: 'تكرار السورة ٣ مرات', val: 3 },
                            { label: 'تكرار السورة ٥ مرات', val: 5 },
                            { label: 'تكرار السورة ١٠ مرات', val: 10 },
                            { label: 'تكرار مستمر للسورة ∞', val: -1 },
                          ].map((opt) => (
                            <button
                              key={opt.val}
                              onClick={() => {
                                onSetRepeatConfig({
                                  repeatScope: 'surah',
                                  repeatCount: opt.val,
                                  pauseDuration: localPauseDuration,
                                  hifzRange: null,
                                });
                                setShowRepeatMenu(false);
                              }}
                              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition text-center ${
                                repeatScope === 'surah' && repeatCount === opt.val
                                  ? 'bg-orange-500 text-white border-orange-400 font-bold shadow-sm'
                                  : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:border-orange-500 hover:text-white'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB 3: RANGE / HIFZ REPEAT */}
                    {localScopeTab === 'range' && (
                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2 bg-zinc-800/80 p-2.5 rounded-2xl border border-zinc-700">
                          <div>
                            <label className="block text-zinc-400 text-[10px] mb-1">من الآية:</label>
                            <select
                              value={localFromAyah}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setLocalFromAyah(val);
                                if (val > localToAyah) setLocalToAyah(val);
                              }}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-2 py-1.5 text-xs text-white"
                            >
                              {currentSurah.ayahs.map((a) => (
                                <option key={a.number} value={a.number}>
                                  الآية {a.number}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-zinc-400 text-[10px] mb-1">إلى الآية:</label>
                            <select
                              value={localToAyah}
                              onChange={(e) => setLocalToAyah(Number(e.target.value))}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-2 py-1.5 text-xs text-white"
                            >
                              {currentSurah.ayahs
                                .filter((a) => a.number >= localFromAyah)
                                .map((a) => (
                                  <option key={a.number} value={a.number}>
                                    الآية {a.number}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-zinc-300 text-[11px] mb-1.5">تكرار كل آية منفردة:</label>
                          <div className="grid grid-cols-5 gap-1">
                            {[1, 2, 3, 5, 7].map((c) => (
                              <button
                                key={c}
                                onClick={() => setLocalRepeatPerAyah(c)}
                                className={`py-1 rounded-xl text-xs font-semibold border transition ${
                                  localRepeatPerAyah === c
                                    ? 'bg-orange-500 text-white border-orange-400 font-bold'
                                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                                }`}
                              >
                                {c}x
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-zinc-300 text-[11px] mb-1.5">تكرار المقطع كاملاً:</label>
                          <div className="grid grid-cols-4 gap-1">
                            {[
                              { label: 'مرة', val: 1 },
                              { label: '٣ مرات', val: 3 },
                              { label: '٥ مرات', val: 5 },
                              { label: '∞ دائم', val: -1 },
                            ].map((opt) => (
                              <button
                                key={opt.val}
                                onClick={() => setLocalRangeCount(opt.val)}
                                className={`py-1 rounded-xl text-xs font-semibold border transition ${
                                  localRangeCount === opt.val
                                    ? 'bg-orange-500 text-white border-orange-400 font-bold'
                                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onSetRepeatConfig({
                              repeatScope: 'range',
                              repeatCount: localRepeatPerAyah,
                              pauseDuration: localPauseDuration,
                              hifzRange: {
                                fromAyah: localFromAyah,
                                toAyah: localToAyah,
                                repeatPerAyah: localRepeatPerAyah,
                                repeatRangeCount: localRangeCount,
                                currentRangeIteration: 0,
                              },
                            });
                            setShowRepeatMenu(false);
                          }}
                          className="w-full py-2 px-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs shadow-md transition"
                        >
                          بدء تكرار المقطع [آية {localFromAyah} - {localToAyah}]
                        </button>
                      </div>
                    )}

                    {/* Pause Duration Between Repetitions (وقفة للترديد خلف الشيخ) */}
                    <div className="mt-3.5 pt-2.5 border-t border-zinc-700/80">
                      <div className="flex items-center justify-between text-[11px] text-zinc-300 mb-1.5">
                        <span>فاصل زمني للترديد بعد كل تلاوة:</span>
                        <span className="text-orange-400 font-mono font-bold">
                          {localPauseDuration === 0 ? 'بدون فاصل' : `${localPauseDuration} ثوانٍ`}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { label: 'فوري (٠ث)', val: 0 },
                          { label: '١ ثانية', val: 1 },
                          { label: '٢ ثانية', val: 2 },
                          { label: '٣ ثوانٍ', val: 3 },
                        ].map((p) => (
                          <button
                            key={p.val}
                            onClick={() => {
                              setLocalPauseDuration(p.val);
                              onSetRepeatConfig({
                                repeatScope,
                                repeatCount,
                                pauseDuration: p.val,
                                hifzRange,
                              });
                            }}
                            className={`py-1 rounded-xl text-[10px] font-medium border transition ${
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
                )}
              </div>

              {/* Speed Selector (Desktop / Tablet) */}
              <div className="relative hidden sm:block">
                <button
                  id="speed-selector-btn"
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs border border-zinc-700 hover:border-orange-500 transition"
                  title="سرعة التلاوة"
                >
                  <Gauge className="w-3.5 h-3.5 text-orange-400" />
                  <span>{playbackSpeed}x</span>
                </button>

                {showSpeedMenu && (
                  <div className="fixed bottom-24 left-4 sm:absolute sm:bottom-full sm:mb-2 sm:right-0 sm:left-auto w-28 bg-[#22252e] border border-zinc-700 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="text-[11px] font-medium px-2 py-1 text-zinc-400 border-b border-zinc-700">
                      السرعة
                    </div>
                    {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => {
                          onSelectSpeed(speed);
                          setShowSpeedMenu(false);
                        }}
                        className={`w-full text-center px-2 py-1 rounded-lg text-xs transition ${
                          playbackSpeed === speed
                            ? 'bg-orange-500 text-white font-medium'
                            : 'text-zinc-200 hover:bg-zinc-800'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Volume & Audio Level Control (التحكم في زيادة وخفض الصوت) */}
              <div className="relative" ref={volumeDropdownRef}>
                <div className="flex items-center gap-0.5 bg-zinc-800 rounded-xl p-0.5 border border-zinc-700 hover:border-orange-500 transition">
                  {/* Quick Decrease (-) Button on desktop/tablets */}
                  <button
                    id="quick-volume-down-btn"
                    onClick={handleDecreaseVolume}
                    className="p-1.5 text-zinc-400 hover:text-orange-300 hover:bg-zinc-700/80 rounded-lg transition hidden md:flex items-center justify-center"
                    title="خفض الصوت (-١٠٪)"
                    aria-label="خفض الصوت"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  {/* Main Volume Popover Toggle */}
                  <button
                    id="volume-controller-btn"
                    onClick={() => setShowVolumeMenu(!showVolumeMenu)}
                    className="flex items-center gap-1 px-1.5 sm:px-2 py-1 text-white hover:text-orange-300 transition touch-manipulation rounded-lg"
                    title="التحكم في مستوى الصوت"
                    aria-label="التحكم في مستوى الصوت"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 shrink-0" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 shrink-0" />
                    )}
                    <span className="text-[10px] sm:text-[11px] font-mono text-zinc-300 hidden xs:inline">
                      {isMuted ? '٠٪' : `${Math.round(volume * 100)}%`}
                    </span>
                  </button>

                  {/* Quick Increase (+) Button on desktop/tablets */}
                  <button
                    id="quick-volume-up-btn"
                    onClick={handleIncreaseVolume}
                    className="p-1.5 text-zinc-400 hover:text-orange-300 hover:bg-zinc-700/80 rounded-lg transition hidden md:flex items-center justify-center"
                    title="زيادة الصوت (+١٠٪)"
                    aria-label="زيادة الصوت"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Volume Popover Card */}
                {showVolumeMenu && (
                  <div className="fixed inset-x-4 bottom-24 sm:inset-x-auto sm:absolute sm:bottom-full sm:mb-2 sm:left-0 sm:right-auto md:right-0 md:left-auto w-auto sm:w-56 md:w-64 bg-[#22252e] border border-zinc-700 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 text-white select-none">
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 pb-2 border-b border-zinc-700/80 mb-3">
                      <div className="flex items-center gap-1.5 text-orange-400">
                        <Volume2 className="w-4 h-4" />
                        <span>مستوى الصوت</span>
                      </div>
                      <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-amber-300">
                        {isMuted ? 'مكتوم' : `${Math.round(volume * 100)}%`}
                      </span>
                    </div>

                    {/* Interactive Range & Stepper */}
                    <div className="flex items-center gap-2 mb-3">
                      {/* Decrease button */}
                      <button
                        id="vol-step-down-btn"
                        onClick={handleDecreaseVolume}
                        className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-orange-500/20 text-zinc-200 hover:text-orange-400 border border-zinc-700 hover:border-orange-500 flex items-center justify-center transition active:scale-95 shrink-0"
                        title="خفض الصوت"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      {/* Slider Input */}
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-full accent-orange-500 bg-zinc-700 h-2 rounded-lg cursor-pointer transition-all"
                        aria-label="مستوى الصوت"
                      />

                      {/* Increase button */}
                      <button
                        id="vol-step-up-btn"
                        onClick={handleIncreaseVolume}
                        className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-orange-500/20 text-zinc-200 hover:text-orange-400 border border-zinc-700 hover:border-orange-500 flex items-center justify-center transition active:scale-95 shrink-0"
                        title="زيادة الصوت"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Preset Levels */}
                    <div className="grid grid-cols-4 gap-1 pt-1">
                      <button
                        onClick={handleToggleMute}
                        className={`py-1 rounded-lg text-[10px] font-medium border transition ${
                          isMuted || volume === 0
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {isMuted ? 'إلغاء الكتم' : 'كتم'}
                      </button>
                      {[0.3, 0.6, 1.0].map((v) => (
                        <button
                          key={v}
                          onClick={() => handleVolumeChange(v)}
                          className={`py-1 rounded-lg text-[10px] font-mono border transition ${
                            !isMuted && Math.abs(volume - v) < 0.05
                              ? 'bg-orange-500 border-orange-400 text-white font-bold'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600'
                          }`}
                        >
                          {Math.round(v * 100)}%
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 2: Main Menu & Navigation Bar (القائمة الرئيسية) --- */}
      <nav id="bottom-main-menu" className="bg-[#14161b] px-2 sm:px-4 py-1.5 border-t border-zinc-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-1 sm:gap-3 overflow-x-auto no-scrollbar">
          {/* 1. Mushaf View */}
          <button
            id="menu-tab-mushaf"
            onClick={() => onChangeViewMode('mushaf')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-2xl text-[11px] sm:text-xs font-bold transition touch-manipulation shrink-0 ${
              viewMode === 'mushaf'
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>المصحف</span>
          </button>

          {/* 2. Verse-by-Verse View */}
          <button
            id="menu-tab-verse"
            onClick={() => onChangeViewMode('verse-by-verse')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-2xl text-[11px] sm:text-xs font-bold transition touch-manipulation shrink-0 ${
              viewMode === 'verse-by-verse'
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>آية وتفسير</span>
          </button>

          {/* 3. Memorization View */}
          <button
            id="menu-tab-memorize"
            onClick={() => onChangeViewMode('memorize')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-2xl text-[11px] sm:text-xs font-bold transition touch-manipulation shrink-0 ${
              viewMode === 'memorize'
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>التحفيظ</span>
          </button>

          {/* 4. Virtues View */}
          <button
            id="menu-tab-virtues"
            onClick={() => onChangeViewMode('virtues')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-2xl text-[11px] sm:text-xs font-bold transition touch-manipulation shrink-0 ${
              viewMode === 'virtues'
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>الفضائل</span>
          </button>

          <div className="h-6 w-px bg-zinc-800 mx-0.5 sm:mx-1 shrink-0" />

          {/* 5. Search Button */}
          <button
            id="menu-btn-search"
            onClick={onOpenSearch}
            className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-1 sm:py-1.5 px-2 sm:px-3 rounded-2xl text-[11px] sm:text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition touch-manipulation shrink-0"
            title="بحث في جزء عم"
          >
            <Search className="w-4 h-4 text-orange-400" />
            <span>بحث</span>
          </button>

          {/* 6. Bookmarks Button */}
          <button
            id="menu-btn-bookmarks"
            onClick={onOpenBookmarks}
            className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-1 sm:py-1.5 px-2 sm:px-3 rounded-2xl text-[11px] sm:text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition touch-manipulation relative shrink-0"
            title="الآيات المحفوظة"
          >
            <Bookmark className="w-4 h-4 text-orange-400" />
            <span>المحفوظات</span>
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 right-1 sm:static sm:mr-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* 7. Word Meanings Button */}
          <button
            id="menu-btn-word-meanings"
            onClick={onOpenWordMeanings}
            className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-1 sm:py-1.5 px-2 sm:px-3 rounded-2xl text-[11px] sm:text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition touch-manipulation shrink-0"
            title="معاني الكلمات وغريب جزء عم"
          >
            <BookMarked className="w-4 h-4 text-orange-400" />
            <span className="hidden xs:inline">معاني الكلمات</span>
            <span className="xs:hidden">المعاني</span>
          </button>

          {/* 8. Translations Multi-Language Button */}
          {onOpenLanguageModal && (
            <button
              id="menu-btn-translations-modal"
              onClick={onOpenLanguageModal}
              className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-1 sm:py-1.5 px-2 sm:px-3 rounded-2xl text-[11px] sm:text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition touch-manipulation shrink-0"
              title="لغات الترجمة العالمية"
            >
              <Languages className="w-4 h-4 text-orange-400" />
              <span className="hidden xs:inline">الترجمات</span>
              <span className="xs:hidden">اللغات</span>
            </button>
          )}

          {/* 9. Settings Button */}
          <button
            id="menu-btn-settings"
            onClick={onOpenSettings}
            className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-1 sm:py-1.5 px-2 sm:px-3 rounded-2xl text-[11px] sm:text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition touch-manipulation shrink-0"
            title="إعدادات الخط والمظهر"
          >
            <Settings className="w-4 h-4 text-orange-400" />
            <span>الإعدادات</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

