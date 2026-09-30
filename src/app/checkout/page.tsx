"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  User,
  Phone,
  Sparkles,
  HelpCircle,
  Plus,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsAppFloat from "@/components/sections/WhatsAppFloat";
import { createClient } from "@/lib/supabase/client";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["qaleb_products"]["Row"];
type Addon = Database["public"]["Tables"]["addons"]["Row"];

// Fallback products in case Supabase is loading or unreachable
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "799208a6-7b32-4977-9d93-8ab1c6f0f9d9",
    title: "متجر ألعاب وبلايستيشن (Playback)",
    badge: "الأكثر طلباً للجيمرز",
    original_price: 15000,
    discounted_price: 5000,
    description: "متجر إلكتروني لبيع حسابات وأكواد الألعاب مع تسليم سلس ودعم كامل لإنستاباي والمحافظ.",
    features: ["تصنيف الحسابات", "دعم إنستاباي والمحافظ", "تسليم فوري", "لوحة تحكم خفيفة"],
    live_demo_url: "https://demo.example.com",
    whatsapp_message: "أريد طلب متجر الألعاب بخصم الإطلاق",
    is_popular: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "f9c3df0c-7f06-4be1-8d17-c43fc0164e70",
    title: "منصة مستلزمات طب الأسنان",
    badge: "B2B طبي",
    original_price: 15000,
    discounted_price: 5000,
    description: "منصة B2B للشركات والمعامل لعرض المستلزمات واستقبال طلبات الجملة والكميات.",
    features: ["كتالوج بالماركات", "طلب كميات وفواتير", "تأكيد واتساب", "إدارة المخزون"],
    live_demo_url: "https://demo.example.com",
    whatsapp_message: "أريد طلب منصة مستلزمات الأسنان بخصم الإطلاق",
    is_popular: false,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "191834c5-e3a4-4b66-85a4-821cf14fea1a",
    title: "سيستم إدارة المدرس والسنتر",
    badge: "وفر 66%",
    original_price: 3000,
    discounted_price: 1000,
    description: "نظام سحابي لتسجيل الحضور والغياب ودرجات الطلاب بدون كشاكيل واشتراكات شهرية.",
    features: ["تسجيل سريع QR", "شيتات الدرجات", "تنظيم أولياء الأمور", "بدون اشتراك دوري"],
    live_demo_url: "https://demo.example.com",
    whatsapp_message: "أريد طلب سيستم المدرسين بسعر العرض",
    is_popular: false,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Fallback addons
