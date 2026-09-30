"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type Addon = Database["public"]["Tables"]["addons"]["Row"];

export interface AddonInput {
  title: string;
  price: number;
  description: string;
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
 * Fetch all addons for admin view ordered by creation date descending.
 */
export async function getAddonsAdmin(): Promise<Addon[]> {
  const { supabase } = await ensureAdmin();

  const { data, error } = await supabase
    .from("addons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`فشل جلب الإضافات: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Create a new addon service.
 */
export async function createAddon(input: AddonInput): Promise<Addon> {
  const { supabase } = await ensureAdmin();

  const { data, error } = await supabase
    .from("addons")
    .insert({
      title: input.title.trim(),
      price: Number(input.price),
      description: input.description.trim(),
      is_active: input.is_active !== undefined ? Boolean(input.is_active) : true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`فشل إضافة الخدمة: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/checkout");
  revalidatePath("/admin/addons");
  return data;
}

/**
 * Update an existing addon service.
 */
export async function updateAddon(
  id: string,
  input: Partial<AddonInput>
): Promise<Addon> {
  const { supabase } = await ensureAdmin();

  const updatePayload: Database["public"]["Tables"]["addons"]["Update"] = {};

  if (input.title !== undefined) updatePayload.title = input.title.trim();
  if (input.price !== undefined) updatePayload.price = Number(input.price);
  if (input.description !== undefined)
    updatePayload.description = input.description.trim();
  if (input.is_active !== undefined)
    updatePayload.is_active = Boolean(input.is_active);

  const { data, error } = await supabase
    .from("addons")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`فشل تعديل الخدمة: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/checkout");
  revalidatePath("/admin/addons");
  return data;
}

/**
 * Delete an addon by ID.
 */
export async function deleteAddon(id: string): Promise<void> {
  const { supabase } = await ensureAdmin();

  const { error } = await supabase.from("addons").delete().eq("id", id);

  if (error) {
    throw new Error(`فشل حذف الخدمة: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/checkout");
  revalidatePath("/admin/addons");
}

/**
 * Toggle the is_active status of an addon.
 */
export async function toggleAddonStatus(
  id: string,
  isActive: boolean
): Promise<void> {
  const { supabase } = await ensureAdmin();

  const { error } = await supabase
    .from("addons")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    throw new Error(`فشل تحديث حالة الخدمة: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/checkout");
  revalidatePath("/admin/addons");
}
