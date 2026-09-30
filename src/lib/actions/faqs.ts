"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type FaqItem = Database["public"]["Tables"]["faqs"]["Row"];

export interface FaqInput {
  question: string;
  answer: string;
  display_order: number;
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

  const configuredAdminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (configuredAdminEmail && user.email?.trim().toLowerCase() !== configuredAdminEmail) {
    throw new Error("غير مصرح: هذا الحساب غير مصرح له بتنفيذ عمليات الإدارة.");
  }

  return { supabase, user };
}

/**
 * Fetch all FAQs for admin view ordered by display_order ascending.
 */
export async function getFaqsAdmin(): Promise<FaqItem[]> {
  const { supabase } = await ensureAdmin();

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`فشل جلب الأسئلة الشائعة: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Create a new FAQ entry.
 */
export async function createFaq(input: FaqInput): Promise<FaqItem> {
  const { supabase } = await ensureAdmin();

  const { data, error } = await supabase
    .from("faqs")
    .insert({
      question: input.question.trim(),
      answer: input.answer.trim(),
      display_order: Number(input.display_order) || 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`فشل إضافة السؤال: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/faqs");
  return data;
}

/**
 * Update an existing FAQ entry.
 */
export async function updateFaq(
  id: string,
  input: Partial<FaqInput>
): Promise<FaqItem> {
  const { supabase } = await ensureAdmin();

  const updatePayload: Database["public"]["Tables"]["faqs"]["Update"] = {};

  if (input.question !== undefined) updatePayload.question = input.question.trim();
  if (input.answer !== undefined) updatePayload.answer = input.answer.trim();
  if (input.display_order !== undefined)
    updatePayload.display_order = Number(input.display_order);

  const { data, error } = await supabase
    .from("faqs")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`فشل تعديل السؤال: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/faqs");
  return data;
}

/**
 * Delete an FAQ entry by ID.
 */
export async function deleteFaq(id: string): Promise<void> {
  const { supabase } = await ensureAdmin();

  const { error } = await supabase.from("faqs").delete().eq("id", id);

  if (error) {
    throw new Error(`فشل حذف السؤال: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/faqs");
}
