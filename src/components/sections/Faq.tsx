"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { Database } from "@/types/database.types";

type FaqItem = Database["public"]["Tables"]["faqs"]["Row"];

interface FaqProps {
  faqs?: FaqItem[];
}

export default function Faq({ faqs = [] }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaqs = [
    {
      id: "faq-1",
      question: "كيف يتم تسليم النظام وهل الكود ملكي بالكامل؟",
      answer:
        "نعم، تحصل على الكود المصدري كاملاً مبنياً بـ Next.js و TypeScript مع قاعدة بيانات Supabase كاملة الصلاحيات. لا توجد أي أجزاء مشفرة أو قيود على استخدامه.",
    },
    {
      id: "faq-2",
      question: "هل توجد أي اشتراكات شهرية أو سنوية إجبارية؟",
      answer:
        "إطلاقاً! تدفع ثمن القالب لمرة واحدة فقط (One-time payment). تكاليف الاستضافة وقاعدة بيانات Supabase مجانية تماماً في الباقات المبتدئة والمتوسطة، ولن تدفع إلا عند وصولك لآلاف الزوار يومياً.",
    },
    {
      id: "faq-3",
      question: "كيف يعمل نظام الدفع في المتاجر (إنستاباي والمحافظ)؟",
      answer:
        "المتاجر مزودة بنظام سلس لاستقبال المدفوعات عبر إنستاباي أو المحافظ الإلكترونية، حيث يرفع العميل إيصال التحويل، وتصلك تفاصيل الطلب مع الإيصال فوراً على لوحة التحكم والواتساب لتأكيد الطلب بنقرة واحدة.",
    },
    {
      id: "faq-4",
      question: "كم يستغرق تجهيز المتجر وتسليمه؟",
      answer:
        "يتم تسليم المتجر أو النظام جاهزاً للعمل خلال 24 إلى 48 ساعة كحد أقصى من إرسال بيانات متجرك وأرقام التحويل.",
    },
    {
      id: "faq-5",
      question: "هل يمكنني طلب تعديل ألوان أو شعار أو إضافة مميزات جديدة؟",
      answer:
        "نعم بالتأكيد. يمكنك تعديل الألوان والشعار والبيانات بسهولة عبر لوحة التحكم، كما يمكنك طلب تخصيصات برمجية إضافية عبر التنسيق معنا على واتساب مباشرة.",
    },
  ];

  const itemsToDisplay =
    faqs.length > 0
      ? faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))
      : defaultFaqs;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 border-t border-brand-border/40 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-400 mb-4">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>كل ما تحتاج معرفته</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            الأسئلة الشائعة والأكثر تكراراً
          </h2>
          <p className="mt-4 text-sm text-brand-text-secondary sm:text-base leading-relaxed">
            إجابات واضحة وشفافة حول التسليم، الدفع، والدعم الفني
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {itemsToDisplay.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 backdrop-blur-xl ${
                  isOpen
                    ? "border-brand-accent-1/50 bg-slate-900/80 shadow-lg shadow-brand-accent-1/5"
                    : "border-brand-border bg-brand-surface hover:border-brand-border/80 hover:bg-slate-900/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-right transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      isOpen
                        ? "bg-brand-accent-1 text-slate-950 rotate-180"
                        : "bg-slate-950/60 text-slate-400 border border-brand-border"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-brand-border/40 px-5 pt-3 pb-5 text-xs sm:text-sm text-brand-text-secondary leading-relaxed animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
