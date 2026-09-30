"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppFloat() {
  const whatsappUrl = getWhatsAppUrl("مرحباً، أود الاستفسار بخصوص قوالب وأنظمة منصة قالب (QALEB).");

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      {/* Pulse ring animation */}
      <span className="absolute -inset-1 rounded-full bg-brand-accent-1 opacity-75 blur-sm animate-ping pointer-events-none" />

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-brand-accent-1 to-emerald-400 text-slate-950 shadow-2xl shadow-brand-accent-1/40 transition-all duration-300 hover:scale-110 active:scale-95 hover:brightness-110"
        aria-label="تواصل عبر واتساب"
        title="تواصل معنا عبر واتساب"
      >
        <MessageCircle className="h-7 w-7 fill-slate-950" />

        {/* Hover Tooltip */}
        <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-xl border border-brand-border bg-slate-950/95 px-3 py-1.5 text-xs font-semibold text-white shadow-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-md">
          تواصل معنا مباشرة عبر واتساب
        </span>
      </a>
    </div>
  );
}
