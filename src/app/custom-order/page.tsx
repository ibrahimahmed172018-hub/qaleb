"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  User,
  Phone,
  Mail,
  Layers,
  DollarSign,
  Calendar,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsAppFloat from "@/components/sections/WhatsAppFloat";
import { submitCustomOrder } from "@/lib/actions/customOrder";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const PROJECT_TYPES = [
  { id: "ecommerce", title: "متجر إلكتروني متكامل", desc: "بيع منتجات، رفع إيصالات، دفع إلكتروني" },
  { id: "saas", title: "نظام إداري وسحابي (SaaS)", desc: "إدارة سناتر، شركات، مواعيد، عملاء" },
  { id: "corporate", title: "موقع تعريفي وبورتفوليو", desc: "عرض خدمات، شركات B2B، طلب عروض أسعار" },
  { id: "custom", title: "فكرة برمجية خاصة ومبتكرة", desc: "تطبيق ويب بمواصفات وشاشات مخصصة" },
];

const BUDGET_RANGES = [
  "5,000 - 10,000 ج.م",
  "10,000 - 20,000 ج.م",
  "20,000 - 40,000 ج.م",
  "أكثر من 40,000 ج.م",
];

const TIMELINE_OPTIONS = [
  "عاجل (خلال أسبوع إلى 10 أيام)",
  "خلال أسبوعين إلى 3 أسابيع",
  "خلال شهر كامل",
  "مرن / حسب متطلبات النظام",
];

