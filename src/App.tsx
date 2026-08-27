import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MushafView } from './components/MushafView';
import { VerseByVerseView } from './components/VerseByVerseView';
import { MemorizationMode } from './components/MemorizationMode';
import { VirtuesView } from './components/VirtuesView';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { SearchModal } from './components/SearchModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { SettingsDrawer } from './components/SettingsDrawer';
import { WordMeaningsModal } from './components/WordMeaningsModal';
import { TranslationLanguageModal } from './components/TranslationLanguageModal';
import { TafsirModal } from './components/TafsirModal';
import { TopPrayerBar } from './components/TopPrayerBar';
import { PWAInstallModal } from './components/PWAInstallModal';

import { ALL_JUZ_AMMA_SURAHS, getSurahById } from './data';
import { fetchSurahTranslation } from './data/translationService';
import { Surah, Ayah, ViewMode, Bookmark, RepeatScope, HifzRangeConfig } from './types';

export default function App() {
  // Navigation & Surah State
  const [currentSurah, setCurrentSurah] = useState<Surah>(() => {
    try {
      const savedSurahId = localStorage.getItem('juz_amma_last_surah');
      if (savedSurahId) {
        const found = getSurahById(Number(savedSurahId));
        if (found) return found;
      }
    } catch (e) {
      console.error(e);
    }
    return ALL_JUZ_AMMA_SURAHS[0]; // 78. An-Naba
  });

  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('mushaf');

  // Audio Player State & Repetition Logic
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [reciterId, setReciterId] = useState<string>(() => {
    return localStorage.getItem('juz_amma_reciter') || 'alafasy';
  });
  const [repeatScope, setRepeatScope] = useState<RepeatScope>('ayah');
  const [repeatCount, setRepeatCount] = useState<number>(1);
  const [currentRepeatIteration, setCurrentRepeatIteration] = useState<number>(0);
  const [pauseDuration, setPauseDuration] = useState<number>(0);
  const [hifzRange, setHifzRange] = useState<HifzRangeConfig | null>(null);
  const [replayNonce, setReplayNonce] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  // Settings & Customization
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('juz_amma_font_size');
    return saved ? Number(saved) : 28;
  });
  const [fontFamily, setFontFamily] = useState<string>(() => {
    return localStorage.getItem('juz_amma_font_family') || 'Amiri';
  });
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('juz_amma_theme') || 'gray-orange';
  });
  const [showTranslation, setShowTranslation] = useState<boolean>(() => {
    return localStorage.getItem('juz_amma_show_translation') === 'true';
  });
  const [showTafsir, setShowTafsir] = useState<boolean>(false);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(() => {
    return localStorage.getItem('juz_amma_selected_lang') || 'en';
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('juz_amma_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isWordMeaningsOpen, setIsWordMeaningsOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [selectedTafsirAyah, setSelectedTafsirAyah] = useState<Ayah | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Capture PWA Install Prompt Event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Persistence helpers
  useEffect(() => {
    try {
      localStorage.setItem('juz_amma_last_surah', currentSurah.id.toString());
    } catch (e) {}
  }, [currentSurah.id]);

  useEffect(() => {
    try {
      localStorage.setItem('juz_amma_reciter', reciterId);
    } catch (e) {}
  }, [reciterId]);

  useEffect(() => {
    try {
      localStorage.setItem('juz_amma_font_size', fontSize.toString());
    } catch (e) {}
  }, [fontSize]);

  useEffect(() => {
    try {
      localStorage.setItem('juz_amma_font_family', fontFamily);
    } catch (e) {}
  }, [fontFamily]);

  useEffect(() => {
    try {
      localStorage.setItem('juz_amma_selected_lang', selectedLanguageId);
    } catch (e) {}
  }, [selectedLanguageId]);

  useEffect(() => {
    try {
      localStorage.setItem('juz_amma_show_translation', String(showTranslation));
    } catch (e) {}
  }, [showTranslation]);

  // Preload translation for active language & surah
  useEffect(() => {
    if (selectedLanguageId !== 'en') {
      fetchSurahTranslation(currentSurah.id, selectedLanguageId);
    }
  }, [currentSurah.id, selectedLanguageId]);

  useEffect(() => {
    try {
      localStorage.setItem('juz_amma_theme', theme);
    } catch (e) {}
    // Update HTML dark class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('juz_amma_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {}
  }, [bookmarks]);

  // Auto-scroll when current ayah changes
  useEffect(() => {
    if (!autoScroll) return;
    const element = document.getElementById(
      viewMode === 'mushaf'
        ? `ayah-token-${currentSurah.id}-${currentSurah.ayahs[currentAyahIndex]?.number}`
        : `ayah-card-${currentSurah.id}-${currentSurah.ayahs[currentAyahIndex]?.number}`
    );
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentAyahIndex, currentSurah.id, viewMode, autoScroll]);

  // Surah navigation helpers
  const currentSurahIndex = ALL_JUZ_AMMA_SURAHS.findIndex((s) => s.id === currentSurah.id);
  const hasPrevSurah = currentSurahIndex > 0;
  const hasNextSurah = currentSurahIndex < ALL_JUZ_AMMA_SURAHS.length - 1;

  const handleNextSurah = () => {
    if (hasNextSurah) {
      setCurrentSurah(ALL_JUZ_AMMA_SURAHS[currentSurahIndex + 1]);
      setCurrentAyahIndex(0);
    }
  };

  const handlePrevSurah = () => {
    if (hasPrevSurah) {
      setCurrentSurah(ALL_JUZ_AMMA_SURAHS[currentSurahIndex - 1]);
      setCurrentAyahIndex(0);
    }
  };

  const handleSelectSurah = (surah: Surah) => {
    setCurrentSurah(surah);
    setCurrentAyahIndex(0);
  };

  // Playback handlers
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePlayAyah = (index: number) => {
    setCurrentAyahIndex(index);
    setIsPlaying(true);
    setCurrentRepeatIteration(0);
    setReplayNonce((n) => n + 1);
  };

  const handleNextAyah = () => {
    if (currentAyahIndex < currentSurah.ayahs.length - 1) {
      setCurrentAyahIndex(currentAyahIndex + 1);
      setCurrentRepeatIteration(0);
      setReplayNonce((n) => n + 1);
    } else if (hasNextSurah) {
      handleNextSurah();
    }
  };

  const handlePrevAyah = () => {
    if (currentAyahIndex > 0) {
      setCurrentAyahIndex(currentAyahIndex - 1);
      setCurrentRepeatIteration(0);
      setReplayNonce((n) => n + 1);
    } else if (hasPrevSurah) {
      const prev = ALL_JUZ_AMMA_SURAHS[currentSurahIndex - 1];
      setCurrentSurah(prev);
      setCurrentAyahIndex(prev.ayahs.length - 1);
      setCurrentRepeatIteration(0);
      setReplayNonce((n) => n + 1);
    }
  };

  // Configure repetition mode
  const handleSetRepeatConfig = (config: {
    repeatScope: RepeatScope;
    repeatCount: number;
    pauseDuration?: number;
    hifzRange?: HifzRangeConfig | null;
  }) => {
    setRepeatScope(config.repeatScope);
    setRepeatCount(config.repeatCount);
    setCurrentRepeatIteration(0);
    if (config.pauseDuration !== undefined) {
      setPauseDuration(config.pauseDuration);
    }
    if (config.hifzRange !== undefined) {
      setHifzRange(config.hifzRange);
    }
  };

  // Start Hifz Range Repetition from Memorization mode or popover
  const handleStartHifzRepeat = (config: {
    fromAyah: number;
    toAyah: number;
    repeatPerAyah: number;
    repeatRangeCount: number;
    pauseDuration: number;
  }) => {
    setRepeatScope('range');
    setRepeatCount(config.repeatPerAyah);
    setCurrentRepeatIteration(0);
    setPauseDuration(config.pauseDuration);
    setHifzRange({
      fromAyah: config.fromAyah,
      toAyah: config.toAyah,
      repeatPerAyah: config.repeatPerAyah,
      repeatRangeCount: config.repeatRangeCount,
      currentRangeIteration: 0,
    });
    setCurrentAyahIndex(config.fromAyah - 1);
    setIsPlaying(true);
    setReplayNonce((n) => n + 1);
  };

  const handleStopHifzRepeat = () => {
    setRepeatScope('ayah');
    setRepeatCount(1);
    setCurrentRepeatIteration(0);
    setHifzRange(null);
    setIsPlaying(false);
  };

  // Master Ayah-Ended Repetition State Machine
  const handleAyahEnded = () => {
    // 1. Range Hifz Repetition Mode
    if (repeatScope === 'range' && hifzRange) {
      const fromIndex = hifzRange.fromAyah - 1;
      const toIndex = hifzRange.toAyah - 1;

      // Repeat current Ayah first
      if (hifzRange.repeatPerAyah > 1 && currentRepeatIteration < hifzRange.repeatPerAyah - 1) {
        setCurrentRepeatIteration((prev) => prev + 1);
        setReplayNonce((n) => n + 1);
        return;
      }

      // If current Ayah repetitions are done, check if there are more ayahs in this range
      if (currentAyahIndex < toIndex && currentAyahIndex < currentSurah.ayahs.length - 1) {
        setCurrentAyahIndex((prev) => prev + 1);
        setCurrentRepeatIteration(0);
        setReplayNonce((n) => n + 1);
        return;
      }

      // Reached the end of the range: Check range repeat count
      const isInfiniteRange = hifzRange.repeatRangeCount === -1;
      const hasMoreRangeIterations =
        isInfiniteRange ||
        hifzRange.currentRangeIteration < hifzRange.repeatRangeCount - 1;

      if (hasMoreRangeIterations) {
        setHifzRange((prev) =>
          prev
            ? {
                ...prev,
                currentRangeIteration: prev.currentRangeIteration + 1,
              }
            : null
        );
        setCurrentAyahIndex(fromIndex);
        setCurrentRepeatIteration(0);
        setReplayNonce((n) => n + 1);
      } else {
        // Finished all range iterations
        setIsPlaying(false);
        setCurrentRepeatIteration(0);
      }
      return;
    }

    // 2. Whole Surah Repetition Mode
    if (repeatScope === 'surah') {
      // Check if more ayahs exist in current surah
      if (currentAyahIndex < currentSurah.ayahs.length - 1) {
        setCurrentAyahIndex((prev) => prev + 1);
        setCurrentRepeatIteration(0);
        setReplayNonce((n) => n + 1);
        return;
      }

      // Reached end of surah: check surah repeat count
      if (repeatCount === -1 || currentRepeatIteration < repeatCount - 1) {
        setCurrentRepeatIteration((prev) => prev + 1);
        setCurrentAyahIndex(0);
        setReplayNonce((n) => n + 1);
      } else {
        setIsPlaying(false);
        setCurrentRepeatIteration(0);
      }
      return;
    }

    // 3. Single Ayah Repetition Mode
    if (repeatCount === -1) {
      // Infinite repeat of current ayah
      setCurrentRepeatIteration((prev) => prev + 1);
      setReplayNonce((n) => n + 1);
      return;
    }

    if (repeatCount > 1 && currentRepeatIteration < repeatCount - 1) {
      // Repeat current ayah
      setCurrentRepeatIteration((prev) => prev + 1);
      setReplayNonce((n) => n + 1);
      return;
    }

    // Single ayah repetition finished: advance to next ayah
    if (currentAyahIndex < currentSurah.ayahs.length - 1) {
      setCurrentAyahIndex((prev) => prev + 1);
      setCurrentRepeatIteration(0);
      setReplayNonce((n) => n + 1);
    } else if (hasNextSurah) {
      // Move to next Surah automatically
      handleNextSurah();
      setCurrentRepeatIteration(0);
      setReplayNonce((n) => n + 1);
    } else {
      setIsPlaying(false);
      setCurrentRepeatIteration(0);
    }
  };

  // Bookmark handlers
  const handleToggleBookmark = (surahId: number, ayahNumber: number) => {
    const exists = bookmarks.some(
      (b) => b.surahId === surahId && b.ayahNumber === ayahNumber
    );

    if (exists) {
      setBookmarks(
        bookmarks.filter(
          (b) => !(b.surahId === surahId && b.ayahNumber === ayahNumber)
        )
      );
    } else {
      const targetSurah = getSurahById(surahId);
      const targetAyah = targetSurah?.ayahs.find((a) => a.number === ayahNumber);
      if (targetSurah && targetAyah) {
        const newBookmark: Bookmark = {
          surahId,
          ayahNumber,
          timestamp: Date.now(),
        };
        setBookmarks([newBookmark, ...bookmarks]);
      }
    }
  };

  const handleSelectSearchResult = (surahId: number, ayahNumber: number) => {
    const s = getSurahById(surahId);
    if (s) {
      setCurrentSurah(s);
      setCurrentAyahIndex(ayahNumber - 1);
      setIsPlaying(true);
      setCurrentRepeatIteration(0);
      setReplayNonce((n) => n + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#111216] text-white flex flex-col font-sans transition-colors selection:bg-orange-500 selection:text-white">
      {/* Top Smart Prayer Times Strip (مواقيت الصلاة حسب الدولة والمدينة) */}
      <TopPrayerBar />

      {/* Top Navigation */}
      <Navbar
        currentSurah={currentSurah}
        viewMode={viewMode}
        onSelectSurah={handleSelectSurah}
        onChangeViewMode={(mode) => setViewMode(mode)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWordMeanings={() => setIsWordMeaningsOpen(true)}
        onOpenDuaKhatm={() => setIsWordMeaningsOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main Reading & Practice Surface */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
        {viewMode === 'mushaf' && (
          <MushafView
            surah={currentSurah}
            currentAyahIndex={currentAyahIndex}
            isPlaying={isPlaying}
            fontSize={fontSize}
            fontFamily={fontFamily}
            bookmarks={bookmarks}
            onPlayAyah={handlePlayAyah}
            onToggleBookmark={handleToggleBookmark}
            onOpenTafsir={(ayah) => setSelectedTafsirAyah(ayah)}
            onNextSurah={handleNextSurah}
            onPrevSurah={handlePrevSurah}
            hasPrevSurah={hasPrevSurah}
            hasNextSurah={hasNextSurah}
          />
        )}

        {(viewMode === 'verse-by-verse' || viewMode === 'verse') && (
          <VerseByVerseView
            surah={currentSurah}
            currentAyahIndex={currentAyahIndex}
            isPlaying={isPlaying}
            fontSize={fontSize}
            fontFamily={fontFamily}
            showTranslation={showTranslation}
            showTafsir={showTafsir}
            selectedLanguageId={selectedLanguageId}
            onChangeLanguage={(langId) => setSelectedLanguageId(langId)}
            onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
            bookmarks={bookmarks}
            onPlayAyah={handlePlayAyah}
            onToggleBookmark={handleToggleBookmark}
            onNextSurah={handleNextSurah}
            onPrevSurah={handlePrevSurah}
            hasPrevSurah={hasPrevSurah}
            hasNextSurah={hasNextSurah}
          />
        )}

        {viewMode === 'memorize' && (
          <MemorizationMode
            currentSurah={currentSurah}
            onSelectSurah={handleSelectSurah}
            onPlayAyah={handlePlayAyah}
            onStartHifzRepeat={handleStartHifzRepeat}
            isPlaying={isPlaying}
            currentAyahIndex={currentAyahIndex}
            repeatScope={repeatScope}
            repeatCount={repeatCount}
            currentRepeatIteration={currentRepeatIteration}
            hifzRange={hifzRange}
            onStopHifzRepeat={handleStopHifzRepeat}
          />
        )}

        {viewMode === 'virtues' && (
          <VirtuesView
            onSelectSurah={(surah) => {
              setCurrentSurah(surah);
              setViewMode('mushaf');
            }}
          />
        )}
      </main>

      {/* Persistent Bottom Unified Audio Player & Main Menu Bar */}
      <AudioPlayerBar
        currentSurah={currentSurah}
        currentAyahIndex={currentAyahIndex}
        isPlaying={isPlaying}
        reciterId={reciterId}
        repeatScope={repeatScope}
        repeatCount={repeatCount}
        currentRepeatIteration={currentRepeatIteration}
        pauseDuration={pauseDuration}
        hifzRange={hifzRange}
        playbackSpeed={playbackSpeed}
        autoScroll={autoScroll}
        viewMode={viewMode}
        bookmarksCount={bookmarks.length}
        replayNonce={replayNonce}
        onChangeViewMode={(mode) => setViewMode(mode)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenWordMeanings={() => setIsWordMeaningsOpen(true)}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSelectSurah={handleSelectSurah}
        onPlayPause={handlePlayPause}
        onNextAyah={handleNextAyah}
        onPrevAyah={handlePrevAyah}
        onSelectReciter={(id) => setReciterId(id)}
        onSetRepeatConfig={handleSetRepeatConfig}
        onSelectSpeed={(speed) => setPlaybackSpeed(speed)}
        onToggleAutoScroll={() => setAutoScroll(!autoScroll)}
        onAyahEnded={handleAyahEnded}
      />

      {/* Translation Language Modal */}
      <TranslationLanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedLanguageId={selectedLanguageId}
        onSelectLanguage={(langId) => {
          setSelectedLanguageId(langId);
          fetchSurahTranslation(currentSurah.id, langId);
        }}
        showTranslation={showTranslation}
        onToggleShowTranslation={(show) => setShowTranslation(show)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={handleSelectSearchResult}
        onRemoveBookmark={(surahId, ayahNumber) =>
          handleToggleBookmark(surahId, ayahNumber)
        }
      />

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fontSize={fontSize}
        fontFamily={fontFamily}
        theme={theme}
        reciterId={reciterId}
        showTranslation={showTranslation}
        showTafsir={showTafsir}
        selectedLanguageId={selectedLanguageId}
        onUpdateFontSize={(size) => setFontSize(size)}
        onUpdateFontFamily={(font) => setFontFamily(font)}
        onUpdateTheme={(th) => setTheme(th)}
        onUpdateReciter={(id) => setReciterId(id)}
        onUpdateLanguage={(langId) => {
          setSelectedLanguageId(langId);
          fetchSurahTranslation(currentSurah.id, langId);
        }}
        onToggleTranslation={(val) => setShowTranslation(val)}
        onToggleTafsir={(val) => setShowTafsir(val)}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* PWA Install Modal for Android & iPhone */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstalled={() => setDeferredPrompt(null)}
      />

      {/* Word Meanings (معاني الكلمات وغريب جزء عم) Modal */}
      <WordMeaningsModal
        isOpen={isWordMeaningsOpen}
        onClose={() => setIsWordMeaningsOpen(false)}
        currentSurahId={currentSurah.id}
        onSelectSurah={(surahId) => {
          const s = getSurahById(surahId);
          if (s) {
            setCurrentSurah(s);
            setCurrentAyahIndex(0);
          }
        }}
        onPlayAyah={(surahId, ayahNumber) => {
          const s = getSurahById(surahId);
          if (s) {
            setCurrentSurah(s);
            setCurrentAyahIndex(ayahNumber - 1);
            setIsPlaying(true);
          }
        }}
      />

      {/* Detailed Tafsir Modal */}
      <TafsirModal
        isOpen={!!selectedTafsirAyah}
        onClose={() => setSelectedTafsirAyah(null)}
        ayah={selectedTafsirAyah}
        surah={currentSurah}
        selectedLanguageId={selectedLanguageId}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onPlayAyah={() => {
          if (selectedTafsirAyah) {
            handlePlayAyah(selectedTafsirAyah.number - 1);
          }
        }}
      />
    </div>
  );
}
