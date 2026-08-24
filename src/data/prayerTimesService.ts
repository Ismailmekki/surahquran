// Prayer Times Calculation Library (Standard Islamic Astronomical Formulas)
export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface CityLocation {
  id: string;
  country: string;
  city: string;
  countryAr: string;
  cityAr: string;
  flag: string;
  latitude: number;
  longitude: number;
  timezone: number; // UTC offset in hours
  method: 'MWL' | 'Makkah' | 'Egyptian' | 'ISNA' | 'Karachi';
}

export const POPULAR_CITIES: CityLocation[] = [
  { id: 'sa-makkah', country: 'Saudi Arabia', city: 'Makkah', countryAr: 'السعودية', cityAr: 'مكة المكرمة', flag: '🇸🇦', latitude: 21.4225, longitude: 39.8262, timezone: 3, method: 'Makkah' },
  { id: 'sa-madinah', country: 'Saudi Arabia', city: 'Madinah', countryAr: 'السعودية', cityAr: 'المدينة المنورة', flag: '🇸🇦', latitude: 24.4672, longitude: 39.6024, timezone: 3, method: 'Makkah' },
  { id: 'sa-riyadh', country: 'Saudi Arabia', city: 'Riyadh', countryAr: 'السعودية', cityAr: 'الرياض', flag: '🇸🇦', latitude: 24.7136, longitude: 46.6753, timezone: 3, method: 'Makkah' },
  { id: 'eg-cairo', country: 'Egypt', city: 'Cairo', countryAr: 'مصر', cityAr: 'القاهرة', flag: '🇪🇬', latitude: 30.0444, longitude: 31.2357, timezone: 2, method: 'Egyptian' },
  { id: 'ae-dubai', country: 'UAE', city: 'Dubai', countryAr: 'الإمارات', cityAr: 'دبي', flag: '🇦🇪', latitude: 25.2048, longitude: 55.2708, timezone: 4, method: 'Makkah' },
  { id: 'kw-kuwait', country: 'Kuwait', city: 'Kuwait City', countryAr: 'الكويت', cityAr: 'الكويت', flag: '🇰🇼', latitude: 29.3759, longitude: 47.9774, timezone: 3, method: 'Makkah' },
  { id: 'qa-doha', country: 'Qatar', city: 'Doha', countryAr: 'قطر', cityAr: 'الدوحة', flag: '🇶🇦', latitude: 25.2854, longitude: 51.5310, timezone: 3, method: 'Makkah' },
  { id: 'bh-manama', country: 'Bahrain', city: 'Manama', countryAr: 'البحرين', cityAr: 'المنامة', flag: '🇧🇭', latitude: 26.2285, longitude: 50.5860, timezone: 3, method: 'Makkah' },
  { id: 'om-muscat', country: 'Oman', city: 'Muscat', countryAr: 'عُمان', cityAr: 'مسقط', flag: '🇴🇲', latitude: 23.5880, longitude: 58.3829, timezone: 4, method: 'Makkah' },
  { id: 'jo-amman', country: 'Jordan', city: 'Amman', countryAr: 'الأردن', cityAr: 'عمّان', flag: '🇯🇴', latitude: 31.9454, longitude: 35.9284, timezone: 3, method: 'MWL' },
  { id: 'ps-jerusalem', country: 'Palestine', city: 'Jerusalem', countryAr: 'فلسطين', cityAr: 'القدس الشريف', flag: '🇵🇸', latitude: 31.7683, longitude: 35.2137, timezone: 3, method: 'MWL' },
  { id: 'iq-baghdad', country: 'Iraq', city: 'Baghdad', countryAr: 'العراق', cityAr: 'بغداد', flag: '🇮🇶', latitude: 33.3152, longitude: 44.3661, timezone: 3, method: 'MWL' },
  { id: 'sy-damascus', country: 'Syria', city: 'Damascus', countryAr: 'سوريا', cityAr: 'دمشق', flag: '🇸🇾', latitude: 33.5138, longitude: 36.2765, timezone: 3, method: 'MWL' },
  { id: 'lb-beirut', country: 'Lebanon', city: 'Beirut', countryAr: 'لبنان', cityAr: 'بيروت', flag: '🇱🇧', latitude: 33.8938, longitude: 35.5018, timezone: 3, method: 'MWL' },
  { id: 'ye-sanaa', country: 'Yemen', city: 'Sanaa', countryAr: 'اليمن', cityAr: 'صنعاء', flag: '🇾🇪', latitude: 15.3694, longitude: 44.1910, timezone: 3, method: 'Makkah' },
  { id: 'dz-algiers', country: 'Algeria', city: 'Algiers', countryAr: 'الجزائر', cityAr: 'الجزائر', flag: '🇩🇿', latitude: 36.7538, longitude: 3.0588, timezone: 1, method: 'MWL' },
  { id: 'ma-rabat', country: 'Morocco', city: 'Rabat', countryAr: 'المغرب', cityAr: 'الرباط', flag: '🇲🇦', latitude: 34.0209, longitude: -6.8416, timezone: 1, method: 'MWL' },
  { id: 'tn-tunis', country: 'Tunisia', city: 'Tunis', countryAr: 'تونس', cityAr: 'تونس', flag: '🇹🇳', latitude: 36.8065, longitude: 10.1815, timezone: 1, method: 'MWL' },
  { id: 'sd-khartoum', country: 'Sudan', city: 'Khartoum', countryAr: 'السودان', cityAr: 'الخرطوم', flag: '🇸🇩', latitude: 15.5007, longitude: 32.5599, timezone: 2, method: 'Egyptian' },
  { id: 'ly-tripoli', country: 'Libya', city: 'Tripoli', countryAr: 'ليبيا', cityAr: 'طرابلس', flag: '🇱🇾', latitude: 32.8872, longitude: 13.1913, timezone: 2, method: 'MWL' },
  { id: 'mr-nouakchott', country: 'Mauritania', city: 'Nouakchott', countryAr: 'موريتانيا', cityAr: 'نواكشوط', flag: '🇲🇷', latitude: 18.0735, longitude: -15.9582, timezone: 0, method: 'MWL' },
  { id: 'so-mogadishu', country: 'Somalia', city: 'Mogadishu', countryAr: 'الصومال', cityAr: 'مقديشو', flag: '🇸🇴', latitude: 2.0469, longitude: 45.3182, timezone: 3, method: 'MWL' },
  { id: 'tr-istanbul', country: 'Turkey', city: 'Istanbul', countryAr: 'تركيا', cityAr: 'إسطنبول', flag: '🇹🇷', latitude: 41.0082, longitude: 28.9784, timezone: 3, method: 'MWL' },
  { id: 'id-jakarta', country: 'Indonesia', city: 'Jakarta', countryAr: 'إندونيسيا', cityAr: 'جاكرتا', flag: '🇮🇩', latitude: -6.2088, longitude: 106.8456, timezone: 7, method: 'MWL' },
  { id: 'my-kuala_lumpur', country: 'Malaysia', city: 'Kuala Lumpur', countryAr: 'ماليزيا', cityAr: 'كوالالمبور', flag: '🇲🇾', latitude: 3.1390, longitude: 101.6869, timezone: 8, method: 'MWL' },
  { id: 'pk-karachi', country: 'Pakistan', city: 'Karachi', countryAr: 'باكستان', cityAr: 'كراتشي', flag: '🇵🇰', latitude: 24.8607, longitude: 67.0011, timezone: 5, method: 'Karachi' },
  { id: 'gb-london', country: 'UK', city: 'London', countryAr: 'بريطانيا', cityAr: 'لندن', flag: '🇬🇧', latitude: 51.5074, longitude: -0.1278, timezone: 0, method: 'MWL' },
  { id: 'fr-paris', country: 'France', city: 'Paris', countryAr: 'فرنسا', cityAr: 'باريس', flag: '🇫🇷', latitude: 48.8566, longitude: 2.3522, timezone: 1, method: 'MWL' },
  { id: 'de-berlin', country: 'Germany', city: 'Berlin', countryAr: 'ألمانيا', cityAr: 'برلين', flag: '🇩🇪', latitude: 52.5200, longitude: 13.4050, timezone: 1, method: 'MWL' },
  { id: 'us-new_york', country: 'USA', city: 'New York', countryAr: 'أمريكا', cityAr: 'نيويورك', flag: '🇺🇸', latitude: 40.7128, longitude: -74.0060, timezone: -5, method: 'ISNA' },
];

