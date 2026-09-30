import {
  Code,
  Cloud,
  Globe,
  Check,
  MessageCircle,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Wrench,
  Layers,
  LucideIcon,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { Database } from "@/types/database.types";

type Addon = Database["public"]["Tables"]["addons"]["Row"];

interface AddonsProps {
  addons?: Addon[];
}

interface AddonCardData {
  id: string;
  title: string;
  price: number;
  priceLabel: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  features: string[];
}

/**
 * Dynamically assign an appropriate icon based on keywords in title or description.
 */
function getAddonIcon(title: string, description: string): LucideIcon {
  const text = (title + " " + description).toLowerCase();
  if (
    text.includes("دومين") ||
    text.includes("استضافة") ||
    text.includes("نطاق") ||
    text.includes("dns") ||
    text.includes("سيرفر")
  ) {
    return Globe;
  }
  if (
    text.includes("رفع") ||
    text.includes("نشر") ||
    text.includes("تركيب") ||
    text.includes("سحاب") ||
    text.includes("سحابة") ||
    text.includes("vercel")
  ) {
    return Cloud;
  }
  if (
    text.includes("دفع") ||
    text.includes("بوابة") ||
    text.includes("فيزا") ||
    text.includes("مالي") ||
    text.includes("محفظة") ||
    text.includes("إنستاباي")
  ) {
    return CreditCard;
  }
  if (
    text.includes("أمان") ||
    text.includes("حماية") ||
    text.includes("ssl") ||
    text.includes("شهادة")
  ) {
    return ShieldCheck;
  }
  if (
    text.includes("كود") ||
    text.includes("برمج") ||
    text.includes("سورس") ||
    text.includes("تطوير")
  ) {
    return Code;
  }
  if (
    text.includes("صيانة") ||
    text.includes("دعم") ||
    text.includes("مساعدة") ||
    text.includes("استشارة")
  ) {
    return Wrench;
  }
  return Sparkles;
}

/**
 * Assign a context-aware badge for display on the card.
 */
function getAddonBadge(addon: Addon, index: number): string {
  if (addon.price === 0) return "مشمول مجاناً";
  const title = addon.title.toLowerCase();
  if (title.includes("رفع") || title.includes("تركيب") || title.includes("نشر")) {
    return "الأكثر طلباً";
  }
  if (title.includes("دومين") || title.includes("استضافة") || title.includes("نطاق")) {
    return "جاهز للعمل فوراً";
  }
  if (title.includes("دفع") || title.includes("بوابة")) {
    return "ربط فوري";
  }
  return index === 0 ? "خدمة مميزة" : "خدمة إضافية";
}

/**
 * Extract or generate clear feature bullets for the addon.
 */
function getAddonFeatures(addon: Addon): string[] {
  // If the description contains multiple lines or bullet points
  const lines = addon.description
    .split(/\r?\n/)
    .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
    .filter((l) => l.length > 0);

  if (lines.length >= 2) {
    return lines;
  }

  // Common keywords presets
  const text = (addon.title + " " + addon.description).toLowerCase();
  if (text.includes("رفع") || text.includes("تركيب") || text.includes("نشر") || text.includes("سحاب")) {
    return [
      "إعداد وتهيئة قاعدة بيانات Supabase",
      "ربط النشر التلقائي عبر Vercel",
      "تفعيل شهادة الأمان SSL المجانية مدى الحياة",
    ];
  }
  if (text.includes("دومين") || text.includes("استضافة") || text.includes("نطاق")) {
    return [
      "دومين عالمي رسمي لمدة عام كامل",
      "استضافة فائقة السرعة مع CDN عالمي",
      "دعم فني وتجديد تلقائي بدون انقطاع",
    ];
  }

  // Attempt to split by commas or sentence punctuation if descriptive
  const sentences = addon.description
    .split(/[.،!؟]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 8);

  if (sentences.length >= 2) {
    return sentences.slice(0, 3);
  }

  return [
    "تنفيذ احترافي وسريع وفق أعلى المعايير",
    "فحص وضمان تشغيل كامل بدون أخطاء",
    "دعم فني مباشر للإجابة عن استفساراتك",
  ];
}

export default function Addons({ addons = [] }: AddonsProps) {
  // Included free source code card
  const sourceCodeCard: AddonCardData = {
    id: "source-code",
    title: "الكود المصدري الكامل (Source Code)",
    price: 0,
    priceLabel: "مشمول مجاناً",
    description:
      "تحصل على الكود المصدري للمشروع كاملاً مبنياً بـ Next.js و TypeScript بدون تشفير أو قيود، مع حقوق استخدام وتعديل كاملة.",
    icon: Code,
    badge: "حرية كاملة",
    features: [
      "كود نظيف وموثق وفق أعلى المعايير",
      "حرية استضافة النظام على أي خادم",
      "إمكانية التعديل والتطوير المستقبلي",
    ],
  };

  // Fallback addons in case DB is unreachable
  const defaultAddons: AddonCardData[] = [
    sourceCodeCard,
    {
      id: "deployment",
      title: "خدمة النشر والربط السحابي الكامل",
      price: 1200,
      priceLabel: "+1,200 ج.م",
      description:
        "نقوم بربط وإعداد قاعدة بيانات Supabase، وإعداد حساب Vercel السحابي، وربط بريدك الإلكتروني لإشعارات الطلبات الفورية.",
      icon: Cloud,
      badge: "الأكثر طلباً",
      features: [
        "إعداد وتهيئة قاعدة بيانات Supabase",
        "ربط النشر التلقائي عبر Vercel",
        "تفعيل شهادة الأمان SSL المجانية مدى الحياة",
      ],
    },
    {
      id: "hosting-domain",
      title: "حجز النطاق والاستضافة السحابية السنوية",
      price: 1500,
      priceLabel: "+1,500 ج.م / سنوياً",
      description:
        "حجز دومين احترافي من اختيارك (.com أو .net) وإعداد الاستضافة السريعة وتكوين سجلات DNS والبريد المهني.",
      icon: Globe,
      badge: "جاهز للعمل فوراً",
      features: [
        "دومين عالمي رسمي لمدة عام كامل",
        "استضافة فائقة السرعة مع CDN عالمي",
        "دعم فني وتجديد تلقائي بدون انقطاع",
      ],
    },
  ];

  // Check if any dynamic addon is already representing the source code
  const hasSourceCodeAddon = addons.some(
    (a) =>
      a.title.includes("الكود المصدري") ||
      a.title.toLowerCase().includes("source code")
  );

  // Dynamically assemble cards: Keep the included source code card + all active addons from DB
  const displayCards: AddonCardData[] =
    addons && addons.length > 0
      ? [
          ...(hasSourceCodeAddon ? [] : [sourceCodeCard]),
          ...addons.map((addon, idx) => ({
            id: addon.id,
            title: addon.title,
            price: addon.price,
            priceLabel:
              addon.price === 0
                ? "مشمول مجاناً"
                : `+${Number(addon.price).toLocaleString("ar-EG")} ج.م`,
            description: addon.description,
            icon: getAddonIcon(addon.title, addon.description),
            badge: getAddonBadge(addon, idx),
            features: getAddonFeatures(addon),
          })),
        ]
      : defaultAddons;

  return (
    <section id="addons" className="py-20 border-t border-brand-border/40 relative">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[600px] rounded-full bg-brand-accent-1/10 blur-[150px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-4">
            <Layers className="h-3.5 w-3.5" />
            <span>خدمات وتجهيزات مخصصة</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            خدمات إضافية لتسليم مشروعك على المفتاح
          </h2>
          <p className="mt-4 text-sm text-brand-text-secondary sm:text-base leading-relaxed">
            يمكنك إضافة أي من هذه الخدمات عند طلب القالب لتجهيز كل شيء بدون أي تدخل تقني من طرفك
          </p>
        </div>

        {/* Addon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCards.map((addon) => {
            const Icon = addon.icon;
            const addonWhatsappUrl = getWhatsAppUrl(
              addon.price === 0
                ? `مرحباً، أود الاستفسار عن كود المشروع المصمم بـ Next.js مع قالب الويب.`
                : `مرحباً، أريد الاستفسار عن إضافة (${addon.title}) بسعر (${addon.priceLabel}) مع قالب الويب.`
            );

            return (
              <div
                key={addon.id}
                className="flex flex-col justify-between rounded-2xl border border-brand-border bg-brand-surface p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-brand-accent-1/50 hover:bg-slate-900/80"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-accent-1/30 bg-brand-accent-1/10 text-brand-accent-2">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-lg border border-brand-border bg-slate-950/60 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                      {addon.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{addon.title}</h3>
                  <div className="text-xl font-extrabold text-brand-accent-1 font-mono mb-4">
                    {addon.priceLabel}
                  </div>

                  <p className="text-xs text-brand-text-secondary leading-relaxed mb-6">
                    {addon.description}
                  </p>

                  <div className="border-t border-brand-border/60 pt-4 mb-6">
                    <ul className="space-y-2.5">
                      {addon.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="h-4 w-4 shrink-0 text-brand-accent-1 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href={addonWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-slate-950/60 py-3 text-xs font-semibold text-white transition-all duration-200 hover:border-brand-accent-1/50 hover:bg-slate-900 active:scale-95"
                >
                  <MessageCircle className="h-4 w-4 text-brand-accent-2" />
                  <span>طلب الخدمة مع النظام</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
