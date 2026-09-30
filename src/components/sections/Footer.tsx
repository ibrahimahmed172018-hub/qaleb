import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Layers, ShieldCheck, Heart } from "lucide-react";
import { getWhatsAppUrl, FACEBOOK_URL } from "@/lib/whatsapp";
import FacebookIcon from "@/components/icons/FacebookIcon";

export default function Footer() {
  const whatsappUrl = getWhatsAppUrl("مرحباً، أود الاستفسار بخصوص منصة قالب (QALEB).");

  return (
    <footer className="border-t border-brand-border bg-brand-bg pt-16 pb-12 text-xs text-brand-text-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-accent-1/30 bg-brand-accent-1/10 overflow-hidden p-1">
                <Image
                  src="/icon.png"
                  alt="QALEB"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-extrabold text-white flex items-center gap-1.5">
                <span>قالب</span>
                <span className="text-brand-accent-2 font-mono">QALEB</span>
              </span>
            </Link>
            <p className="max-w-md text-xs leading-relaxed text-slate-400">
              منصة متخصصة في توفير أنظمة ومتاجر ويب جاهزة ومتكاملة للشركات والأفراد، مبنية بأقوى التقنيات السحابية لتضمن أقصى سرعة وأعلى معدل تحويل للمبيعات.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#products" className="hover:text-white transition-colors">
                  الأنظمة والمتاجر
                </a>
              </li>
              <li>
                <a href="#addons" className="hover:text-white transition-colors">
                  الخدمات والإضافات
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-accent-2 transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-accent-1" />
                  <span>دخول الإدارة</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">التواصل والدعم الفني</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              فريق التطوير متاح يومياً للرد على استفساراتك وتخصيص النظام المناسب لنشاطك.
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-accent-1/30 bg-brand-accent-1/10 px-4 py-2.5 text-xs font-semibold text-brand-accent-2 transition-all hover:bg-brand-accent-1/20"
              >
                <MessageCircle className="h-4 w-4" />
                <span>محادثة واتساب مباشرة</span>
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-xs font-semibold text-blue-400 transition-all hover:bg-blue-500/20 hover:border-blue-500/50"
              >
                <FacebookIcon className="h-4 w-4" />
                <span>صفحة فيسبوك الرسمية</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div>
            © {new Date().getFullYear()} منصة <span className="text-white font-semibold">قالب QALEB</span>. جميع الحقوق محفوظة.
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>صُنع بشغف لدعم رواد الأعمال في الوطن العربي</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
