"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  AlertTriangle,
  HelpCircle,
  Hash,
  ChevronDown,
} from "lucide-react";
import FaqModal from "./FaqModal";
import { deleteFaq, type FaqItem } from "@/lib/actions/faqs";
import { useRouter } from "next/navigation";

interface FaqsTableClientProps {
  initialFaqs: FaqItem[];
}

export default function FaqsTableClient({
  initialFaqs,
}: FaqsTableClientProps) {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);

  useEffect(() => {
    setFaqs(initialFaqs);
  }, [initialFaqs]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null);

  // Expanded row state for quick previewing answers
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Delete confirmation modal state
  const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [, startTransition] = useTransition();

  // Filter FAQs by search query
  const filteredFaqs = faqs.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setSelectedFaq(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: FaqItem) => {
    setSelectedFaq(faq);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleConfirmDelete = async () => {
    if (!faqToDelete) return;

    setIsDeleting(true);
    try {
      await deleteFaq(faqToDelete.id);
      setFaqs((prev) => prev.filter((f) => f.id !== faqToDelete.id));
      setFaqToDelete(null);
      router.refresh();
    } catch (err) {
      alert("فشل حذف السؤال: " + (err instanceof Error ? err.message : "خطأ غير متوقع"));
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
            إدارة الأسئلة الشائعة (FAQs)
          </h1>
          <p className="mt-1 text-sm text-brand-text-secondary">
            إضافة وتعديل وحذف وترتيب الأسئلة والإجابات المعروضة للزوار في الصفحة الرئيسية
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-1 to-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-brand-accent-1/20 transition-all duration-200 hover:brightness-110 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة سؤال جديد</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-border bg-brand-surface p-4 backdrop-blur-xl">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث في الأسئلة أو الإجابات..."
            className="w-full rounded-xl border border-brand-border bg-slate-950/60 py-2 pl-4 pr-10 text-xs text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
          />
          <Search className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="text-xs text-brand-text-secondary">
          إجمالي الأسئلة: <span className="font-bold text-white">{filteredFaqs.length}</span>
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-brand-border/80 bg-slate-950/40 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4 text-center w-24">الترتيب</th>
                <th className="px-6 py-4">نص السؤال</th>
                <th className="px-6 py-4">الإجابة المختصرة</th>
                <th className="px-6 py-4 text-center w-28">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 text-slate-200">
              {filteredFaqs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <HelpCircle className="mx-auto h-8 w-8 text-slate-500 mb-2" />
                    <p className="text-sm">لم يتم العثور على أي أسئلة شائعة مطابقة.</p>
                  </td>
                </tr>
              ) : (
                filteredFaqs.map((faq) => {
                  const isExpanded = expandedId === faq.id;

                  return (
                    <tr
                      key={faq.id}
                      className="transition-colors hover:bg-slate-900/60 group"
                    >
                      {/* Order */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-purple-500/30 bg-purple-500/10 font-mono font-bold text-purple-300 text-xs">
                          {faq.display_order ?? 0}
                        </span>
                      </td>

                      {/* Question */}
                      <td className="px-6 py-4 font-semibold text-white text-sm max-w-xs">
                        <div className="flex items-center gap-2">
                          <span>{faq.question}</span>
                        </div>
                      </td>

                      {/* Answer Preview */}
                      <td className="px-6 py-4 text-xs text-brand-text-secondary max-w-md">
                        <div
                          onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                          className="cursor-pointer hover:text-slate-200 transition-colors"
                          title="اضغط لعرض الإجابة كاملة"
                        >
                          <p className={isExpanded ? "whitespace-pre-wrap leading-relaxed" : "line-clamp-2 leading-relaxed"}>
                            {faq.answer}
                          </p>
                          <span className="inline-block mt-1 text-[10px] text-purple-400 underline font-medium">
                            {isExpanded ? "إخفاء التفاصيل" : "عرض الإجابة كاملة"}
                          </span>
                        </div>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(faq)}
                            className="rounded-lg border border-brand-border bg-slate-900 p-2 text-slate-300 transition-colors hover:border-brand-accent-1 hover:text-brand-accent-2"
                            title="تعديل السؤال"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setFaqToDelete(faq)}
                            className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-2 text-rose-400 transition-colors hover:border-rose-500/40 hover:bg-rose-900/40 hover:text-rose-200"
                            title="حذف السؤال"
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
      <FaqModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        faq={selectedFaq}
        onSaved={handleSaved}
        defaultOrder={faqs.length + 1}
      />

      {/* Delete Confirmation Modal */}
      {faqToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-brand-surface p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">تأكيد حذف السؤال</h3>
            <p className="text-xs text-brand-text-secondary leading-relaxed mb-6">
              هل أنت متأكد من رغبتك في حذف سؤال &quot;{faqToDelete.question}&quot;؟ سيتم إزالته من قسم الأسئلة الشائعة في الموقع.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setFaqToDelete(null)}
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
                  <span>نعم، حذف السؤال</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
