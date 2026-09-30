import { MessageCircle, ArrowLeft, Zap, Shield, CheckCircle2 } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function Hero() {
  const consultWhatsappUrl = getWhatsAppUrl(
    "مرحباً، أريد الاستفسار عن تفاصيل خصم الإطلاق لقوالب منصة قالب واختيار النظام المناسب لمشروعي."
  );

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background radial glow effects */}
      <div className="pointer-events-none absolute -top-40 right-1/2 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-brand-accent-1/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-brand-accent-2/10 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Launch Discount Banner */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-accent-1/30 bg-brand-accent-1/10 px-4 py-1.5 text-xs font-bold text-brand-accent-2 shadow-inner backdrop-blur-md mb-8">
          <span className="animate-pulse text-sm">🔥</span>
          <span>خصم الإطلاق 66%</span>
          <span className="text-slate-400">|</span>
          <span className="font-normal text-slate-300">لفترة محدودة على أول 10 طلبات</span>
        </div>

        {/* Main Headline */}
        <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.2] sm:leading-[1.15]">
          امتلك متجرك أو نظامك السحابي{" "}
          <span className="bg-gradient-to-r from-brand-accent-1 via-brand-accent-2 to-emerald-400 bg-clip-text text-transparent">
            خلال 48 ساعة فقط
          </span>{" "}
          وبدون اشتراكات شهرية
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-6 max-w-2xl text-base text-brand-text-secondary sm:text-lg leading-relaxed">
          أنظمة ومتاجر ويب جاهزة ومبنية بأحدث تقنيات Next.js و Supabase. دعم كامل لإنستاباي والمحافظ الإلكترونية، لوحة تحكم عربية خفيفة وسريعة، وكود مصدري ملكك بالكامل.
        </p>

        {/* Dual CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#products"
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-1 to-emerald-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-brand-accent-1/25 transition-all duration-200 hover:brightness-110 active:scale-95 sm:w-auto"
          >
            <span>استكشف القوالب المتاحة</span>
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </a>

          <a
            href={consultWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-brand-border bg-brand-surface px-8 py-4 text-sm font-bold text-white shadow-lg backdrop-blur-xl transition-all duration-200 hover:border-brand-accent-1/50 hover:bg-slate-900/90 active:scale-95 sm:w-auto"
          >
            <MessageCircle className="h-4 w-4 text-brand-accent-2" />
            <span>استشارة سريعة مع المطور</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-14 pt-10 border-t border-brand-border/50 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-xs text-brand-text-secondary">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-accent-1" />
            <span className="text-slate-300 font-medium">تسليم وتجهيز خلال 48 ساعة</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-4 w-4 text-brand-accent-1" />
            <span className="text-slate-300 font-medium">ضمان فني ودعم ما بعد التسليم</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4 text-brand-accent-1" />
            <span className="text-slate-300 font-medium">دفعة واحدة بدون رسوم شهرية</span>
          </div>
        </div>
      </div>
    </section>
  );
}
