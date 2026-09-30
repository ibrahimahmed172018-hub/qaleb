"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Layers,
} from "lucide-react";
import ProductModal from "./ProductModal";
import {
  deleteProduct,
  toggleProductStatus,
  type Product,
} from "@/lib/actions/admin";
import { useRouter } from "next/navigation";

interface ProductsTableClientProps {
  initialProducts: Product[];
}

export default function ProductsTableClient({
  initialProducts,
}: ProductsTableClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Delete confirmation modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Active status toggle transitions
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Filter products by search query
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      (p.badge && p.badge.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleToggleActive = async (product: Product) => {
    const newStatus = !product.is_active;
    setTogglingId(product.id);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, is_active: newStatus } : item
      )
    );

    try {
      await toggleProductStatus(product.id, newStatus);
      router.refresh();
    } catch (err) {
      // Revert on error
      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, is_active: product.is_active } : item
        )
      );
      alert("فشل تحديث حالة القالب: " + (err instanceof Error ? err.message : "خطأ غير متوقع"));
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
      router.refresh();
    } catch (err) {
      alert("فشل حذف القالب: " + (err instanceof Error ? err.message : "خطأ غير متوقع"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            إدارة الأنظمة والمتاجر (القوالب)
          </h1>
          <p className="mt-1 text-sm text-brand-text-secondary">
            إضافة وتعديل وحذف وتفعيل قوالب المنصة وتحديد الأسعار والشارات الترويجية
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-1 to-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-brand-accent-1/20 transition-all duration-200 hover:brightness-110 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة قالب جديد</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-border bg-brand-surface p-4 backdrop-blur-xl">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث باسم القالب، الشارة، أو الوصف..."
            className="w-full rounded-xl border border-brand-border bg-slate-950/60 py-2 pl-4 pr-10 text-xs text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
          />
          <Search className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="text-xs text-brand-text-secondary">
          إجمالي القوالب: <span className="font-bold text-white">{filteredProducts.length}</span>
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-brand-border/80 bg-slate-950/40 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">اسم القالب / النظام</th>
                <th className="px-6 py-4">السعر الأصلي</th>
                <th className="px-6 py-4">سعر الخصم</th>
                <th className="px-6 py-4">الشارة (Badge)</th>
                <th className="px-6 py-4 text-center">الأكثر طلباً</th>
                <th className="px-6 py-4 text-center">حالة النشر</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 text-slate-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <Layers className="mx-auto h-8 w-8 text-slate-500 mb-2" />
                    <p className="text-sm">لم يتم العثور على أي قوالب مطابقة.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isPopular = Boolean(p.is_popular);
                  const isActive = Boolean(p.is_active);
                  const isRowToggling = togglingId === p.id;

                  return (
                    <tr
                      key={p.id}
                      className="transition-colors hover:bg-slate-900/60"
                    >
                      {/* Title & Live Demo */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-white text-sm">
                            {p.title}
                          </span>
                          {p.live_demo_url && (
                            <a
                              href={p.live_demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-brand-accent-1 hover:underline"
                            >
                              <span>معاينة العرض الحي</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Original Price */}
                      <td className="px-6 py-4 font-mono text-slate-400 line-through">
                        {p.original_price.toLocaleString("ar-EG")} ج.م
                      </td>

                      {/* Discounted Price */}
                      <td className="px-6 py-4 font-mono font-bold text-brand-accent-2 text-sm">
                        {p.discounted_price.toLocaleString("ar-EG")} ج.م
                      </td>

                      {/* Badge */}
                      <td className="px-6 py-4">
                        {p.badge ? (
                          <span className="inline-flex items-center rounded-lg border border-brand-accent-1/30 bg-brand-accent-1/10 px-2.5 py-1 text-[11px] font-medium text-brand-accent-2">
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>

                      {/* Popular Indicator */}
                      <td className="px-6 py-4 text-center">
                        {isPopular ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                            <Sparkles className="h-3 w-3" />
                            <span>نعم</span>
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>

                      {/* Active Toggle Switch */}
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(p)}
                          disabled={isRowToggling}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isActive ? "bg-brand-accent-1" : "bg-slate-700"
                          } ${isRowToggling ? "opacity-50 cursor-wait" : ""}`}
                          aria-label="تبديل حالة القالب"
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isActive ? "-translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="rounded-lg border border-brand-border bg-slate-900 p-2 text-slate-300 transition-colors hover:border-brand-accent-1 hover:text-brand-accent-2"
                            title="تعديل القالب"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setProductToDelete(p)}
                            className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-2 text-rose-400 transition-colors hover:border-rose-500/40 hover:bg-rose-900/40 hover:text-rose-200"
                            title="حذف القالب"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-brand-surface p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">تأكيد حذف القالب</h3>
            <p className="text-xs text-brand-text-secondary leading-relaxed mb-6">
              هل أنت متأكد من رغبتك في حذف قالب &quot;{productToDelete.title}&quot;؟ لا يمكن التراجع عن هذه الخطوة.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="rounded-xl border border-brand-border bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <span>نعم، حذف القالب</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
