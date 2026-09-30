"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  Check,
  AlertCircle,
  Puzzle,
} from "lucide-react";
import { createAddon, updateAddon, type Addon, type AddonInput } from "@/lib/actions/addons";

interface AddonModalProps {
  isOpen: boolean;
  onClose: () => void;
  addon?: Addon | null;
  onSaved: () => void;
}

export default function AddonModal({
  isOpen,
  onClose,
  addon,
  onSaved,
}: AddonModalProps) {
  const isEdit = Boolean(addon);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset or fill form when modal opens or target addon changes
  useEffect(() => {
    if (isOpen) {
      if (addon) {
        setTitle(addon.title);
        setPrice(addon.price);
        setDescription(addon.description);
        setIsActive(addon.is_active !== null ? Boolean(addon.is_active) : true);
      } else {
        setTitle("");
        setPrice("");
        setDescription("");
        setIsActive(true);
      }
      setErrorMessage(null);
    }
  }, [isOpen, addon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("يرجى إدخال عنوان الخدمة الإضافية.");
      return;
    }

    if (price === "" || isNaN(Number(price))) {
      setErrorMessage("يرجى إدخال سعر الخدمة بشكل صحيح.");
      return;
    }

    if (!description.trim()) {
      setErrorMessage("يرجى إدخال وصف الخدمة وما تشمله للعميل.");
      return;
    }

    const payload: AddonInput = {
      title: title.trim(),
      price: Number(price),
      description: description.trim(),
      is_active: isActive,
    };

    setIsSubmitting(true);
    try {
      if (isEdit && addon) {
        await updateAddon(addon.id, payload);
      } else {
        await createAddon(payload);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الخدمة الإضافية.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative my-8 w-full max-w-lg rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-border/80 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
                  <Puzzle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isEdit ? "تعديل بيانات الخدمة" : "إضافة خدمة جديدة"}
                  </h2>
                  <p className="text-xs text-brand-text-secondary">
                    {isEdit
                      ? "قم بتحديث السعر والوصف للخدمة المحددة"
                      : "أدخل بيانات الخدمة الإضافية لإتاحتها لعملاء صفحة الدفع"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800/80 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                  عنوان الخدمة الإضافية *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: خدمة الرفع والتركيب الكامل"
                  className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                  سعر الخدمة (جنيه مصري) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="مثال: 1200"
                  className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                  وصف الخدمة وتفاصيلها *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="شرح موجز لما تتضمنه هذه الخدمة للعميل..."
                  className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                />
              </div>

              {/* Active Toggle Checkbox */}
              <div className="rounded-xl border border-brand-border bg-slate-950/40 p-4">
                <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-white">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-brand-accent-1 focus:ring-brand-accent-1"
                  />
                  <span>تفعيل الخدمة وإتاحتها للاختيار في صفحة الدفع (Active)</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-brand-border/80 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-xl border border-brand-border bg-slate-900/80 px-5 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-850 hover:text-white"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-1 to-emerald-500 px-6 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-brand-accent-1/20 transition-all duration-200 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{isEdit ? "حفظ التعديلات" : "إضافة الخدمة"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
