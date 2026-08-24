import { Surah } from '../types';

// Helper to remove harakat for search
export function removeDiacritics(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

export const JUZ_AMMA_SURAHS: Surah[] = [
  {
    id: 78,
    name: 'النبأ',
    englishName: 'An-Naba',
    englishTranslation: 'The Tidings',
    revelationType: 'مكية',
    numberOfAyahs: 40,
    pageNumber: 582,
    theme: 'إثبات البعث والجزاء، مظاهر قدرة الله في الكون، وصف أهوال يوم القيامة ونعيم المتقين وعذاب الطاغين.',
    virtue: 'تسمى سورة (عمّ) وتتحدث عن النبأ العظيم وهو البعث بعد الموت.',
    ayahs: [
      {
        number: 1,
        text: 'عَمَّ يَتَسَاءَلُونَ',
        textClean: 'عم يتساءلون',
        translation: 'About what are they asking one another?',
        tafsir: 'عن أي شيء يسأل كفار قريش بعضهم بعضًا؟',
        audioKey: '078001'
      },
      {
        number: 2,
        text: 'عَنِ النَّبَإِ الْعَظِيمِ',
        textClean: 'عن النبا العظيم',
        translation: 'About the great news -',
        tafsir: 'يسألون عن الخبر العظيم الشأن، وهو القرآن والبعث بعد الموت.',
        audioKey: '078002'
      },
      {
        number: 3,
        text: 'الَّذِي هُمْ فِيهِ مُخْتَلِفُونَ',
        textClean: 'الذي هم فيه مختلفون',
        translation: 'That over which they are in disagreement.',
        tafsir: 'الذي هم فيه متنازعون بين مصدق ومكذب.',
        audioKey: '078003'
      },
      {
        number: 4,
        text: 'كَلَّا سَيَعْلَمُونَ',
        textClean: 'كلا سيعلمون',
        translation: 'No! They are going to know.',
        tafsir: 'ليس الأمر كما يزعمون، سيعلم هؤلاء المكذبون عاقبة تكذيبهم.',
        audioKey: '078004'
      },
      {
        number: 5,
        text: 'ثُمَّ كَلَّا سَيَعْلَمُونَ',
        textClean: 'ثم كلا سيعلمون',
        translation: 'Then, no! They are going to know.',
        tafsir: 'ثم سيتأكد لهم عيانًا صدق ما جاءهم به الرسول صلى الله عليه وسلم.',
        audioKey: '078005'
      },
      {
        number: 6,
        text: 'أَلَمْ نَجْعَلِ الْأَرْضَ مِهَادًا',
        textClean: 'الم نجعل الارض مهادا',
        translation: 'Have We not made the earth a resting place?',
        tafsir: 'ألم نجعل الأرض ممهدة ميسرة لاستقراركم ومعيشتكم؟',
        audioKey: '078006'
      },
      {
        number: 7,
        text: 'وَالْجِبَالَ أَوْتَادًا',
        textClean: 'والجبال اوتادا',
        translation: 'And the mountains as stakes?',
        tafsir: 'وجعلنا الجبال كالأوتاد تثبت الأرض لئلا تميد بكم.',
        audioKey: '078007'
      },
      {
        number: 8,
        text: 'وَخَلَقْنَاكُمْ أَزْوَاجًا',
        textClean: 'وخلقناكم ازواجا',
        translation: 'And We created you in pairs',
        tafsir: 'وخلقناكم أصنافًا ذكورًا وإناثًا لتسكنوا ويتعايش نوعكم.',
        audioKey: '078008'
      },
      {
        number: 9,
        text: 'وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا',
        textClean: 'وجعلنا نومكم سباتا',
        translation: 'And made your sleep [a means for] rest',
        tafsir: 'وجعلنا نومكم راحة لأبدانكم وقطعًا للعمل والتعب.',
        audioKey: '078009'
      },
      {
        number: 10,
        text: 'وَجَعَلْنَا اللَّيْلَ لِبَاسًا',
        textClean: 'وجعلنا الليل لباسا',
        translation: 'And made the night a clothing',
        tafsir: 'وجعلنا الليل ساترًا لكم بظلامه كاللباس يستر الجسد.',
        audioKey: '078010'
      },
      {
        number: 11,
        text: 'وَجَعَلْنَا النَّهَارَ مَعَاشًا',
        textClean: 'وجعلنا النهار معاشا',
        translation: 'And made the day for livelihood',
        tafsir: 'وجعلنا النهار مضيئًا لتسيروا فيه وتبتغوا من فضل الله ومعاشكم.',
        audioKey: '078011'
      },
      {
        number: 12,
        text: 'وَبَنَيْنَا فَوْقَكُمْ سَبْعًا شِدَادًا',
        textClean: 'وبنينا فوقكم سبعا شدادا',
        translation: 'And constructed above you seven strong [heavens]',
        tafsir: 'وبنينا فوقكم سبع سماوات محكمة قوية لا تتصدع.',
        audioKey: '078012'
      },
      {
        number: 13,
        text: 'وَجَعَلْنَا سِرَاجًا وَهَّاجًا',
        textClean: 'وجعلنا سراجا وهاجا',
        translation: 'And made [therein] a burning lamp',
        tafsir: 'وجعلنا الشمس مصباحًا منيرًا متقدًا بالحرارة والضوء.',
        audioKey: '078013'
      },
      {
        number: 14,
        text: 'وَأَنزَلْنَا مِنَ الْمُعْصِرَاتِ مَاءً ثَجَّاجًا',
        textClean: 'وانزلنا من المعصرات ماء ثجاجا',
        translation: 'And sent down, from the rain clouds, pouring water',
        tafsir: 'وأنزلنا من السحب الممطرة ماءً متدفقًا كثيرًا.',
        audioKey: '078014'
      },
      {
        number: 15,
        text: 'لِّنُخْرِجَ بِهِ حَبًّا وَنَبَاتًا',
        textClean: 'لنخرج به حبا ونباتا',
        translation: 'That We may bring forth thereby grain and vegetation',
        tafsir: 'لنخرج بهذا الماء حبوبًا يقتات بها الناس، ونباتًا ترعاه الأنعام.',
        audioKey: '078015'
      },
      {
        number: 16,
        text: 'وَجَنَّاتٍ أَلْفَافًا',
        textClean: 'وجنات الفافا',
        translation: 'And gardens of entwined growth.',
        tafsir: 'وبساتين ملتفة الأشجار والأغصان لكثرتها وخضرتها.',
        audioKey: '078016'
      },
      {
        number: 17,
        text: 'إِنَّ يَوْمَ الْفَصْلِ كَانَ مِيقَاتًا',
        textClean: 'ان يوم الفصل كان ميقاتا',
        translation: 'Indeed, the Day of Judgement is an appointed time -',
        tafsir: 'إن يوم القيامة الذي يفصل الله فيه بين الخلائق كان وقتًا محددًا لا يتخلف.',
        audioKey: '078017'
      },
      {
        number: 18,
        text: 'يَوْمَ يُنفَخُ فِي الصُّورِ فَتَأْتُونَ أَفْوَاجًا',
        textClean: 'يوم ينفخ في الصور فتاتون افواجا',
        translation: 'The Day the Horn is blown and you will come forth in crowds',
        tafsir: 'يوم ينفخ الملك في القرن للبعث فتأتون جماعات وزمرًا للحساب.',
        audioKey: '078018'
      },
      {
        number: 19,
        text: 'وَفُتِحَتِ السَّمَاءُ فَكَانَتْ أَبْوَابًا',
        textClean: 'وفتحت السماء فكانت ابوابا',
        translation: 'And the heaven is opened and will become gateways',
        tafsir: 'وانشقت السماء لنزول الملائكة فصارت ذات أبواب وفروج.',
        audioKey: '078019'
      },
      {
        number: 20,
        text: 'وَسُيِّرَتِ الْجِبَالُ فَكَانَتْ سَرَابًا',
        textClean: 'وسيرت الجبال فكانت سرابا',
        translation: 'And the mountains are removed and will be [but] a mirage.',
        tafsir: 'ونسفت الجبال من أماكنها فصارت كالهباء والسراب.',
        audioKey: '078020'
      },
      {
        number: 21,
        text: 'إِنَّ جَهَنَّمَ كَانَتْ مِرْصَادًا',
        textClean: 'ان جهنم كانت مرصادا',
        translation: 'Indeed, Hell has been lying in wait',
        tafsir: 'إن جهنم تترصد الكافرين وترقبهم لتأخذهم.',
        audioKey: '078021'
      },
      {
        number: 22,
        text: 'لِّلطَّاغِينَ مَآبًا',
        textClean: 'للطاغين مابا',
        translation: 'For the transgressors, a place of return,',
        tafsir: 'للمتجاوزين حدود الله مقرًا ومرجعًا دائمًا.',
        audioKey: '078022'
      },
      {
        number: 23,
        text: 'لَّابِثِينَ فِيهَا أَحْقَابًا',
        textClean: 'لابثين فيها احقابا',
        translation: 'In which they will remain for ages [unending].',
        tafsir: 'ماكثين في نار جهنم دهورًا متتابعة لا تنقطع.',
        audioKey: '078023'
      },
      {
        number: 24,
        text: 'لَّا يَذُوقُونَ فِيهَا بَرْدًا وَلَا شَرَابًا',
        textClean: 'لا يذوقون فيها بردا ولا شرابا',
        translation: 'They will not taste therein [any] coolness or drink',
        tafsir: 'لا يجدون فيها ما يبرد حرارة أجسادهم ولا شرابًا يسكن عطشهم.',
        audioKey: '078024'
      },
      {
        number: 25,
        text: 'إِلَّا حَمِيمًا وَغَسَّاقًا',
        textClean: 'الا حميما وغساقا',
        translation: 'Except scalding water and foul purulence -',
        tafsir: 'إلا ماءً بالغ الغليان وصديدًا يسيل من جلود أهل النار منتنًا.',
        audioKey: '078025'
      },
      {
        number: 26,
        text: 'جَزَاءً وِفَاقًا',
        textClean: 'جزاء وفاقا',
        translation: 'An appropriate requital.',
        tafsir: 'عقابًا عادلاً موافقًا لأعمالهم السيئة وشركهم.',
        audioKey: '078026'
      },
      {
        number: 27,
        text: 'إِنَّهُمْ كَانُوا لَا يَرْجُونَ حِسَابًا',
        textClean: 'انهم كانوا لا يرجون حسابا',
        translation: 'Indeed, they were not expecting an account',
        tafsir: 'إنهم كانوا في الدنيا لا يصدقون بالبعث ولا يخافون الحساب.',
        audioKey: '078027'
      },
      {
        number: 28,
        text: 'وَكَذَّبُوا بِآيَاتِنَا كِذَّابًا',
        textClean: 'وكذبوا باياتنا كذابا',
        translation: 'And denied Our verses with [emphatic] denial.',
        tafsir: 'وكذبوا بآيات الله ورسله تكذيبًا شديدًا صريحًا.',
        audioKey: '078028'
      },
      {
        number: 29,
        text: 'وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ كِتَابًا',
        textClean: 'وكل شيء احصيناه كتابا',
        translation: 'But all things We have enumerated in writing.',
        tafsir: 'وكل عمل قليل أو كثير ضبطناه وحفظناه في اللوح المحفوظ وصحائف الأعمال.',
        audioKey: '078029'
      },
      {
        number: 30,
        text: 'فَذُوقُوا فَلَن نَّزِيدَكُمْ إِلَّا عَذَابًا',
        textClean: 'فذوقوا فلن نزيدكم الا عذابا',
        translation: 'So taste [the penalty], and never will We increase you except in torment.',
        tafsir: 'فيقال لهم: ذوقوا هذا العذاب الأليم، فلن نزيدكم إلا عذابًا فوق عذاب.',
        audioKey: '078030'
      },
      {
        number: 31,
        text: 'إِنَّ لِلْمُتَّقِينَ مَفَازًا',
        textClean: 'ان للمتقين مفازا',
        translation: 'Indeed, for the righteous is attainment -',
        tafsir: 'إن للذين خافوا ربهم وعملوا بطاعته فوزًا عظيمًا بالجنة ونجاة من النار.',
        audioKey: '078031'
      },
      {
        number: 32,
        text: 'حَدَائِقَ وَأَعْنَابًا',
        textClean: 'حدائق واعنابا',
        translation: 'Gardens and grapevines',
        tafsir: 'بساتين بهيجة وأشجار أعناب مثمرة نضرة.',
        audioKey: '078032'
      },
      {
        number: 33,
        text: 'وَكَوَاعِبَ أَتْرَابًا',
        textClean: 'وكواعب اترابا',
        translation: 'And full-breasted [companions] of equal age',
        tafsir: 'وزوجات شابات حسناوات في سن واحدة متناسقة الجمال.',
        audioKey: '078033'
      },
      {
        number: 34,
        text: 'وَكَأْسًا دِهَاقًا',
        textClean: 'وكاسا دهاقا',
        translation: 'And a full cup.',
        tafsir: 'وكؤوسًا مملوءة بالشراب الطيب الصافي اللذيذ.',
        audioKey: '078034'
      },
      {
        number: 35,
        text: 'لَّا يَسْمَعُونَ فِيهَا لَغْوًا وَلَا كِذَّابًا',
        textClean: 'لا يسمعون فيها لغوا ولا كذابا',
        translation: 'No ill speech will they hear therein or any falsehood -',
        tafsir: 'لا يسمعون في الجنة كلامًا باطلاً ولا كذبًا ولا أذى.',
        audioKey: '078035'
      },
      {
        number: 36,
        text: 'جَزَاءً مِّن رَّبِّكَ عَطَاءً حِسَابًا',
        textClean: 'جزاء من ربك عطاء حسابا',
        translation: '[As] reward from your Lord, [a generous] gift [made due by] account,',
        tafsir: 'هذا النعيم جزاءً عظيمًا وتفضلاً من الله كافيًا وافرًا.',
        audioKey: '078036'
      },
      {
        number: 37,
        text: 'رَّبِّ السَّمَاوَاتِ وَالْأَرْضِ وَمَا بَيْنَهُمَا الرَّحْمَٰنِ ۖ لَا يَمْلِكُونَ مِنْهُ خِطَابًا',
        textClean: 'رب السماوات والارض وما بينهما الرحمن لا يملكون منه خطابا',
        translation: '[From] the Lord of the heavens and the earth and whatever is between them, the Most Merciful. They possess not from Him [authority for] speech.',
        tafsir: 'رب السماوات والأرض الرحمن برحمته، لا يجرؤ أحد على الكلام معه إلا بإذنه.',
        audioKey: '078037'
      },
      {
        number: 38,
        text: 'يَوْمَ يَقُومُ الرُّوحُ وَالْمَلَائِكَةُ صَفًّا ۖ لَّا يَتَكَلَّمُونَ إِلَّا مَنْ أَذِنَ لَهُ الرَّحْمَٰنُ وَقَالَ صَوَابًا',
        textClean: 'يوم يقوم الروح والملائكة صفا لا يتكلمون الا من اذن له الرحمن وقال صوابا',
        translation: 'The Day that the Spirit and the angels will stand in rows, they will not speak except for one whom the Most Merciful permits, and he will say what is correct.',
        tafsir: 'يوم يقف جبريل والملائكة صفوفًا خاشعين، لا يشفع أحد إلا بإذن الرحمن.',
        audioKey: '078038'
      },
      {
        number: 39,
        text: 'ذَٰلِكَ الْيَوْمُ الْحَقُّ ۖ فَمَن شَاءَ اتَّخَذَ إِلَىٰ رَبِّهِ مَآبًا',
        textClean: 'ذلك اليوم الحق فمن شاء اتخذ الى ربه مابا',
        translation: 'That is the True Day; so he who wills may take to his Lord a [way of] return.',
        tafsir: 'ذلك اليوم آتٍ لا ريب فيه، فمن أراد النجاة فليتب إلى ربه بالعمل الصالح.',
        audioKey: '078039'
      },
      {
        number: 40,
        text: 'إِنَّا أَنذَرْنَاكُمْ عَذَابًا قَرِيبًا يَوْمَ يَنظُرُ الْمَرْءُ مَا قَدَّمَتْ يَدَاهُ وَيَقُولُ الْكَافِرُ يَا لَيْتَنِي كُنتُ تُرَابًا',
        textClean: 'انا انذرناكم عذابا قريبا يوم ينظر المرء ما قدمت يداه ويقول الكافر يا ليتني كنت ترابا',
        translation: 'Indeed, We have warned you of a near punishment on the Day when a man will observe what his hands have put forth and the disbeliever will say, "Oh, I wish that I were dust!"',
        tafsir: 'حذرناكم عذاب يوم القيامة القريب، حين يرى كل إنسان ما عمل، ويتمنى الكافر لو كان ترابًا لم يُخلق.',
        audioKey: '078040'
      }
    ]
  }
];