export default function CustomOrderPage() {
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0].title);
  const [budget, setBudget] = useState(BUDGET_RANGES[1]);
  const [preferredTimeline, setPreferredTimeline] = useState(TIMELINE_OPTIONS[1]);
  const [details, setDetails] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clientName.trim()) {
      setErrorMessage("يرجى كتابة الاسم بالكامل أو اسم النشاط التجاري.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("يرجى إدخال رقم الهاتف أو الواتساب للتواصل.");
      return;
    }
    if (!details.trim()) {
      setErrorMessage("يرجى كتابة شرح مختصر عن فكرة النظام والمميزات المطلوبة.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitCustomOrder({
        clientName,
        phone,
        email,
        projectType,
        budget,
        details,
        preferredTimeline,
      });

      if (!res.success) {
        setErrorMessage(res.error || "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.");
        return;
      }

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل إرسال الطلب عبر الخادم.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const directWhatsappUrl = getWhatsAppUrl(
    `مرحباً، أرسلت طلباً لتطوير نظام مخصص باسم (${clientName || "عميل جديد"}) وأرغب في المتابعة معكم فوراً.`
  );

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text-primary selection:bg-brand-accent-1/25 selection:text-brand-accent-2">
      {/* Background ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-[550px] w-[550px] rounded-full bg-brand-accent-1/5 blur-[160px]" />
        <div className="absolute top-1/2 left-1/4 h-[650px] w-[650px] rounded-full bg-brand-accent-2/5 blur-[180px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-accent-1/30 bg-brand-accent-1/10 px-4 py-1.5 text-xs font-bold text-brand-accent-2 shadow-inner">
                <Sparkles className="h-3.5 w-3.5" />
                <span>خدمة التطوير المخصص</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
                عندك فكرة مشروع خاصة أو محتاج تعديلات شاملة؟
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-brand-text-secondary sm:text-base leading-relaxed">
                املأ بيانات مشروعك وسنتواصل معك خلال ساعات عبر واتساب لمناقشة التفاصيل وتقديم عرض سعر دقيق وخطة تنفيذ واضحة.
              </p>
            </div>

            {/* Content: Form OR Success View */}
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl border border-brand-accent-1/50 bg-brand-surface p-8 sm:p-12 text-center shadow-2xl backdrop-blur-2xl"
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-brand-accent-1/40 bg-brand-accent-1/10 text-brand-accent-2 shadow-lg shadow-brand-accent-1/20 animate-bounce">
                    <CheckCircle2 className="h-10 w-10 text-brand-accent-2" />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                    تم استلام طلبك بنجاح!
                  </h2>
                  <p className="mx-auto max-w-lg text-sm sm:text-base text-brand-text-secondary leading-relaxed mb-8">
                    شكراً لثقتك بنا يا <span className="text-white font-bold">{clientName}</span>. تم توجيه تفاصيل مشروعك إلى فريق التطوير وسنتواصل معك عبر الواتساب في أقرب وقت.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href={directWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-1 to-emerald-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-brand-accent-1/25 hover:brightness-110 active:scale-95 transition-all"
                    >
                      <MessageCircle className="h-4 w-4 fill-slate-950" />
                      <span>مستعجل؟ تحدث معنا مباشرة عبر واتساب</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSuccess(false);
                        setDetails("");
                      }}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-brand-border bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white transition-all"
                    >
                      <span>إرسال طلب مشروع آخر</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="rounded-3xl border border-brand-border bg-brand-surface p-6 sm:p-10 shadow-2xl backdrop-blur-2xl"
                >
                  {errorMessage && (
                    <div className="mb-8 flex items-center gap-3 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-300">
                      <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Step A: Client Info */}
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-brand-border/60 pb-3">
                        <User className="h-5 w-5 text-brand-accent-2" />
                        <span>1. بيانات التواصل الأساسية</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                            الاسم بالكامل / اسم النشاط التجاري *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder="مثال: م. أحمد سامي (شركة الأفق للحلول)"
                              className="w-full rounded-xl border border-brand-border bg-slate-950/60 py-3 pl-4 pr-11 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                              <User className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                            رقم الهاتف / الواتساب للتواصل *
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              dir="ltr"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="01XXXXXXXXX"
                              className="w-full rounded-xl border border-brand-border bg-slate-950/60 py-3 pl-4 pr-11 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                              <Phone className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                          البريد الإلكتروني (اختياري)
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            dir="ltr"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full rounded-xl border border-brand-border bg-slate-950/60 py-3 pl-4 pr-11 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                            <Mail className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step B: Project Specifications */}
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-brand-border/60 pb-3">
                        <Layers className="h-5 w-5 text-brand-accent-2" />
                        <span>2. نوع ومواصفات المشروع المطلوب</span>
                      </h3>

                      {/* Project Type Cards */}
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-brand-text-secondary">
                          اختر تصنيف المشروع الأساسي *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {PROJECT_TYPES.map((type) => {
                            const isSelected = projectType === type.title;
                            return (
                              <div
                                key={type.id}
                                onClick={() => setProjectType(type.title)}
                                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                                  isSelected
                                    ? "border-brand-accent-1 bg-slate-900/90 shadow-md ring-1 ring-brand-accent-1/50"
                                    : "border-brand-border bg-slate-950/40 hover:bg-slate-900/50"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                      isSelected
                                        ? "border-brand-accent-1 bg-brand-accent-1"
                                        : "border-slate-600 bg-slate-900"
                                    }`}
                                  >
                                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-white">{type.title}</h4>
                                    <p className="text-[11px] text-brand-text-secondary">{type.desc}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Budget and Timeline */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                            الميزانية المقترحة للمشروع
                          </label>
                          <select
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="w-full rounded-xl border border-brand-border bg-slate-950/80 px-3.5 py-3 text-sm text-white focus:border-brand-accent-1 focus:outline-none"
                          >
                            {BUDGET_RANGES.map((b) => (
                              <option key={b} value={b} className="bg-slate-900 text-white">
                                {b}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                            موعد التسليم المتوقع
                          </label>
                          <select
                            value={preferredTimeline}
                            onChange={(e) => setPreferredTimeline(e.target.value)}
                            className="w-full rounded-xl border border-brand-border bg-slate-950/80 px-3.5 py-3 text-sm text-white focus:border-brand-accent-1 focus:outline-none"
                          >
                            {TIMELINE_OPTIONS.map((t) => (
                              <option key={t} value={t} className="bg-slate-900 text-white">
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Project Details Textarea */}
                      <div className="pt-2">
                        <label className="mb-1.5 block text-xs font-semibold text-brand-text-secondary">
                          شرح فكرة النظام والمميزات المطلوبة بالتفصيل *
                        </label>
                        <textarea
                          rows={5}
                          required
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                          placeholder="اشرح طبيعة العمل، الجمهور المستهدف، بوابات الدفع أو المميزات الخاصة المطلوبة..."
                          className="w-full rounded-2xl border border-brand-border bg-slate-950/60 p-4 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1 leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="border-t border-brand-border/60 pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-accent-1 to-emerald-500 py-4 px-6 text-sm font-bold text-slate-950 shadow-xl shadow-brand-accent-1/25 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>جاري إرسال الطلب والتواصل...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>إرسال طلب المشروع لمناقشته عبر واتساب</span>
                          </>
                        )}
                      </button>

                      <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-brand-text-secondary">
                        <ShieldCheck className="h-4 w-4 text-brand-accent-1 shrink-0" />
                        <span>بيانات مشروعك سرية بالكامل ولن تُشارك مع أي طرف خارجي</span>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <Footer />
        <WhatsAppFloat />
      </div>
    </div>
  );
}
