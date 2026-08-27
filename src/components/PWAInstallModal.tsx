import React, { useState, useEffect } from 'react';
import { 
  Download, 
  X, 
  Smartphone, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  WifiOff, 
  ExternalLink,
  Layers
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstalled?: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalled
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [installing, setInstalling] = useState<boolean>(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);
    if (isIosDevice) {
      setActiveTab('ios');
    }

    // Detect if already installed as standalone
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    setIsStandalone(Boolean(isInStandaloneMode));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setInstalling(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          if (onInstalled) onInstalled();
          onClose();
        }
      } catch (err) {
        console.error('Install error:', err);
      } finally {
        setInstalling(false);
      }
    } else {
      // If no native prompt, guide the user according to device
      if (isIOS) {
        setActiveTab('ios');
      } else {
        setActiveTab('android');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#181a20] border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
        dir="rtl"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-[#1f222b]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-amber-400/40 shadow-md bg-zinc-900 flex items-center justify-center shrink-0">
              <img 
                src="/icon-192.png" 
                alt="أيقونة تطبيق جزء عم" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-uthmani text-amber-300 leading-tight">
                تثبيت تطبيق جُزْءُ عَمَّ
              </h3>
              <p className="text-xs text-zinc-400">
                يعمل كتطبيق أصلي على هواتف أندرويد وآيفون
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* App Advantages Banner */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center">
            <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-zinc-800/50">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold text-zinc-200">سريع وفوري</span>
              <span className="text-[9px] text-zinc-400">بدون أشرطة تصفح</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-zinc-800/50">
              <WifiOff className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-bold text-zinc-200">يعمل بدون إنترنت</span>
              <span className="text-[9px] text-zinc-400">حفظ محلي فوري</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-zinc-800/50">
              <Smartphone className="w-4 h-4 text-orange-400" />
              <span className="text-[11px] font-bold text-zinc-200">أيقونة الشاشة</span>
              <span className="text-[9px] text-zinc-400">وصول مباشر</span>
            </div>
          </div>

          {/* If already installed */}
          {isStandalone && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 text-xs">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>أنت تستخدم التطبيق بالفعل في وضع التثبيت المستقل على هاتفك!</span>
            </div>
          )}

          {/* Quick Install Button for Chrome/Android if prompt is available */}
          {deferredPrompt && (
            <div className="text-center space-y-2">
              <button
                onClick={handleInstallClick}
                disabled={installing}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-950/50 flex items-center justify-center gap-2.5 transition active:scale-98"
              >
                <Download className="w-5 h-5" />
                <span>{installing ? 'جاري التثبيت...' : 'تثبيت التطبيق الآن بضغطة زر'}</span>
              </button>
              <p className="text-[11px] text-zinc-400">
                سيتثبت التطبيق فوراً مع أيقونته المخصصة على شاشة هاتفك
              </p>
            </div>
          )}

          {/* Device Tabs for Step-by-Step Instructions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-2xl border border-zinc-800">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'android'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>هواتف أندرويد (Android / سامسونج)</span>
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'ios'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>هواتف آيفون وآيباد (iPhone / iOS)</span>
              </button>
            </div>

            {/* Android Instructions */}
            {activeTab === 'android' && (
              <div className="p-4 rounded-2xl bg-[#1f222b] border border-zinc-700/70 space-y-3.5 text-xs text-zinc-300">
                <h4 className="font-bold text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>خطوات التثبيت على أندرويد (متصفح كروم / سامسونج):</span>
                </h4>
                <ol className="space-y-2.5 text-zinc-300 pr-1">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ١
                    </span>
                    <span>
                      انقر على زر القائمة <strong className="text-white">⋮ (الثلاث نقاط)</strong> في أعلى أو أسفل يمين متصفح Chrome.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ٢
                    </span>
                    <span>
                      اختر <strong className="text-amber-300">«تثبيت التطبيق»</strong> أو <strong className="text-amber-300">«إضافة إلى الشاشة الرئيسية»</strong> (Install App / Add to Home screen).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ٣
                    </span>
                    <span>
                      اضغط <strong className="text-white">«تثبيت»</strong> وسينزل التطبيق فوراً بأيقونة جزء عم على شاشة هاتفك.
                    </span>
                  </li>
                </ol>
              </div>
            )}

            {/* iOS Instructions */}
            {activeTab === 'ios' && (
              <div className="p-4 rounded-2xl bg-[#1f222b] border border-zinc-700/70 space-y-3.5 text-xs text-zinc-300">
                <h4 className="font-bold text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>خطوات التثبيت على الآيفون (متصفح Safari):</span>
                </h4>
                <ol className="space-y-2.5 text-zinc-300 pr-1">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ١
                    </span>
                    <span className="flex items-center gap-1.5 flex-wrap">
                      اضغط على زر المشاركة <Share className="w-4 h-4 text-blue-400 inline" /> (Share) في أسفل شاشة Safari.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ٢
                    </span>
                    <span className="flex items-center gap-1.5 flex-wrap">
                      مرر للأسفل واختر <PlusSquare className="w-4 h-4 text-amber-400 inline" /> <strong className="text-amber-300">«إضافة إلى الصفحة الرئيسية»</strong> (Add to Home Screen).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ٣
                    </span>
                    <span>
                      اضغط على زر <strong className="text-white">«إضافة» (Add)</strong> في أعلى الزاوية. سيظهر التطبيق فوراً على شاشة هاتفك مثل التطبيقات الرسمية.
                    </span>
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#16181f] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>مجاني 100% وبدون إعلانات</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition"
          >
            حسناً، فهمت
          </button>
        </div>
      </div>
    </div>
  );
};