const DEFAULT_ADDONS: Addon[] = [
  {
    id: "f670bbb7-fec4-457d-bf8d-f38822e76302",
    title: "خدمة الرفع والتركيب الكامل",
    price: 1200,
    description: "ربط قاعدة بيانات Supabase وإعداد ونشر المشروع على Vercel مع شهادة SSL مجانية مدى الحياة.",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "d83951eb-7593-4372-ba27-17a379c4787b",
    title: "حجز الدومين والاستضافة السنوية",
    price: 1500,
    description: "حجز دومين رسمي (.com أو .net) مع إعداد سجلات DNS واستضافة سنوية سريعة.",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get("product");

  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [addons, setAddons] = useState<Addon[]>(DEFAULT_ADDONS);
  const [isLoading, setIsLoading] = useState(true);

  // Selected State
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Validation state
  const [validationError, setValidationError] = useState<string | null>(null);

  // Fetch active products and addons from Supabase on mount
  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const [productsRes, addonsRes] = await Promise.all([
          supabase
            .from("qaleb_products")
            .select("*")
            .eq("is_active", true)
            .order("is_popular", { ascending: false }),
          supabase
            .from("addons")
            .select("*")
            .eq("is_active", true)
            .order("price", { ascending: true }),
        ]);

        if (productsRes.data && productsRes.data.length > 0) {
          setProducts(productsRes.data);
        }
        if (addonsRes.data && addonsRes.data.length > 0) {
          setAddons(addonsRes.data);
        }
      } catch (err) {
        console.error("Error loading checkout data from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Determine which product to select initially once products are available
  useEffect(() => {
    if (products.length === 0) return;

    if (initialProductId && products.some((p) => p.id === initialProductId)) {
      setSelectedProductId(initialProductId);
    } else if (!selectedProductId) {
      // Default to popular product or first product
      const popular = products.find((p) => p.is_popular);
      setSelectedProductId(popular ? popular.id : products[0].id);
    }
  }, [products, initialProductId, selectedProductId]);

  // Selected product object
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0] || null;
  }, [products, selectedProductId]);

  // Selected addons objects
  const selectedAddonsList = useMemo(() => {
    return addons.filter((a) => selectedAddonIds.includes(a.id));
  }, [addons, selectedAddonIds]);

  // Live Price Calculations
  const templatePrice = selectedProduct ? Number(selectedProduct.discounted_price) : 0;
  const addonsTotal = selectedAddonsList.reduce((sum, a) => sum + Number(a.price), 0);
  const totalPrice = templatePrice + addonsTotal;

  // Toggle addon checkbox
  const handleToggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Submit & Redirect to WhatsApp
  const handleConfirmOrder = () => {
    setValidationError(null);

    if (!selectedProduct) {
      setValidationError("يرجى اختيار القالب الأساسي للمتابعة.");
      return;
    }

    if (!customerName.trim()) {
      setValidationError("يرجى إدخال اسم العميل أو اسم النشاط التجاري.");
      return;
    }

    if (!customerPhone.trim()) {
      setValidationError("يرجى إدخال رقم الهاتف للتواصل والمتابعة.");
      return;
    }

    // Format services list
    const addonsText =
      selectedAddonsList.length > 0
        ? selectedAddonsList.map((a) => `${a.title} (+${Number(a.price).toLocaleString("ar-EG")} ج)`).join("، ")
        : "بدون خدمات إضافية";

    // Format WhatsApp message strictly according to specifications
    const messageLines = [
      "مرحباً، أود تأكيد طلب جديد من منصة QALEB:",
      `- القالب المختار: ${selectedProduct.title} (${Number(selectedProduct.discounted_price).toLocaleString("ar-EG")} ج)`,
      `- الخدمات الإضافية: ${addonsText}`,
      `- إجمالي المبلغ: ${totalPrice.toLocaleString("ar-EG")} ج`,
      `- اسم العميل / النشاط: ${customerName.trim()}`,
      `- رقم الهاتف: ${customerPhone.trim()}`,
    ];

    const message = messageLines.join("\n");
    const targetUrl = getWhatsAppUrl(message);

    // Open WhatsApp link in new tab
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text-primary selection:bg-brand-accent-1/25 selection:text-brand-accent-2">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-brand-accent-1/5 blur-[150px]" />
        <div className="absolute top-1/2 left-1/4 h-[600px] w-[600px] rounded-full bg-brand-accent-2/5 blur-[170px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb & Header */}
            <div className="mb-10 text-center sm:text-right">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-accent-1/30 bg-brand-accent-1/10 px-3.5 py-1 text-xs font-semibold text-brand-accent-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>خطوة واحدة لتأكيد طلبك</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                تأكيد حجز النظام وتحديد الباقة
              </h1>
              <p className="mt-2 text-sm text-brand-text-secondary sm:text-base">
                حدد القالب والخدمات الإضافية المناسبة، وسيتم تحويلك مباشرة للواتساب لتأكيد الاستلام والتجهيز.
              </p>
            </div>

            {/* Validation Banner */}
            {validationError && (
              <div className="mb-8 flex items-center gap-3 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-300 backdrop-blur-xl">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                <span className="font-medium">{validationError}</span>
              </div>
            )}

            {/* Main Checkout Layout: 2 Columns on Desktop */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 items-start">
              {/* Left / Main Section: 3 Steps */}
              <div className="space-y-10 lg:col-span-2">
                {/* STEP 1: Choose Template */}
                <section className="rounded-2xl border border-brand-border bg-brand-surface p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center gap-3 mb-6 border-b border-brand-border/70 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-accent-1/10 text-brand-accent-2 border border-brand-accent-1/20 font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">اختيار القالب الأساسي</h2>
                      <p className="text-xs text-brand-text-secondary">
                        اختر النظام الجاهز الذي يناسب طبيعة نشاطك
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {products.map((product) => {
                      const isSelected = selectedProductId === product.id;
                      const isPopular = Boolean(product.is_popular);

                      return (
                        <div
                          key={product.id}
                          onClick={() => setSelectedProductId(product.id)}
                          className={`relative cursor-pointer rounded-2xl border p-5 sm:p-6 transition-all duration-200 ${
                            isSelected
                              ? "border-brand-accent-1 bg-slate-900/90 shadow-lg shadow-brand-accent-1/10 ring-1 ring-brand-accent-1/50"
                              : "border-brand-border bg-slate-950/40 hover:border-brand-border/90 hover:bg-slate-900/50"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              {/* Custom Radio Circle */}
                              <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-border bg-slate-900 transition-colors">
                                {isSelected && (
                                  <div className="h-2.5 w-2.5 rounded-full bg-brand-accent-1" />
                                )}
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-base font-bold text-white">
                                    {product.title}
                                  </h3>
                                  {product.badge && (
                                    <span className="inline-flex items-center rounded-md border border-brand-accent-1/30 bg-brand-accent-1/10 px-2 py-0.5 text-[11px] font-semibold text-brand-accent-2">
                                      {product.badge}
                                    </span>
                                  )}
                                  {isPopular && (
                                    <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                                      الأكثر طلباً
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-brand-text-secondary leading-relaxed line-clamp-2">
                                  {product.description}
                                </p>
                              </div>
                            </div>

                            {/* Price & Demo */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-brand-border/40 pt-3 sm:pt-0 shrink-0">
                              <div className="text-left">
                                <div className="text-xl font-extrabold text-brand-accent-1 font-mono">
                                  {Number(product.discounted_price).toLocaleString("ar-EG")} ج.م
                                </div>
                                <div className="text-[11px] text-slate-400 line-through">
                                  {Number(product.original_price).toLocaleString("ar-EG")} ج.م
                                </div>
                              </div>

                              {product.live_demo_url && (
                                <a
                                  href={product.live_demo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-2 inline-flex items-center gap-1 text-[11px] text-brand-accent-2 hover:underline"
                                >
                                  <span>معاينة العرض</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* STEP 2: Optional Add-ons */}
                <section className="rounded-2xl border border-brand-border bg-brand-surface p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center gap-3 mb-6 border-b border-brand-border/70 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">الخدمات الإضافية الاختيارية</h2>
                      <p className="text-xs text-brand-text-secondary">
                        اختر خدمات التجهيز والنشر السحابي لتسليم متجرك جاهزاً للعمل مباشرة
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {addons.map((addon) => {
                      const isChecked = selectedAddonIds.includes(addon.id);

                      return (
                        <div
                          key={addon.id}
                          onClick={() => handleToggleAddon(addon.id)}
                          className={`relative cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
                            isChecked
                              ? "border-brand-accent-1/80 bg-slate-900/90 shadow-md ring-1 ring-brand-accent-1/40"
                              : "border-brand-border bg-slate-950/40 hover:border-brand-border/90 hover:bg-slate-900/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                              {/* Custom Styled Checkbox */}
                              <div
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all ${
                                  isChecked
                                    ? "border-brand-accent-1 bg-brand-accent-1 text-slate-950"
                                    : "border-slate-600 bg-slate-900"
                                }`}
                              >
                                {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                              </div>

                              <div className="space-y-1">
                                <h3 className="text-sm font-bold text-white">{addon.title}</h3>
                                <p className="text-xs text-brand-text-secondary leading-relaxed">
                                  {addon.description}
                                </p>
                              </div>
                            </div>

                            {/* Addon Price Badge */}
                            <div className="shrink-0 text-left">
                              <span className="inline-flex items-center rounded-xl border border-brand-accent-1/30 bg-brand-accent-1/10 px-3 py-1 text-xs font-mono font-bold text-brand-accent-1">
                                +{Number(addon.price).toLocaleString("ar-EG")} ج.م
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* STEP 3: Customer Information */}
                <section className="rounded-2xl border border-brand-border bg-brand-surface p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center gap-3 mb-6 border-b border-brand-border/70 pb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">بيانات العميل والنشاط التجاري</h2>
                      <p className="text-xs text-brand-text-secondary">
                        بيانات التواصل لتجهيز نسختك المخصصة من النظام
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-brand-text-secondary">
                        اسم العميل / اسم النشاط التجاري *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="مثال: أحمد محمد (أو متجر جيمرز ستور)"
                          className="w-full rounded-xl border border-brand-border bg-slate-950/60 py-3 pl-4 pr-11 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                          <User className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-brand-text-secondary">
                        رقم الهاتف / الواتساب للتواصل *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          dir="ltr"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full rounded-xl border border-brand-border bg-slate-950/60 py-3 pl-4 pr-11 text-sm text-white placeholder-slate-500 focus:border-brand-accent-1 focus:outline-none focus:ring-1 focus:ring-brand-accent-1"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                          <Phone className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Section: Sticky Order Summary Box */}
              <div className="lg:sticky lg:top-24">
                <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 sm:p-7 backdrop-blur-2xl shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-brand-border/80 pb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Layers className="h-5 w-5 text-brand-accent-2" />
                      <span>ملخص الطلب والحساب</span>
                    </h3>
                    <span className="rounded-lg bg-brand-accent-1/10 border border-brand-accent-1/20 px-2 py-0.5 text-[11px] font-bold text-brand-accent-2">
                      عرض الإطلاق
                    </span>
                  </div>

                  {/* Summary Breakdown */}
                  <div className="space-y-3.5 text-xs text-brand-text-secondary">
                    {/* Template Subtotal */}
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-300 font-medium">
                        {selectedProduct ? selectedProduct.title : "لم يتم اختيار قالب"}
                      </span>
                      <span className="font-mono font-bold text-white shrink-0">
                        {templatePrice.toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>

                    {/* Addons List */}
                    {selectedAddonsList.map((addon) => (
                      <div key={addon.id} className="flex items-start justify-between gap-3">
                        <span className="text-slate-400">{addon.title}</span>
                        <span className="font-mono text-slate-300 shrink-0">
                          +{Number(addon.price).toLocaleString("ar-EG")} ج.م
                        </span>
                      </div>
                    ))}

                    {/* Source code included tag */}
                    <div className="flex items-center justify-between text-brand-accent-1 pt-1">
                      <span>الكود المصدري الكامل (Next.js)</span>
                      <span className="font-semibold text-[11px]">مشمول مجاناً</span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-brand-border/80 pt-4 mt-2">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="block text-xs font-semibold text-slate-300">
                            إجمالي المبلغ المستحق
                          </span>
                          <span className="text-[10px] text-slate-500">
                            شامل جميع الخصومات والتجهيز
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="text-3xl font-extrabold text-brand-accent-2 font-mono">
                            {totalPrice.toLocaleString("ar-EG")}
                          </div>
                          <span className="text-xs font-semibold text-white">جنيه مصري</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Action Button */}
                  <button
                    type="button"
                    onClick={handleConfirmOrder}
                    className="group relative flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-brand-accent-1 to-emerald-500 py-4 px-4 text-sm font-bold text-slate-950 shadow-xl shadow-brand-accent-1/25 transition-all duration-200 hover:brightness-110 active:scale-95"
                  >
                    <MessageCircle className="h-5 w-5 fill-slate-950" />
                    <span>تأكيد الطلب والمتابعة عبر واتساب</span>
                  </button>

                  {/* Guarantees Box */}
                  <div className="space-y-2.5 rounded-xl border border-brand-border/60 bg-slate-950/40 p-4 text-[11px] text-brand-text-secondary">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-brand-accent-1 shrink-0" />
                      <span>لا يوجد دفع الآن، يتم التحقق والتنسيق المباشر أولاً</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-brand-accent-1 shrink-0" />
                      <span>تجهيز وتسليم النظام خلال 24 إلى 48 ساعة فقط</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-accent-1 shrink-0" />
                      <span>دعم وسائل الدفع المصرية (إنستاباي / فودافون كاش)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <WhatsAppFloat />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-brand-bg text-brand-text-primary">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-brand-accent-1" />
            <span className="text-sm font-medium">جاري تجهيز صفحة الحجز...</span>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
