import ProductCard from "./ProductCard";
import type { Database } from "@/types/database.types";
import { Layers } from "lucide-react";

type Product = Database["public"]["Tables"]["qaleb_products"]["Row"];

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <section id="products" className="py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-accent-1/30 bg-brand-accent-1/10 px-3.5 py-1 text-xs font-semibold text-brand-accent-2 mb-4">
            <span>أنظمة مجربة ومجهزة بالكامل</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            الأنظمة والمتاجر المتاحة بخصم الإطلاق
          </h2>
          <p className="mt-4 text-sm text-brand-text-secondary sm:text-base leading-relaxed">
            أنظمة جاهزة للمعاينة الحية والتسليم المباشر، مصممة بأعلى معايير تجربة المستخدم والسرعة
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-brand-border bg-brand-surface p-12 text-center backdrop-blur-xl max-w-md mx-auto">
            <Layers className="mx-auto h-12 w-12 text-slate-500 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">لا توجد قوالب معروضة حالياً</h3>
            <p className="text-xs text-brand-text-secondary">
              يتم تجهيز باقات جديدة قريباً، يمكنك التواصل معنا مباشرة لطلب نظام مخصص.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
