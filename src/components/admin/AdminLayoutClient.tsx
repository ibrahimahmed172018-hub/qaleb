"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Menu, X, Globe, Sparkles } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutClientProps {
  userEmail?: string;
  children: React.ReactNode;
}

export default function AdminLayoutClient({
  userEmail,
  children,
}: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-bg text-brand-text-primary antialiased">
      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
        <AdminSidebar userEmail={userEmail} />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <AdminSidebar
          userEmail={userEmail}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Area */}
      <div className="flex flex-1 flex-col lg:pr-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-brand-border bg-brand-bg/80 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border bg-brand-surface text-slate-300 transition-colors hover:text-white lg:hidden"
              aria-label="القائمة الجانبية"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-brand-text-secondary">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-accent-1 animate-pulse" />
              <span>نظام إدارة منصة قالب الرقمية</span>
            </div>
          </div>

          {/* Top Bar Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-accent-1/30 bg-brand-accent-1/10 px-3.5 py-1.5 text-xs font-semibold text-brand-accent-2 transition-all duration-200 hover:border-brand-accent-1 hover:bg-brand-accent-1/20 active:scale-95"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>معاينة الموقع الحي</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
