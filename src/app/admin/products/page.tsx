import { getProductsAdmin } from "@/lib/actions/admin";
import ProductsTableClient from "@/components/admin/ProductsTableClient";

export const metadata = {
  title: "إدارة القوالب والأنظمة | لوحة التحكم QALEB",
};

export default async function AdminProductsPage() {
  const products = await getProductsAdmin();

  return <ProductsTableClient initialProducts={products} />;
}
