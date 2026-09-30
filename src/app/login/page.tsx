"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [isPending, startTransition] = useTransition();

  const supabase = createClient();

  // Check URL error params if returning from failed auth callback
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "auth_failed") {
      setErrorMessage("فشل التحقق من جلسة الدخول أو انتهت صلاحية الرابط، يرجى المحاولة مجدداً.");
    }
  }, [searchParams]);

  // Handle 60-second cooldown timer countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني للمسؤول.");
      return;
    }

    // Validate email against authorized admin emails
    const allowedAdmins = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "qalebsolutions@gmail.com,ibrahimahmed172018@gmail.com")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (allowedAdmins.length > 0 && !allowedAdmins.includes(cleanEmail)) {
      setErrorMessage("عذراً، هذا البريد الإلكتروني غير مصرح له بالدخول إلى لوحة التحكم.");
      return;
    }

    startTransition(async () => {
      try {
        const siteOrigin =
          typeof window !== "undefined" && window.location.origin
            ? window.location.origin
            : process.env.NEXT_PUBLIC_SITE_URL || "https://qaleb.site";
        const redirectUrl = `${siteOrigin}/auth/callback`;
        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) {
          setErrorMessage(error.message || "حدث خطأ أثناء إرسال رابط تسجيل الدخول.");
          return;
        }

        // Show required exact success message and start 60s cooldown timer
        setSuccessMessage("تم إرسال رابط تأكيد الدخول إلى بريدك الإلكتروني");
        setCooldown(60);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "فشل الاتصال بخادم المصادقة.";
        setErrorMessage(message);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-md"
    >
      {/* Subtle outer glow effect */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-accent-1/30 to-brand-accent-2/20 blur-xl opacity-40" />

      {/* Main glass card */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-border bg-brand-surface p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-accent-1/30 bg-brand-accent-1/10 text-brand-accent-2 shadow-inner">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text-primary">
            لوحة الإدارة | <span className="text-brand-accent-2">QALEB</span>
          </h1>
          <p className="mt-2 text-sm text-brand-text-secondary">
            تسجيل دخول آمن بدون كلمة مرور عبر البريد الإلكتروني المعتمد
          </p>
        </div>

        {/* Notifications and Alerts */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              key="error-alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3.5 text-sm text-rose-300 backdrop-blur-sm"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              key="success-alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 rounded-xl border border-brand-accent-1/40 bg-brand-accent-1/10 p-4 text-sm text-brand-accent-2 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2.5 font-semibold text-white">
                <CheckCircle2 className="h-5 w-5 text-brand-accent-2" />
                <span>{successMessage}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-brand-text-secondary">
                تحقق من صندوق الوارد أو الرسائل غير المرغوب فيها (Spam) واضغط على الرابط لتسجيل الدخول فوراً.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-text-secondary"
            >
              البريد الإلكتروني للمسؤول
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                dir="ltr"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-brand-border bg-slate-950/60 py-3 pl-4 pr-11 text-sm text-white placeholder-slate-500 transition-all duration-200 focus:border-brand-accent-1 focus:outline-none focus:ring-2 focus:ring-brand-accent-1/20"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || cooldown > 0}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-1 to-emerald-500 py-3.5 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-brand-accent-1/20 transition-all duration-200 hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري إرسال الرابط...</span>
              </>
            ) : cooldown > 0 ? (
              <>
                <Clock className="h-4 w-4" />
                <span>إعادة الإرسال بعد ({cooldown} ثانية)</span>
              </>
            ) : (
              <>
                <span>إرسال رابط تأكيد الدخول</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 border-t border-brand-border/60 pt-4 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-brand-text-secondary">
            <Sparkles className="h-3.5 w-3.5 text-brand-accent-1" />
            <span>نظام قالب للمتاجر الرقمية الذكية</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center p-4 bg-brand-bg overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-accent-1/10 blur-[128px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-accent-2/10 blur-[128px]" />

      <Suspense
        fallback={
          <div className="flex items-center gap-3 text-brand-text-secondary">
            <Loader2 className="h-6 w-6 animate-spin text-brand-accent-1" />
            <span>جاري تحميل صفحة الدخول...</span>
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </main>
  );
}
