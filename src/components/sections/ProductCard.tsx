import Link from "next/link";
import { Check, ExternalLink, ShoppingCart, Sparkles } from "lucide-react";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["qaleb_products"]["Row"];

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isPopular = Boolean(product.is_popular);
  const discountPercent =
    product.original_price > product.discounted_price
      ? Math.round(
          ((product.original_price - product.discounted_price) /
            product.original_price) *
            100
        )
      : null;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border transition-all duration-300 backdrop-blur-xl p-6 sm:p-8 ${
        isPopular
          ? "border-brand-accent-1/60 bg-slate-900/90 shadow-2xl shadow-brand-accent-1/10 ring-1 ring-brand-accent-1/40"
          : "border-brand-border bg-brand-surface hover:border-brand-accent-1/40 hover:bg-slate-900/70 shadow-xl"
      }`}
    >
      {/* Popular Badge Top Tag */}
      {isPopular && (
        <div className="absolute -top-3.5 right-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-accent-1 to-emerald-500 px-3.5 py-1 text-[11px] font-extrabold text-slate-950 shadow-md shadow-brand-accent-1/30">
          <Sparkles className="h-3.5 w-3.5 fill-slate-950" />
          <span>الأكثر طلباً واكتمالاً</span>
        </div>
      )}

      <div>
        {/* Top Meta: Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {product.badge ? (
            <span className="inline-flex items-center rounded-lg border border-brand-accent-1/30 bg-brand-accent-1/10 px-2.5 py-1 text-xs font-semibold text-brand-accent-2">
              {product.badge}
            </span>
          ) : (
            <span className="text-xs text-brand-text-secondary">نظام ويب جاهز</span>
          )}

          {discountPercent && (
            <span className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[11px] font-bold text-rose-400">
              وفر {discountPercent}%
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight text-white mb-3">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-brand-text-secondary leading-relaxed mb-6">
          {product.description}
        </p>

        {/* Features Checklist */}
        <div className="border-t border-brand-border/60 pt-5 mb-6">
          <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-300">
            أبرز إمكانيات ومميزات النظام:
          </span>
          <ul className="space-y-2.5">
            {product.features?.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-accent-1/15 text-brand-accent-1">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span className="leading-snug">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pricing and Actions Container */}
      <div className="border-t border-brand-border/80 pt-6 mt-2">
        {/* Price Display */}
        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <span className="block text-[11px] text-brand-text-secondary">سعر العرض الشامل</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-brand-accent-1 font-mono">
                {product.discounted_price.toLocaleString("ar-EG")}
              </span>
              <span className="text-xs font-semibold text-white">ج.م فقط</span>
            </div>
          </div>

          <div className="text-left">
            <span className="block text-[10px] text-slate-400">بدلاً من</span>
            <span className="font-mono text-sm font-semibold text-slate-400 line-through">
              {product.original_price.toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {product.live_demo_url && (
            <a
              href={product.live_demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-border bg-slate-950/60 px-4 py-3 text-xs font-semibold text-white transition-all duration-200 hover:border-brand-accent-1/60 hover:bg-slate-900 active:scale-95"
            >
              <span>معاينة حية</span>
              <ExternalLink className="h-3.5 w-3.5 text-brand-accent-2" />
            </a>
          )}

          <Link
            href={`/checkout?product=${product.id}`}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-slate-950 shadow-lg transition-all duration-200 hover:brightness-110 active:scale-95 ${
              product.live_demo_url ? "" : "sm:col-span-2"
            } bg-gradient-to-r from-brand-accent-1 to-emerald-500 shadow-brand-accent-1/20`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>طلب النظام الآن</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
