import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import ProductsGrid from "@/components/sections/ProductsGrid";
import Addons from "@/components/sections/Addons";
import CustomOrderCallout from "@/components/sections/CustomOrderCallout";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
import WhatsAppFloat from "@/components/sections/WhatsAppFloat";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch active products, active addons, and faqs concurrently with fallback safety
  const [productsRes, addonsRes, faqsRes] = await Promise.allSettled([
    supabase
      .from("qaleb_products")
      .select("*")
      .eq("is_active", true)
      .order("is_popular", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("addons")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
    supabase
      .from("faqs")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  const products =
    productsRes.status === "fulfilled" && !productsRes.value.error
      ? productsRes.value.data ?? []
      : [];

  const addons =
    addonsRes.status === "fulfilled" && !addonsRes.value.error
      ? addonsRes.value.data ?? []
      : [];

  const faqs =
    faqsRes.status === "fulfilled" && !faqsRes.value.error
      ? faqsRes.value.data ?? []
      : [];

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text-primary selection:bg-brand-accent-1/25 selection:text-brand-accent-2 overflow-x-hidden">
      {/* Global Background Ambient Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-[600px] w-[600px] rounded-full bg-brand-accent-1/5 blur-[160px]" />
        <div className="absolute top-1/2 left-1/4 h-[700px] w-[700px] rounded-full bg-brand-accent-2/5 blur-[180px]" />
        <div className="absolute bottom-0 right-1/3 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[150px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <ProductsGrid products={products} />
          <Addons addons={addons} />
          <CustomOrderCallout />
          <Faq faqs={faqs} />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </div>
  );
}
