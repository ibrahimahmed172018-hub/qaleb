"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Trash2,
  Loader2,
  Check,
  AlertCircle,
  Sparkles,
  Layers,
} from "lucide-react";
import { createProduct, updateProduct, type Product, type ProductInput } from "@/lib/actions/admin";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSaved: () => void;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  onSaved,
}: ProductModalProps) {
  const isEdit = Boolean(product);

  const [title, setTitle] = useState("");
  const [badge, setBadge] = useState("");
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [discountedPrice, setDiscountedPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize or reset form state when modal opens or product changes
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setTitle(product.title);
        setBadge(product.badge || "");
        setOriginalPrice(product.original_price);
        setDiscountedPrice(product.discounted_price);
        setDescription(product.description);
        setFeatures(
          product.features && product.features.length > 0
            ? product.features
            : [""]
        );
        setLiveDemoUrl(product.live_demo_url);
        setWhatsappMessage(product.whatsapp_message);
        setIsPopular(Boolean(product.is_popular));
        setIsActive(product.is_active !== null ? Boolean(product.is_active) : true);
      } else {
        setTitle("");
        setBadge("");
        setOriginalPrice("");
        setDiscountedPrice("");
        setDescription("");
        setFeatures([""]);
        setLiveDemoUrl("https://demo.example.com");
        setWhatsappMessage("أريد طلب هذا القالب بخصم الإطلاق");
        setIsPopular(false);
        setIsActive(true);
      }
      setErrorMessage(null);
    }
  }, [isOpen, product]);

  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleRemoveFeature = (index: number) => {
    if (features.length === 1) {
      setFeatures([""]);
      return;
    }
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("يرجى إدخال عنوان القالب.");
      return;
    }
    if (originalPrice === "" || discountedPrice === "") {
      setErrorMessage("يرجى إدخال السعر الأصلي وسعر الخصم.");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("يرجى إدخال وصف القالب.");
      return;
    }

    const payload: ProductInput = {
      title,
      badge,
      original_price: Number(originalPrice),
      discounted_price: Number(discountedPrice),
      description,
      features: features.filter((f) => f.trim().length > 0),
      live_demo_url: liveDemoUrl.trim(),
      whatsapp_message: whatsappMessage.trim(),
      is_popular: isPopular,
      is_active: isActive,
    };

    setIsSubmitting(true);
    try {
      if (isEdit && product) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء حفظ القالب.";
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
            className="relative my-8 w-full max-w-2xl rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-2xl backdrop-blur-2xl sm:p-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-border/80 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-accent-1/30 bg-brand-accent-1/10 text-brand-accent-2">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isEdit ? "تعديل بيانات القالب" : "إضافة قالب جديد"}
                  </h2>
                  <p className="text-xs text-brand-text-secondary">
                    {isEdit
                      ? "قم بتحديث بيانات القالب ومميزاته"
                      : "أدخل تفاصيل النظام أو المتجر الجاهز لإتاحته في المنصة"}
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
              {/* Title & Badge */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                    عنوان القالب / النظام *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: متجر ألعاب وبلايستيشن"
                    className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                    الشارة الترويجية (Badge)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="مثال: الأكثر طلباً للجيمرز"
                    className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                    السعر الأصلي (ج.م) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={originalPrice}
                    onChange={(e) =>
                      setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="مثال: 15000"
                    className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                    سعر الخصم / الإطلاق (ج.م) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={discountedPrice}
                    onChange={(e) =>
                      setDiscountedPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="مثال: 5000"
                    className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                  الوصف التفصيلي *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف مختصر عن طبيعة النظام والفوائد الموجهة للعميل..."
                  className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                />
              </div>

              {/* Dynamic Features List */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-semibold text-brand-text-secondary">
                    المميزات الأساسية (Features)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="inline-flex items-center gap-1 rounded-lg border border-brand-accent-1/30 bg-brand-accent-1/10 px-2.5 py-1 text-xs font-medium text-brand-accent-2 transition-all hover:bg-brand-accent-1/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>إضافة ميزة</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        placeholder={`ميزة رقم ${idx + 1}`}
                        className="flex-1 rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="rounded-lg border border-rose-500/20 p-2 text-rose-400 transition-colors hover:bg-rose-950/40 hover:text-rose-300"
                        title="حذف الميزة"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* URLs and Messaging */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                    رابط المعاينة الحية (Live Demo URL) *
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    required
                    value={liveDemoUrl}
                    onChange={(e) => setLiveDemoUrl(e.target.value)}
                    placeholder="https://demo.example.com"
                    className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                    رسالة الواتساب التلقائية *
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    placeholder="أريد طلب هذا القالب بخصم الإطلاق"
                    className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                  />
                </div>
              </div>

              {/* Checkboxes: is_popular & is_active */}
              <div className="flex flex-wrap items-center gap-6 rounded-xl border border-brand-border bg-slate-950/40 p-4">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-white">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-brand-accent-1 focus:ring-brand-accent-1"
                  />
                  <span>تمييز كـ الأكثر طلباً (Popular)</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-white">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-brand-accent-1 focus:ring-brand-accent-1"
                  />
                  <span>تفعيل القالب ونشره في المتجر (Active)</span>
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
                      <span>{isEdit ? "حفظ التعديلات" : "إضافة القالب"}</span>
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
