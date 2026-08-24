import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset,
  Volume2,
  X,
  Compass,
  Search,
  Sparkles
} from 'lucide-react';
import { 
  POPULAR_CITIES, 
  CityLocation, 
  calculatePrayerTimes, 
  PrayerItem 
} from '../data/prayerTimesService';

interface TopPrayerBarProps {
  onOpenCitySelector?: () => void;
}

export const TopPrayerBar: React.FC<TopPrayerBarProps> = () => {
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    return localStorage.getItem('juz_amma_prayer_city') || 'sa-makkah';
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const selectedCity: CityLocation = 
    POPULAR_CITIES.find((c) => c.id === selectedCityId) || POPULAR_CITIES[0];

  const prayerData = calculatePrayerTimes(selectedCity);

  // Live timer tick every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      );
      setForceUpdate((c) => c + 1);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectCity = (cityId: string) => {
    setSelectedCityId(cityId);
    localStorage.setItem('juz_amma_prayer_city', cityId);
    setIsCityModalOpen(false);
  };

  const getPrayerIcon = (id: string, isNext: boolean) => {
    const colorClass = isNext ? 'text-amber-400' : 'text-zinc-400';
    switch (id) {
      case 'fajr':
        return <Moon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colorClass}`} />;
      case 'sunrise':
        return <Sunrise className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colorClass}`} />;
      case 'dhuhr':
        return <Sun className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colorClass}`} />;
      case 'asr':
        return <Sun className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colorClass}`} />;
      case 'maghrib':
        return <Sunset className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colorClass}`} />;
      case 'isha':
      default:
        return <Moon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colorClass}`} />;
    }
  };

  const filteredCities = POPULAR_CITIES.filter(
    (c) =>
      c.cityAr.includes(searchQuery) ||
      c.countryAr.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Top Sticky Prayer Strip (شريط مواقيت الصلاة العلوي الذكي المتوافق مع الهاتف) */}
      <div 
        id="top-prayer-bar"
        className="w-full bg-[#13151b] border-b border-zinc-800/90 text-white select-none transition-all duration-300 relative z-20 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          {/* Main Compact Row */}
          <div className="flex items-center justify-between h-9 sm:h-10 text-[11px] sm:text-xs">
            {/* City Selector Pill */}
            <button
              id="open-city-modal-btn"
              onClick={() => setIsCityModalOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-zinc-800/90 hover:bg-orange-500/20 text-zinc-200 hover:text-white border border-zinc-700/80 hover:border-orange-500/50 transition cursor-pointer shrink-0"
              title="تغيير الدولة والمدينة لمواقيت الصلاة"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="text-xs">{selectedCity.flag}</span>
              <span className="font-semibold">{selectedCity.cityAr}</span>
              <span className="text-[10px] text-zinc-400 hidden xs:inline">({selectedCity.countryAr})</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {/* Next Prayer Highlight (مؤشر الصلاة القادمة) */}
            {prayerData.nextPrayer && (
              <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 hover:bg-orange-500/25 cursor-pointer transition"
              >
                <Clock className="w-3 h-3 text-orange-400 animate-pulse shrink-0" />
                <span className="font-medium">
                  الصلاة القادمة: <strong className="text-white">{prayerData.nextPrayer.nameAr}</strong>
                </span>
                <span className="font-bold text-orange-400 font-mono text-[11px] sm:text-xs">
                  {prayerData.nextPrayer.time}
                </span>
                {prayerData.nextPrayer.timeRemaining && (
                  <span className="text-[10px] bg-orange-950/60 text-orange-200 px-1.5 py-0.2 rounded border border-orange-500/20 hidden sm:inline-block">
                    (متبقي {prayerData.nextPrayer.timeRemaining})
                  </span>
                )}
              </div>
            )}

            {/* Expand / Collapse All Prayer Times Toggle */}
            <button
              id="toggle-prayer-strip-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title={isExpanded ? 'طي المواقيت' : 'عرض كافة الصلوات'}
            >
              <span className="hidden sm:inline font-medium">
                {isExpanded ? 'إخفاء الصلوات' : 'كافة الصلوات'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-orange-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>
          </div>

          {/* Expanded or Mobile Horizontal Scroll Prayer Times View */}
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              isExpanded 
                ? 'max-h-24 opacity-100 py-2 border-t border-zinc-800/80' 
                : 'max-h-0 sm:max-h-10 opacity-100 sm:py-1.5 border-t border-zinc-800/40'
            }`}
          >
            <div className="flex items-center justify-between sm:justify-center gap-1.5 sm:gap-4 overflow-x-auto no-scrollbar py-0.5">
              {prayerData.prayerList.map((prayer) => (
                <div
                  key={prayer.id}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl border shrink-0 transition ${
                    prayer.isNext
                      ? 'bg-gradient-to-r from-orange-600/30 to-amber-600/30 border-orange-500/80 text-white shadow-xs font-bold'
                      : 'bg-zinc-800/50 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {getPrayerIcon(prayer.id, prayer.isNext)}
                  <span className="text-[11px] sm:text-xs">{prayer.nameAr}</span>
                  <span className={`text-[11px] sm:text-xs font-mono ${prayer.isNext ? 'text-amber-300' : 'text-zinc-400'}`}>
                    {prayer.time}
                  </span>
                  {prayer.isNext && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Country & City Selection Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#181a20] w-full max-w-lg rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[85vh] text-white">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600/30 via-zinc-800 to-zinc-800 border-b border-zinc-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    تحديد الدولة والمدينة لمواقيت الصلاة
                  </h3>
                  <p className="text-xs text-zinc-400">
                    حساب أوقات الأذان والصلوات بدقة بحسب الموقع الجغرافي
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-zinc-800 bg-[#15171d]">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن دولتك أو مدينتك (مثل: مكة، القاهرة، الجزائر، دبي، لندن...)"
                  className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-400 focus:outline-hidden focus:border-orange-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Cities List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-zinc-800/60">
              {filteredCities.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 text-xs">
                  لا توجد نتائج مطابقة لبحثك.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {filteredCities.map((city) => {
                    const isSelected = city.id === selectedCityId;
                    return (
                      <button
                        key={city.id}
                        onClick={() => handleSelectCity(city.id)}
                        className={`p-3 rounded-2xl border text-right transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-orange-500/20 border-orange-500 text-white font-bold'
                            : 'bg-zinc-800/60 border-zinc-750 text-zinc-300 hover:border-orange-500/50 hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{city.flag}</span>
                          <div>
                            <div className="text-xs font-bold text-white">
                              {city.cityAr}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              {city.countryAr} • {city.city}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-xs shadow-orange-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 bg-[#14161b] border-t border-zinc-800 text-center text-[11px] text-zinc-400">
              يتم حفظ المدينة تلقائياً وتحديث أوقات الصلوات والصلاة القادمة طوال اليوم
            </div>
          </div>
        </div>
      )}
    </>
  );
};
