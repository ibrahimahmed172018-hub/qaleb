"use server";

import nodemailer from "nodemailer";

export interface CustomOrderPayload {
  clientName: string;
  phone: string;
  email?: string;
  projectType: string;
  budget: string;
  details: string;
  preferredTimeline: string;
}

export interface CustomOrderResponse {
  success: boolean;
  error?: string;
  simulated?: boolean;
}

export async function submitCustomOrder(
  data: CustomOrderPayload
): Promise<CustomOrderResponse> {
  try {
    // 1. Validation
    const clientName = data.clientName?.trim();
    const phone = data.phone?.trim();
    const email = data.email?.trim() || "غير محدد";
    const projectType = data.projectType?.trim() || "فكرة خاصة / أخرى";
    const budget = data.budget?.trim() || "غير محدد";
    const details = data.details?.trim();
    const preferredTimeline = data.preferredTimeline?.trim() || "في أقرب وقت ممكن";

    if (!clientName) {
      return { success: false, error: "يرجى كتابة الاسم بالكامل أو اسم النشاط." };
    }

    if (!phone) {
      return { success: false, error: "يرجى كتابة رقم الهاتف / الواتساب للتواصل." };
    }

    if (!details) {
      return { success: false, error: "يرجى كتابة تفاصيل ومواصفات المشروع المطلوب." };
    }

    const recipient =
      process.env.NOTIFICATION_RECEIVER_EMAIL ||
      process.env.ADMIN_EMAIL ||
      "ibrahimahmed172018@gmail.com";

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const waLink = `https://wa.me/${cleanPhone}`;

    // 2. Compose Modern Dark HTML Email Template
    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>طلب مشروع مخصص جديد</title>
</head>
<body style="margin: 0; padding: 0; background-color: #090D16; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #FFFFFF; direction: rtl; text-align: right;">
  <div style="max-width: 600px; margin: 30px auto; background-color: #0F172A; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 30px; text-align: center;">
      <h1 style="margin: 0; color: #090D16; font-size: 24px; font-weight: 800;">
        🔥 طلب مشروع مخصص جديد | QALEB
      </h1>
      <p style="margin: 8px 0 0 0; color: #064E3B; font-size: 14px; font-weight: 600;">
        تم استلام طلب تطوير مخصص عبر المنصة
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      
      <!-- Client Info Card -->
      <div style="background-color: #1E293B; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px 0; color: #00F5A0; font-size: 16px; border-bottom: 1px solid #334155; padding-bottom: 8px;">
          👤 بيانات العميل الأساسية
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; width: 140px;">الاسم / النشاط:</td>
            <td style="padding: 8px 0; color: #FFFFFF; font-weight: bold;">${clientName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8;">رقم الهاتف:</td>
            <td style="padding: 8px 0;">
              <a href="tel:${phone}" style="color: #10B981; text-decoration: none; font-weight: bold;">${phone}</a>
              &nbsp;|&nbsp;
              <a href="${waLink}" style="color: #00F5A0; text-decoration: underline;">محادثة واتساب مباشرة ↗</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8;">البريد الإلكتروني:</td>
            <td style="padding: 8px 0; color: #FFFFFF;">${email}</td>
          </tr>
        </table>
      </div>

      <!-- Project Details Card -->
      <div style="background-color: #1E293B; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px 0; color: #00F5A0; font-size: 16px; border-bottom: 1px solid #334155; padding-bottom: 8px;">
          💼 مواصفات ومتطلبات المشروع
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; width: 140px;">نوع المشروع:</td>
            <td style="padding: 8px 0; color: #FFFFFF; font-weight: bold;">${projectType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8;">الميزانية المقدرة:</td>
            <td style="padding: 8px 0; color: #10B981; font-weight: bold;">${budget}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8;">الموعد المفضل:</td>
            <td style="padding: 8px 0; color: #FFFFFF;">${preferredTimeline}</td>
          </tr>
        </table>
        
        <div style="margin-top: 16px; border-top: 1px dashed #334155; padding-top: 16px;">
          <div style="color: #94A3B8; font-size: 13px; margin-bottom: 8px; font-weight: bold;">شرح الفكرة والمميزات:</div>
          <div style="background-color: #090D16; border: 1px solid #334155; border-radius: 8px; padding: 14px; font-size: 14px; line-height: 1.6; color: #E2E8F0; white-space: pre-wrap;">${details}</div>
        </div>
      </div>

      <!-- Quick Action -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="${waLink}" style="display: inline-block; background: linear-gradient(135deg, #10B981, #059669); color: #090D16; font-size: 15px; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">
          التواصل مع العميل عبر واتساب فوراً
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #090D16; padding: 20px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B;">
      نظام الإشعارات الآلي لمنصة قالب (QALEB) • ${new Date().toLocaleString("ar-EG")}
    </div>

  </div>
</body>
</html>
`;

    // 3. SMTP Transporter Setup
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT) || 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Graceful simulation fallback if SMTP credentials are not yet configured in local environment
    if (!user || !pass) {
      console.log("ℹ️ [Custom Order Received - SMTP Not Configured]:", {
        clientName,
        phone,
        email,
        projectType,
        budget,
        details,
        preferredTimeline,
        recipient,
      });
      return { success: true, simulated: true };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: `"منصة قالب QALEB" <${user}>`,
      to: recipient,
      subject: `🔥 طلب مشروع مخصص جديد من: ${clientName}`,
      html: htmlContent,
      replyTo: email !== "غير محدد" ? email : undefined,
    });

    return { success: true };
  } catch (err: unknown) {
    console.error("Error in submitCustomOrder:", err);
    const msg =
      err instanceof Error ? err.message : "فشل إرسال الطلب، يرجى المحاولة لاحقاً.";
    return { success: false, error: msg };
  }
}
