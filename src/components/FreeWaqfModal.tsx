import React from 'react';
import { 
  Heart, 
  X, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  BookOpen, 
  Download, 
  Smartphone,
  ShieldCheck,
  Award
} from 'lucide-react';

interface FreeWaqfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInstallModal?: () => void;
}

export const FreeWaqfModal: React.FC<FreeWaqfModalProps> = ({
  isOpen,
  onClose,
  onOpenInstallModal,
}) => {
  const [copied, setCopied] = React.useState<boolean>(false);

  if (!isOpen) return null;

  const handleShare = () => {
    const shareText = `﴿ جُزْءُ عَمَّ - المصحف المعلم والتدبر ﴾\nتطبيق قرآني متكامل مجاني ١٠٠٪ لوجه الله تعالى (صدقة جارية) يحتوي على سور جزء عم كاملة مع تلاوات متعددة، وتفسير ميسر، ومواقيت الصلاة، وترديد الحفظ.\n${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'تطبيق جزء عم - مجاني لوجه الله تعالى',
        text: shareText,
        url: window.location.origin,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#181a20] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
        dir="rtl"
      >
        {/* Header with Islamic Pattern */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-amber-950/80 via-[#23201d] to-[#181a20] border-b border-amber-500/30 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          {/* App Icon Centered with Golden Glow */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-2xl sm:rounded-3xl bg-zinc-900 border-2 border-amber-400 shadow-xl shadow-amber-950/60 p-1 flex items-center justify-center overflow-hidden">
            <img 
              src="/icon-192.png" 
              alt="أيقونة جزء عم" 
              className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>وقف لله تعالى • صدقة جارية</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-uthmani text-amber-200 leading-snug">
            برنامج مجاني لوجه الله تعالى
          </h3>
          <p className="text-xs text-zinc-300 mt-1 max-w-sm mx-auto font-arabic">
            تطبيق خالص لوجه الله الكريم لخدمة كتاب الله وتيسير قراءة وحفظ وتدبر جزء عم.
          </p>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-300">
          
          {/* Quranic Ayah Quote Card */}
          <div className="p-4 rounded-2xl bg-[#222026] border border-amber-500/25 text-center space-y-1.5 shadow-inner">
            <div className="text-amber-300 font-quran text-base sm:text-lg leading-relaxed">
              ﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ وَيُبَشِّرُ الْمُؤْمِنِينَ ﴾
            </div>
            <div className="text-[10px] text-zinc-400 font-arabic">
              [سورة الإسراء: ٩]
            </div>
          </div>

          {/* Guarantees & Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold text-xs">خالٍ من الإعلانات ١٠٠٪</strong>
                <span className="text-[11px] text-zinc-400">لا يحتوي على أي إعلانات مزعجة احتراماً للقرآن الكريم.</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-2.5">
              <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold text-xs">مجاني بالكامل للأبد</strong>
                <span className="text-[11px] text-zinc-400">متاح لجميع المسلمين دون أي اشتراكات أو رسوم.</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-2.5">
              <Smartphone className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold text-xs">يعمل بدون إنترنت (Offline)</strong>
                <span className="text-[11px] text-zinc-400">حفظ الآيات والمفضلات والإعدادات على جهازك محلياً.</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-2.5">
              <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold text-xs">صدقة جارية</strong>
                <span className="text-[11px] text-zinc-400">نسأل الله أن يتقبله ويجعله في ميزان حسناتنا وحسناتكم.</span>
              </div>
            </div>
          </div>

          {/* Prayer Request Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 via-zinc-900 to-amber-950/40 border border-orange-500/30 text-center space-y-1">
            <h4 className="text-xs font-bold text-amber-300">
              نسألكم صالح الدعاء
            </h4>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              اللهم اجعل هذا العمل خالصاً لوجهك الكريم، وتقبله منا ومن كل من ساهم في نشره أو قرأ منه، واغفر لنا ولوالدينا ولجميع المسلمين والمسلمات.
            </p>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#15171d] flex flex-col sm:flex-row items-center gap-2">
          {/* Share as Sadaqah Jariyah */}
          <button
            onClick={handleShare}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-98"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'تم نسخ الرابط لنشره!' : 'انشر التطبيق وشارك في الأجر'}</span>
          </button>

          {/* If install modal opener exists */}
          {onOpenInstallModal && (
            <button
              onClick={() => {
                onClose();
                onOpenInstallModal();
              }}
              className="w-full sm:w-auto py-2.5 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>تثبيت على الهاتف</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