export interface PrayerItem {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nameAr: string;
  nameEn: string;
  time: string;
  isNext: boolean;
  timeRemaining?: string;
}

// Astronomical calculation helpers
function degToRad(deg: number) { return (deg * Math.PI) / 180.0; }
function radToDeg(rad: number) { return (rad * 180.0) / Math.PI; }
function fixHour(a: number) { a = a - 24.0 * Math.floor(a / 24.0); return a < 0 ? a + 24.0 : a; }
function fixAngle(a: number) { a = a - 360.0 * Math.floor(a / 360.0); return a < 0 ? a + 360.0 : a; }

export function calculatePrayerTimes(loc: CityLocation, date: Date = new Date()): { prayers: PrayerTimes; prayerList: PrayerItem[]; nextPrayer: PrayerItem | null } {
  // Julian Date calculation
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  let D = (367 * year) - Math.floor((7 * (year + Math.floor((month + 9) / 12))) / 4) + Math.floor((275 * month) / 9) + day - 730531.5;
  
  // Sun position
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(degToRad(g)) + 0.020 * Math.sin(degToRad(2 * g)));
  const e = 23.439 - 0.00000036 * D;
  
  // Declination and Equation of time
  const dRad = Math.asin(Math.sin(degToRad(e)) * Math.sin(degToRad(L)));
  const RA = radToDeg(Math.atan2(Math.cos(degToRad(e)) * Math.sin(degToRad(L)), Math.cos(degToRad(L)))) / 15.0;
  const EqT = q / 15.0 - fixHour(RA);

  // Time calculations
  const timezoneOffset = -date.getTimezoneOffset() / 60; // Auto use local browser offset if matching
  const tz = loc.timezone;

  const noon = fixHour(12 + tz - loc.longitude / 15.0 - EqT);

  // Sun angles based on calculation method
  let fajrAngle = 18.0;
  let ishaAngle = 18.0;

  if (loc.method === 'Makkah') {
    fajrAngle = 18.5;
    ishaAngle = 19.0;
  } else if (loc.method === 'Egyptian') {
    fajrAngle = 19.5;
    ishaAngle = 17.5;
  } else if (loc.method === 'ISNA') {
    fajrAngle = 15.0;
    ishaAngle = 15.0;
  } else if (loc.method === 'Karachi') {
    fajrAngle = 18.0;
    ishaAngle = 18.0;
  }

  // Sunrise / Sunset calculation
  const sunAngle = 0.833;
  const latRad = degToRad(loc.latitude);
  
  const calcTime = (angle: number, direction: 'ccw' | 'cw') => {
    const val = (-Math.sin(degToRad(angle)) - Math.sin(latRad) * Math.sin(dRad)) / (Math.cos(latRad) * Math.cos(dRad));
    if (val > 1 || val < -1) return noon; // Polar region fallback
    const hourAngle = radToDeg(Math.acos(val)) / 15.0;
    return direction === 'ccw' ? noon - hourAngle : noon + hourAngle;
  };

  const fajrTime = fixHour(calcTime(fajrAngle, 'ccw'));
  const sunriseTime = fixHour(calcTime(sunAngle, 'ccw'));
  const dhuhrTime = noon;
  
  // Asr (Shafi / Standard shadow = 1)
  const asrAlt = radToDeg(Math.atan(1 + Math.tan(Math.abs(latRad - dRad))));
  const asrVal = (Math.sin(degToRad(90 - asrAlt)) - Math.sin(latRad) * Math.sin(dRad)) / (Math.cos(latRad) * Math.cos(dRad));
  const asrHourAngle = radToDeg(Math.acos(Math.max(-1, Math.min(1, asrVal)))) / 15.0;
  const asrTime = fixHour(noon + asrHourAngle);

  const maghribTime = fixHour(calcTime(sunAngle, 'cw'));
  const ishaTime = fixHour(calcTime(ishaAngle, 'cw'));

  const formatTime = (hourFraction: number): string => {
    const totalMinutes = Math.round(hourFraction * 60);
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    const period = h >= 12 ? 'م' : 'ص';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m < 10 ? '0' : ''}${m} ${period}`;
  };

  const format24Time = (hourFraction: number): { hours: number; minutes: number } => {
    const totalMinutes = Math.round(hourFraction * 60);
    return {
      hours: Math.floor(totalMinutes / 60) % 24,
      minutes: totalMinutes % 60,
    };
  };

  const prayersObj: PrayerTimes = {
    fajr: formatTime(fajrTime),
    sunrise: formatTime(sunriseTime),
    dhuhr: formatTime(dhuhrTime),
    asr: formatTime(asrTime),
    maghrib: formatTime(maghribTime),
    isha: formatTime(ishaTime),
  };

  // Determine current / next prayer
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const timesInMinutes = [
    { id: 'fajr' as const, nameAr: 'الفجر', nameEn: 'Fajr', mins: format24Time(fajrTime).hours * 60 + format24Time(fajrTime).minutes, timeStr: prayersObj.fajr },
    { id: 'sunrise' as const, nameAr: 'الشروق', nameEn: 'Sunrise', mins: format24Time(sunriseTime).hours * 60 + format24Time(sunriseTime).minutes, timeStr: prayersObj.sunrise },
    { id: 'dhuhr' as const, nameAr: 'الظهر', nameEn: 'Dhuhr', mins: format24Time(dhuhrTime).hours * 60 + format24Time(dhuhrTime).minutes, timeStr: prayersObj.dhuhr },
    { id: 'asr' as const, nameAr: 'العصر', nameEn: 'Asr', mins: format24Time(asrTime).hours * 60 + format24Time(asrTime).minutes, timeStr: prayersObj.asr },
    { id: 'maghrib' as const, nameAr: 'المغرب', nameEn: 'Maghrib', mins: format24Time(maghribTime).hours * 60 + format24Time(maghribTime).minutes, timeStr: prayersObj.maghrib },
    { id: 'isha' as const, nameAr: 'العشاء', nameEn: 'Isha', mins: format24Time(ishaTime).hours * 60 + format24Time(ishaTime).minutes, timeStr: prayersObj.isha },
  ];

  let nextPrayerItem: PrayerItem | null = null;
  for (const p of timesInMinutes) {
    if (p.mins > currentMinutes && p.id !== 'sunrise') {
      const diff = p.mins - currentMinutes;
      const dh = Math.floor(diff / 60);
      const dm = diff % 60;
      nextPrayerItem = {
        id: p.id,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        time: p.timeStr,
        isNext: true,
        timeRemaining: dh > 0 ? `${dh} س و ${dm} د` : `${dm} دقيقة`,
      };
      break;
    }
  }

  // If past Isha, next is Fajr tomorrow
  if (!nextPrayerItem) {
    const fajrMinsTomorrow = (format24Time(fajrTime).hours * 60 + format24Time(fajrTime).minutes) + (24 * 60);
    const diff = fajrMinsTomorrow - currentMinutes;
    const dh = Math.floor(diff / 60);
    const dm = diff % 60;
    nextPrayerItem = {
      id: 'fajr',
      nameAr: 'الفجر',
      nameEn: 'Fajr',
      time: prayersObj.fajr,
      isNext: true,
      timeRemaining: dh > 0 ? `${dh} س و ${dm} د` : `${dm} دقيقة`,
    };
  }

  const prayerList: PrayerItem[] = timesInMinutes.map((p) => {
    const isNext = nextPrayerItem?.id === p.id;
    return {
      id: p.id,
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      time: p.timeStr,
      isNext,
      timeRemaining: isNext ? nextPrayerItem.timeRemaining : undefined,
    };
  });

  return { prayers: prayersObj, prayerList, nextPrayer: nextPrayerItem };
}
