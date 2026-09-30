"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  AlertTriangle,
  Puzzle,
  DollarSign,
  Sparkles,
} from "lucide-react";
import AddonModal from "./AddonModal";
import {
  deleteAddon,
  toggleAddonStatus,
  type Addon,
} from "@/lib/actions/addons";
import { useRouter } from "next/navigation";

interface AddonsTableClientProps {
  initialAddons: Addon[];
}

export default function AddonsTableClient({
  initialAddons,
}: AddonsTableClientProps) {
  const router = useRouter();
  const [addons, setAddons] = useState<Addon[]>(initialAddons);

  useEffect(() => {
    setAddons(initialAddons);
  }, [initialAddons]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);

  // Delete confirmation modal state
  const [addonToDelete, setAddonToDelete] = useState<Addon | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Active status toggle transitions
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Filter addons by search query
  const filteredAddons = addons.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setSelectedAddon(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addon: Addon) => {
    setSelectedAddon(addon);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleToggleActive = async (addon: Addon) => {
    const newStatus = !addon.is_active;
    setTogglingId(addon.id);

    // Optimistic UI update
    setAddons((prev) =>
      prev.map((item) =>
        item.id === addon.id ? { ...item, is_active: newStatus } : item
      )
    );

    try {
      await toggleAddonStatus(addon.id, newStatus);
      router.refresh();
    } catch (err) {
      // Revert on error
      setAddons((prev) =>
        prev.map((item) =>
          item.id === addon.id ? { ...item, is_active: addon.is_active } : item
        )
      );
      alert("فشل تحديث حالة الخدمة: " + (err instanceof Error ? err.message : "خطأ غير متوقع"));
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!addonToDelete) return;

    setIsDeleting(true);
    try {
      await deleteAddon(addonToDelete.id);
      setAddons((prev) => prev.filter((a) => a.id !== addonToDelete.id));
      setAddonToDelete(null);
      router.refresh();
    } catch (err) {
      alert("فشل حذف الخدمة: " + (err instanceof Error ? err.message : "خطأ غير متوقع"));
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
            إدارة الخدمات والإضافات (Add-ons)
          </h1>
          <p className="mt-1 text-sm text-brand-text-secondary">
            إضافة وتعديل وحذف الخدمات الاختيارية المتاحة للعملاء عند حجز وتأكيد القوالب
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-1 to-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-brand-accent-1/20 transition-all duration-200 hover:brightness-110 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة خدمة جديدة</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-border bg-brand-surface p-4 backdrop-blur-xl">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث باسم الخدمة أو الوصف..."
            className="w-full rounded-xl border border-brand-border bg-slate-950/60 py-2 pl-4 pr-10 text-xs text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
          />
          <Search className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="text-xs text-brand-text-secondary">
          إجمالي الخدمات: <span className="font-bold text-white">{filteredAddons.length}</span>
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-brand-border/80 bg-slate-950/40 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">عنوان الخدمة</th>
                <th className="px-6 py-4">السعر</th>
                <th className="px-6 py-4">الوصف والتفاصيل</th>
                <th className="px-6 py-4 text-center">حالة النشر</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 text-slate-200">
              {filteredAddons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Puzzle className="mx-auto h-8 w-8 text-slate-500 mb-2" />
                    <p className="text-sm">لم يتم العثور على أي خدمات إضافية مطابقة.</p>
                  </td>
                </tr>
              ) : (
                filteredAddons.map((addon) => {
                  const isActive = Boolean(addon.is_active);
                  const isRowToggling = togglingId === addon.id;

                  return (
                    <tr
                      key={addon.id}
                      className="transition-colors hover:bg-slate-900/60"
                    >
                      {/* Title */}
                      <td className="px-6 py-4 font-semibold text-white text-sm">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Puzzle className="h-4 w-4" />
                          </div>
                          <span>{addon.title}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-mono font-bold text-brand-accent-1 text-sm whitespace-nowrap">
                        +{Number(addon.price).toLocaleString("ar-EG")} ج.م
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4 text-xs text-brand-text-secondary max-w-md leading-relaxed">
                        {addon.description}
                      </td>

                      {/* Active Toggle Switch */}
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(addon)}
                          disabled={isRowToggling}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isActive ? "bg-brand-accent-1" : "bg-slate-700"
                          } ${isRowToggling ? "opacity-50 cursor-wait" : ""}`}
                          aria-label="تبديل حالة الخدمة"
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
                            onClick={() => handleOpenEdit(addon)}
                            className="rounded-lg border border-brand-border bg-slate-900 p-2 text-slate-300 transition-colors hover:border-brand-accent-1 hover:text-brand-accent-2"
                            title="تعديل الخدمة"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setAddonToDelete(addon)}
                            className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-2 text-rose-400 transition-colors hover:border-rose-500/40 hover:bg-rose-900/40 hover:text-rose-200"
                            title="حذف الخدمة"
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
      <AddonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addon={selectedAddon}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      {addonToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-brand-surface p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">تأكيد حذف الخدمة</h3>
            <p className="text-xs text-brand-text-secondary leading-relaxed mb-6">
              هل أنت متأكد من رغبتك في حذف خدمة &quot;{addonToDelete.title}&quot;؟ لن تظهر مجدداً في صفحة الدفع.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAddonToDelete(null)}
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
                  <span>نعم، حذف الخدمة</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
