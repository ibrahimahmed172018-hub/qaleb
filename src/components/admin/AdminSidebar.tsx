"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Puzzle,
  HelpCircle,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminSidebarProps {
  userEmail?: string;
  onCloseMobile?: () => void;
}

const navItems = [
  { label: "نظرة عامة", href: "/admin", icon: LayoutDashboard },
  { label: "إدارة القوالب", href: "/admin/products", icon: Layers },
  { label: "الإضافات", href: "/admin/addons", icon: Puzzle },
  { label: "الأسئلة الشائعة", href: "/admin/faqs", icon: HelpCircle },
];

export default function AdminSidebar({ userEmail, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="flex h-full w-full flex-col justify-between border-l border-brand-border bg-brand-bg/95 p-6 backdrop-blur-xl">
      <div>
        {/* Brand Logo & Title */}
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-accent-1/30 bg-brand-accent-1/10 text-brand-accent-2 shadow-inner">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-white">
              <span>قالب</span>
              <span className="text-brand-accent-2">QALEB</span>
            </div>
            <p className="text-[11px] text-brand-text-secondary">لوحة التحكم الإدارية</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "border border-brand-accent-1/30 bg-brand-accent-1/10 text-brand-accent-2 shadow-sm"
                    : "text-brand-text-secondary hover:border-brand-border/60 hover:bg-brand-surface hover:text-white"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                    isActive ? "text-brand-accent-2" : "text-slate-400 group-hover:text-white"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer User Info & Sign Out */}
      <div className="border-t border-brand-border/80 pt-5">
        {userEmail && (
          <div className="mb-3 px-2">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400">
              المسؤول الحالي
            </span>
            <span className="block truncate text-xs font-medium text-white" title={userEmail}>
              {userEmail}
            </span>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-950/20 px-4 py-2.5 text-xs font-semibold text-rose-300 transition-all duration-200 hover:border-rose-500/40 hover:bg-rose-900/30 active:scale-[0.99]"
        >
          <LogOut className="h-4 w-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
