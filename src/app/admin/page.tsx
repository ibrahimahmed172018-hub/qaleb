import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Layers,
  HelpCircle,
  Puzzle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Plus,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: productsCount }, { count: addonsCount }, { count: faqsCount }] =
    await Promise.all([
      supabase.from("qaleb_products").select("*", { count: "exact", head: true }),
      supabase.from("addons").select("*", { count: "exact", head: true }),
      supabase.from("faqs").select("*", { count: "exact", head: true }),
    ]);

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            لوحة الإحصائيات العامة
          </h1>
          <p className="mt-1 text-sm text-brand-text-secondary">
            متابعة الأنظمة والقوالب المعروضة والإضافات في منصة قالب
          </p>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-1 to-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-brand-accent-1/20 transition-all duration-200 hover:brightness-110 active:scale-95"
        >
          <Layers className="h-4 w-4" />
          <span>إدارة القوالب والأنظمة</span>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/products"
          className="group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-brand-accent-1/50 hover:bg-slate-900/80"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-brand-text-secondary">
              أنظمة ومتاجر قالب
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-accent-1/30 bg-brand-accent-1/10 text-brand-accent-2 transition-transform group-hover:scale-110">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{productsCount ?? 0}</div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-brand-accent-1 flex items-center gap-1 font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              جاهزة للعرض في المتجر
            </span>
            <span className="text-slate-400 group-hover:text-brand-accent-2 flex items-center gap-1">
              عرض التفاصيل
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            </span>
          </div>
        </Link>

        <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-brand-text-secondary">
              الإضافات والخدمات (Addons)
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <Puzzle className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{addonsCount ?? 0}</div>
          <p className="mt-3 text-xs text-brand-text-secondary">
            إضافات مساعدة لرفع قيمة السلة الشرائية
          </p>
        </div>

        <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-brand-text-secondary">
              الأسئلة الشائعة (FAQs)
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
              <HelpCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{faqsCount ?? 0}</div>
          <p className="mt-3 text-xs text-brand-text-secondary">
            إجابات الاستفسارات المتكررة لعملاء المنصة
          </p>
        </div>
      </div>
    </div>
  );
}
