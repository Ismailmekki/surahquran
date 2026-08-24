import { Ayah } from '../types';
import { AVAILABLE_LANGUAGES, TranslationLanguage } from './translations';

// API Editions map for Quran.com / AlQuran.cloud API
export const API_LANGUAGE_EDITIONS: Record<string, { identifier: string; name: string; englishName: string }> = {
  en: { identifier: 'en.sahih', name: 'Saheeh International', englishName: 'English' },
  fr: { identifier: 'fr.hamidullah', name: 'Muhammad Hamidullah', englishName: 'French' },
  ur: { identifier: 'ur.jalandhry', name: 'Fateh Muhammad Jalandhry', englishName: 'Urdu' },
  tr: { identifier: 'tr.diyanet', name: 'Diyanet İşleri', englishName: 'Turkish' },
  id: { identifier: 'id.indonesian', name: 'Bahasa Indonesia', englishName: 'Indonesian' },
  es: { identifier: 'es.garcia', name: 'Muhammad Isa García', englishName: 'Spanish' },
  de: { identifier: 'de.bubenheim', name: 'Bubenheim and Elyas', englishName: 'German' },
  ru: { identifier: 'ru.kuliev', name: 'Elmir Kuliev', englishName: 'Russian' },
  bn: { identifier: 'bn.bengali', name: 'Muhiuddin Khan', englishName: 'Bengali' },
  fa: { identifier: 'fa.ansarian', name: 'Hossein Ansarian', englishName: 'Persian' },
  sw: { identifier: 'sw.barwani', name: 'Ali Muhsin Al-Barwani', englishName: 'Swahili' },
  zh: { identifier: 'zh.jian', name: 'Ma Jian', englishName: 'Chinese' },
  hi: { identifier: 'hi.hindi', name: 'Suhel Farooq Khan and Saifur Rahman Nadwi', englishName: 'Hindi' },
  ms: { identifier: 'ms.basmeih', name: 'Abdullah Muhammad Basmeih', englishName: 'Malay' },
  it: { identifier: 'it.piccardo', name: 'Hamza Roberto Piccardo', englishName: 'Italian' },
  pt: { identifier: 'pt.elhayek', name: 'Samir El-Hayek', englishName: 'Portuguese' },
  nl: { identifier: 'nl.keyzer', name: 'Salomo Keyzer', englishName: 'Dutch' },
  bs: { identifier: 'bs.korkut', name: 'Besim Korkut', englishName: 'Bosnian' },
  sq: { identifier: 'sq.ahmeti', name: 'Sherif Ahmeti', englishName: 'Albanian' },
  az: { identifier: 'az.mammadaliyev', name: 'Vasim Mammadaliyev and Ziya Bunyadov', englishName: 'Azerbaijani' },
  ha: { identifier: 'ha.gumi', name: 'Abubakar Mahmoud Gumi', englishName: 'Hausa' },
  ml: { identifier: 'ml.abdulhameed', name: 'Cheriyamundam Abdul Hameed and Kunhi Mohammed Parappoor', englishName: 'Malayalam' },
  ta: { identifier: 'ta.tamil', name: 'Jan Turst Foundation', englishName: 'Tamil' },
  uz: { identifier: 'uz.sodik', name: 'Muhammad Sodik Muhammad Yusuf', englishName: 'Uzbek' },
};

// In-memory cache for fetched surah translations: key = `${surahId}_${langId}` -> array of translations indexed by ayah number (1-based)
const translationsCache: Record<string, Record<number, string>> = {};

// Listeners for translation updates
type TranslationChangeListener = (surahId: number, langId: string) => void;
const listeners: TranslationChangeListener[] = [];

export function subscribeToTranslations(listener: TranslationChangeListener) {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

function notifyTranslationLoaded(surahId: number, langId: string) {
  listeners.forEach((fn) => fn(surahId, langId));
}

/**
 * Get translation for a specific ayah and language
 */
export function getAyahTranslation(
  ayah: Ayah,
  langId: string,
  surahId?: number
): string {
  // If it's English and no specific override, return default ayah.translation
  if (langId === 'en' && !translationsCache[`${surahId}_en`]?.[ayah.number]) {
    return ayah.translation;
  }

  // Check in-memory cache
  if (surahId && translationsCache[`${surahId}_${langId}`]?.[ayah.number]) {
    return translationsCache[`${surahId}_${langId}`][ayah.number];
  }

  // Check ayah object embedded dictionary if present
  if (ayah.translations && ayah.translations[langId]) {
    return ayah.translations[langId];
  }

  // Check localStorage offline cache
  if (surahId) {
    try {
      const cached = localStorage.getItem(`quran_trans_${surahId}_${langId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (!translationsCache[`${surahId}_${langId}`]) {
          translationsCache[`${surahId}_${langId}`] = {};
        }
        translationsCache[`${surahId}_${langId}`] = {
          ...translationsCache[`${surahId}_${langId}`],
          ...parsed,
        };
        if (parsed[ayah.number]) return parsed[ayah.number];
      }
    } catch (e) {}
  }

  // Fallback to English
  return ayah.translation;
}

/**
 * Fetch surah translation from AlQuran Cloud API for any chosen language
 */
export async function fetchSurahTranslation(surahId: number, langId: string): Promise<Record<number, string> | null> {
  if (langId === 'en') {
    // English is already baked into data files
    return null;
  }

  const cacheKey = `${surahId}_${langId}`;
  if (translationsCache[cacheKey]) {
    return translationsCache[cacheKey];
  }

  // Try loading from localStorage
  try {
    const local = localStorage.getItem(`quran_trans_${surahId}_${langId}`);
    if (local) {
      const parsed = JSON.parse(local);
      translationsCache[cacheKey] = parsed;
      notifyTranslationLoaded(surahId, langId);
      return parsed;
    }
  } catch (e) {}

  const edition = API_LANGUAGE_EDITIONS[langId]?.identifier || `en.sahih`;

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/${edition}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch translation: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.code === 200 && data.data && data.data.ayahs) {
      const res: Record<number, string> = {};
      data.data.ayahs.forEach((a: { numberInSurah: number; text: string }) => {
        res[a.numberInSurah] = a.text;
      });

      // Save in cache
      translationsCache[cacheKey] = res;
      try {
        localStorage.setItem(`quran_trans_${surahId}_${langId}`, JSON.stringify(res));
      } catch (e) {}

      notifyTranslationLoaded(surahId, langId);
      return res;
    }
  } catch (err) {
    console.warn(`Could not load translation for Surah ${surahId} (${langId}):`, err);
  }

  return null;
}
