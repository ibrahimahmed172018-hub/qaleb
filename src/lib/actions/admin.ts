"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type Product = Database["public"]["Tables"]["qaleb_products"]["Row"];

export interface ProductInput {
  title: string;
  badge?: string;
  original_price: number;
  discounted_price: number;
  description: string;
  features: string[];
  live_demo_url: string;
  whatsapp_message: string;
  is_popular?: boolean;
  is_active?: boolean;
}

/**
 * Verify user session and admin authorization before running actions.
 */
async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("غير مصرح: يجب تسجيل الدخول كمسؤول أولاً.");
  }

  const allowedAdmins = (process.env.ADMIN_EMAIL || "qalebsolutions@gmail.com,ibrahimahmed172018@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (allowedAdmins.length > 0 && !allowedAdmins.includes(user.email?.trim().toLowerCase() || "")) {
    throw new Error("غير مصرح: هذا الحساب غير مصرح له بتنفيذ عمليات الإدارة.");
  }

  return { supabase, user };
}

/**
 * Fetch all products/templates for admin view (both active and inactive).
 */
export async function getProductsAdmin(): Promise<Product[]> {
  const { supabase } = await ensureAdmin();

  const { data, error } = await supabase
    .from("qaleb_products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`فشل جلب القوالب: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Create a new product/template.
 */
export async function createProduct(input: ProductInput): Promise<Product> {
  const { supabase } = await ensureAdmin();

  const { data, error } = await supabase
    .from("qaleb_products")
    .insert({
      title: input.title.trim(),
      badge: input.badge?.trim() || "",
      original_price: Number(input.original_price),
      discounted_price: Number(input.discounted_price),
      description: input.description.trim(),
      features: input.features.filter((f) => f.trim().length > 0),
      live_demo_url: input.live_demo_url.trim(),
      whatsapp_message: input.whatsapp_message.trim(),
      is_popular: Boolean(input.is_popular),
      is_active: input.is_active !== undefined ? Boolean(input.is_active) : true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`فشل إضافة القالب: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  return data;
}

/**
 * Update an existing product/template.
 */
export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<Product> {
  const { supabase } = await ensureAdmin();

  const updatePayload: Database["public"]["Tables"]["qaleb_products"]["Update"] = {};

  if (input.title !== undefined) updatePayload.title = input.title.trim();
  if (input.badge !== undefined) updatePayload.badge = input.badge.trim();
  if (input.original_price !== undefined)
    updatePayload.original_price = Number(input.original_price);
  if (input.discounted_price !== undefined)
    updatePayload.discounted_price = Number(input.discounted_price);
  if (input.description !== undefined)
    updatePayload.description = input.description.trim();
  if (input.features !== undefined)
    updatePayload.features = input.features.filter((f) => f.trim().length > 0);
  if (input.live_demo_url !== undefined)
    updatePayload.live_demo_url = input.live_demo_url.trim();
  if (input.whatsapp_message !== undefined)
    updatePayload.whatsapp_message = input.whatsapp_message.trim();
  if (input.is_popular !== undefined)
    updatePayload.is_popular = Boolean(input.is_popular);
  if (input.is_active !== undefined)
    updatePayload.is_active = Boolean(input.is_active);

  const { data, error } = await supabase
    .from("qaleb_products")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`فشل تعديل القالب: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  return data;
}

/**
 * Delete a product/template by ID.
 */
export async function deleteProduct(id: string): Promise<void> {
  const { supabase } = await ensureAdmin();

  const { error } = await supabase.from("qaleb_products").delete().eq("id", id);

  if (error) {
    throw new Error(`فشل حذف القالب: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
}

/**
 * Toggle the is_active status of a product.
 */
export async function toggleProductStatus(
  id: string,
  isActive: boolean
): Promise<void> {
  const { supabase } = await ensureAdmin();

  const { error } = await supabase
    .from("qaleb_products")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    throw new Error(`فشل تحديث حالة القالب: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
}
