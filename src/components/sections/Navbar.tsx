"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Sparkles, Layers, MessageCircle } from "lucide-react";
import { getWhatsAppUrl, FACEBOOK_URL } from "@/lib/whatsapp";
import FacebookIcon from "@/components/icons/FacebookIcon";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappUrl = getWhatsAppUrl("مرحباً، أود الاستفسار عن أنظمة وقوالب منصة قالب (QALEB).");

  const navLinks = [
    { label: "الأنظمة والمتاجر", href: "/#products" },
    { label: "الإضافات والخدمات", href: "/#addons" },
    { label: "طلب نظام مخصص", href: "/custom-order" },
    { label: "الأسئلة الشائعة", href: "/#faq" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "border-b border-brand-border bg-brand-bg/85 backdrop-blur-xl shadow-lg shadow-black/20 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-accent-1/30 bg-brand-accent-1/10 shadow-inner transition-transform group-hover:scale-105 overflow-hidden p-1.5">
            <Image
              src="/icon.png"
              alt="QALEB"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>قالب</span>
              <span className="text-brand-accent-2 font-mono">QALEB</span>
            </span>
            <span className="text-[10px] text-brand-text-secondary font-medium tracking-wide">
              أنظمة ومتاجر ويب جاهزة
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-text-secondary transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 transition-all hover:bg-blue-500/20 hover:border-blue-500/50 hover:scale-105 active:scale-95"
            aria-label="صفحتنا على فيسبوك"
            title="صفحة فيسبوك الرسمية"
          >
            <FacebookIcon className="h-4 w-4" />
          </a>
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-1 to-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-brand-accent-1/25 transition-all duration-200 hover:brightness-110 active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>طلب نظام الآن</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border bg-brand-surface text-slate-300 transition-colors hover:text-white"
            aria-label="تبديل القائمة"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-brand-border bg-brand-surface/95 px-4 pt-4 pb-6 backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-brand-text-secondary hover:bg-slate-900 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 py-3 text-xs font-bold text-blue-400"
            >
              <FacebookIcon className="h-4 w-4" />
              <span>صفحتنا على فيسبوك</span>
            </a>
            <div className="pt-1">
              <Link
                href="/checkout"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-accent-1 to-emerald-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-brand-accent-1/20"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>طلب نظام الآن</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
