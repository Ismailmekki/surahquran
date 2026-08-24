import { Surah } from '../types';
import { SURAHS_PART_1 } from './surahsPart1';
import { SURAHS_PART_1B } from './surahsPart1b';
import { SURAHS_PART_2 } from './surahsPart2';
import { SURAHS_PART_3 } from './surahsPart3';
import { removeDiacritics } from './juzAmmaSurahs';

export { removeDiacritics };
export * from './wordMeanings';

export const ALL_JUZ_AMMA_SURAHS: Surah[] = [
  ...SURAHS_PART_1,
  ...SURAHS_PART_1B,
  ...SURAHS_PART_2,
  ...SURAHS_PART_3,
];

export function getSurahById(id: number): Surah | undefined {
  return ALL_JUZ_AMMA_SURAHS.find((s) => s.id === id);
}

export function searchJuzAmma(query: string): { surah: Surah; ayah: Surah['ayahs'][0]; matchType: 'arabic' | 'translation' | 'tafsir' }[] {
  if (!query || query.trim().length === 0) return [];
  const normalizedQuery = removeDiacritics(query.trim().toLowerCase());
  const results: { surah: Surah; ayah: Surah['ayahs'][0]; matchType: 'arabic' | 'translation' | 'tafsir' }[] = [];

  for (const surah of ALL_JUZ_AMMA_SURAHS) {
    for (const ayah of surah.ayahs) {
      const cleanAyah = removeDiacritics(ayah.textClean.toLowerCase());
      if (cleanAyah.includes(normalizedQuery)) {
        results.push({ surah, ayah, matchType: 'arabic' });
      } else if (ayah.translation.toLowerCase().includes(normalizedQuery)) {
        results.push({ surah, ayah, matchType: 'translation' });
      } else if (ayah.tafsir.toLowerCase().includes(normalizedQuery)) {
        results.push({ surah, ayah, matchType: 'tafsir' });
      }
    }
  }

  return results.slice(0, 50); // limit to top 50 results
}

export const DUA_KHATM_AL_QURAN = {
  title: 'دعاء ختم القرآن الكريم',
  text: `اللَّهُمَّ ارْحَمْنِي بِالقُرْآنِ وَاجْعَلْهُ لِي إِمَاماً وَنُوراً وَهُدىً وَرَحْمَةً،
اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ وَارْزُقْنِي تِلاَوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ العَالَمِينَ.
اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ وَاجْعَلِ المَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ.
اللَّهُمَّ اجْعَلْ خَيْرَ عُمْرِي آخِرَهُ وَخَيْرَ عَمَلِي خَوَاتِمَهُ وَخَيْرَ أَيَّامِي يَوْمَ أَلْقَاكَ فِيهِ.
اللَّهُمَّ إِنِّي أَسْأَلُكَ عِيشَةً هَنِيَّةً وَمِيتَةً سَوِيَّةً وَمَرَدّاً غَيْرَ مُخْزٍ وَلاَ فَاضِحٍ.
اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ المَسْأَلَةِ وَخَيْرَ الدُّعَاءِ وَخَيْرَ النَّجَاحِ وَخَيْرَ العِلْمِ وَخَيْرَ العَمَلِ وَخَيْرَ الثَّوَابِ وَخَيْرَ الحَيَاةِ وَخَيْرَ المَمَاتِ وَثَبِّتْنِي وَثَقِّلْ مَوَازِينِي وَحَقِّقْ إِيمَانِي وَارْفَعْ دَرَجَاتِي وَتَقَبَّلْ صَلاَتِي وَاغْفِرْ خَطِيئَاتِي وَأَسْأَلُكَ العُلَى مِنَ الجَنَّةِ.
اللَّهُمَّ اجْعَلِ القُرْآنَ العَظِيمَ رَبِيعَ قُلُوبِنَا، وَنُورَ صُدُورِنَا، وَجَلاَءَ أَحْزَانِنَا، وَذَهَابَ هُمُومِنَا وَغُمُومِنَا.
وَصَلَّى اللهُ عَلَى نَبِيِّنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِينَ. آمِين.`
};
