/**
 * Generates a direct WhatsApp link with custom encoded pre-filled message.
 */
export function getWhatsAppUrl(customMessage: string): string {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201553138143";
  const cleanNumber = rawNumber.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(customMessage.trim());

  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export const FACEBOOK_URL =
  process.env.NEXT_PUBLIC_FACEBOOK_URL ||
  "https://www.facebook.com/share/1C7n3nqren/?mibextid=wwXIfr";

