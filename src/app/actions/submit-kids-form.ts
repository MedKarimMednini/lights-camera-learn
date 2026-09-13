"use server";

import { z } from "zod";
import { Resend } from "resend";
import { headers } from "next/headers";
import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

const sql = neon(process.env.DATABASE_URL!);
const resend = new Resend(process.env.RESEND_API_KEY);

const kidsFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  age: z.enum(["8", "9", "10", "11", "12", "13", "14", "15", "16", "17"]),
  location: z.enum(["Tunis"]).optional(),
  cfTurnstileResponse: z.string().min(1, "Turnstile verification failed")
});

function escapeHtml(unsafe: string | undefined | null) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function submitKidsForm(data: unknown) {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const rawIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";
    
    // 1. Rate Limiting via Postgres
    const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex');
    
    try {
      await sql`DELETE FROM rate_limits WHERE last_submission < NOW() - INTERVAL '5 minutes'`;
      
      const rateLimitRes = await sql`
        INSERT INTO rate_limits (ip_hash, submissions_count) 
        VALUES (${ipHash}, 1)
        ON CONFLICT (ip_hash) DO UPDATE 
        SET submissions_count = rate_limits.submissions_count + 1,
            last_submission = CURRENT_TIMESTAMP
        RETURNING submissions_count;
      `;
      
      if (rateLimitRes[0].submissions_count > 3) {
        return { success: false, error: "Too many requests. Please try again later." };
      }
    } catch (dbErr) {
      console.error("Database connection/rate limit error:", dbErr);
      return { success: false, error: "A server database error occurred. Please try again." };
    }

    // 2. Validation
    const parsed = kidsFormSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Invalid form data.", details: parsed.error.format() };
    }

    const { cfTurnstileResponse, ...formData } = parsed.data;

    // 3. Turnstile Verification
    const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${cfTurnstileResponse}&remoteip=${rawIp}`,
    });

    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success && process.env.NODE_ENV === "production") {
      return { success: false, error: "Spam protection verification failed. Please try again." };
    }

    // 4. Duplicate Check
    const duplicateRes = await sql`
      SELECT id FROM kids_applications 
      WHERE email = ${formData.email} 
      AND created_at > NOW() - INTERVAL '5 minutes' 
      LIMIT 1;
    `;
    if (duplicateRes.length > 0) {
      return { success: false, error: "It looks like you have already submitted this application." };
    }

    // 5. Database Persistence
    let submissionId;
    try {
      const insertRes = await sql`
        INSERT INTO kids_applications (
          source_form, name, email, phone, age, location
        ) VALUES (
          '/inscription', ${formData.name}, ${formData.email}, ${formData.phone || null}, 
          ${formData.age}, ${formData.location || null}
        ) RETURNING id;
      `;
      submissionId = insertRes[0].id;
    } catch (insertErr) {
      console.error("Failed to save kids application to DB:", insertErr);
      return { success: false, error: "Failed to save application securely. Please try again later." };
    }

    // 6. Email Delivery
    const destination = process.env.DESTINATION_EMAIL;
    if (destination) {
      const emailHtml = `
        <h2>New Kids Application (Inscription)</h2>
        <p><strong>Submission ID:</strong> ${submissionId}</p>
        <p><strong>Submitted At:</strong> ${new Date().toISOString()}</p>
        
        <p><strong>Name:</strong> ${escapeHtml(formData.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(formData.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(formData.phone)}</p>
        <p><strong>Age:</strong> ${escapeHtml(formData.age)}</p>
        <p><strong>Location:</strong> ${escapeHtml(formData.location)}</p>
      `;

      const result = await resend.emails.send({
        from: "Kids Inscription <onboarding@resend.dev>",
        replyTo: formData.email,
        to: destination,
        subject: `New Inscription: ${formData.name}`,
        html: emailHtml,
      });

      if (result.error) {
        console.error("Resend Error:", result.error);
        await sql`UPDATE kids_applications SET email_delivery_status = 'failed', email_delivery_error = ${result.error.message} WHERE id = ${submissionId}`;
      } else {
        await sql`UPDATE kids_applications SET email_delivery_status = 'sent' WHERE id = ${submissionId}`;
      }
    } else {
       await sql`UPDATE kids_applications SET email_delivery_status = 'failed', email_delivery_error = 'DESTINATION_EMAIL not configured' WHERE id = ${submissionId}`;
    }

    return { success: true };
  } catch (err) {
    console.error("Submission error:", err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
