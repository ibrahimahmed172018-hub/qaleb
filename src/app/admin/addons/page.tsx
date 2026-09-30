import { getAddonsAdmin } from "@/lib/actions/addons";
import AddonsTableClient from "@/components/admin/AddonsTableClient";

export const metadata = {
  title: "إدارة الإضافات والخدمات | لوحة التحكم QALEB",
};

export default async function AdminAddonsPage() {
  const addons = await getAddonsAdmin();

  return <AddonsTableClient initialAddons={addons} />;
}
