import { getFaqsAdmin } from "@/lib/actions/faqs";
import FaqsTableClient from "@/components/admin/FaqsTableClient";

export const metadata = {
  title: "إدارة الأسئلة الشائعة | لوحة التحكم QALEB",
};

export default async function AdminFaqsPage() {
  const faqs = await getFaqsAdmin();

  return <FaqsTableClient initialFaqs={faqs} />;
}
