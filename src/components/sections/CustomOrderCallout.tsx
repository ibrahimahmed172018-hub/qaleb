import Link from "next/link";
import { Sparkles, ArrowLeft, Code2 } from "lucide-react";

export default function CustomOrderCallout() {
  return (
    <section className="py-12 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-brand-accent-1/40 bg-gradient-to-r from-slate-900/90 via-brand-surface to-slate-900/90 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-brand-accent-1/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-brand-accent-2/15 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-right">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-accent-1/30 bg-brand-accent-1/10 px-3.5 py-1 text-xs font-semibold text-brand-accent-2">
                <Code2 className="h-3.5 w-3.5" />
                <span>برمجة وتطوير حسب الطلب</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                ملقتش النظام اللي بتدور عليه؟
              </h3>
              <p className="text-sm text-brand-text-secondary sm:text-base leading-relaxed">
                بنبني أنظمة ومتاجر مخصصة بالكامل تناسب احتياجاتك وتتوافق مع طريقة إدارتك لعملك، مع دعم فني متواصل وكود مصدري ملكك بالكامل.
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <Link
                href="/custom-order"
                className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-accent-1 to-emerald-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-brand-accent-1/25 transition-all duration-200 hover:brightness-110 active:scale-95 sm:w-auto"
              >
                <span>اطلب نظامك الخاص الآن</span>
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
