"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { createFaq, updateFaq, type FaqItem, type FaqInput } from "@/lib/actions/faqs";

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq?: FaqItem | null;
  onSaved: () => void;
  defaultOrder?: number;
}

export default function FaqModal({
  isOpen,
  onClose,
  faq,
  onSaved,
  defaultOrder = 1,
}: FaqModalProps) {
  const isEdit = Boolean(faq);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number | "">(defaultOrder);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize or reset form state
  useEffect(() => {
    if (isOpen) {
      if (faq) {
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setDisplayOrder(faq.display_order ?? defaultOrder);
      } else {
        setQuestion("");
        setAnswer("");
        setDisplayOrder(defaultOrder);
      }
      setErrorMessage(null);
    }
  }, [isOpen, faq, defaultOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!question.trim()) {
      setErrorMessage("يرجى كتابة نص السؤال بشكل واضح.");
      return;
    }

    if (!answer.trim()) {
      setErrorMessage("يرجى كتابة إجابة السؤال الشائعة.");
      return;
    }

    if (displayOrder === "" || isNaN(Number(displayOrder))) {
      setErrorMessage("يرجى تحديد ترتيب ظهور السؤال.");
      return;
    }

    const payload: FaqInput = {
      question: question.trim(),
      answer: answer.trim(),
      display_order: Number(displayOrder),
    };

    setIsSubmitting(true);
    try {
      if (isEdit && faq) {
        await updateFaq(faq.id, payload);
      } else {
        await createFaq(payload);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء حفظ السؤال الشائع.";
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isEdit ? "تعديل السؤال الشائع" : "إضافة سؤال شائع جديد"}
                  </h2>
                  <p className="text-xs text-brand-text-secondary">
                    {isEdit
                      ? "تعديل صياغة السؤال أو الإجابة وترتيب الظهور"
                      : "أدخل السؤال وإجابته لإتاحتها في قسم الأسئلة الشائعة"}
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
              {/* Question */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                  نص السؤال *
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="مثال: كيف يتم تسليم النظام وهل الكود ملكي؟"
                  className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                  ترتيب الظهور (رقم تسلسلي، الأقل يظهر أولاً) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={displayOrder}
                  onChange={(e) =>
                    setDisplayOrder(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="مثال: 1"
                  className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                />
              </div>

              {/* Answer */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                  إجابة السؤال بالتفصيل *
                </label>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="أدخل الإجابة الواضحة والشاملة التي تريح بال العميل..."
                  className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                />
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
                      <span>{isEdit ? "حفظ التعديلات" : "إضافة السؤال"}</span>
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
