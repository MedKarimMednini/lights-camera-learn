"use server";

import { z } from "zod";
import { Resend } from "resend";
import { headers } from "next/headers";
import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

const sql = neon(process.env.DATABASE_URL!);
const resend = new Resend(process.env.RESEND_API_KEY);

const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  pronouns: z.enum(["she/her", "he/him", "they/them", "other"]),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  birthday: z.string().min(1, "Birthday is required"),
  nationality: z.string().min(1, "Nationality is required"),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  languages: z.string().min(1, "Languages are required"),
  film_project: z.enum(["Yes", "Not yet - this will be my first experience", "It's complicated"]).optional(),
  favorite_movie: z.string().min(1, "Favorite movie is required"),
  traveled: z.string().min(1, "Travel history is required"),
  why_youth: z.string().min(1, "Why you want to work with youth is required"),
  passions: z.string().optional(),
  passionate_filmmaking: z.string().min(1, "This field is required"),
  bring_to_team: z.string().min(1, "This field is required"),
  positions: z.array(z.string()).min(1, "Please select at least one position"),
  program: z.array(z.string()).min(1, "Please select at least one program"),
  disabilities: z.enum(["Yes", "No"]).optional(),
  costs_agreement: z.boolean().refine(val => val === true, "You must agree to the costs"),
  physical_agreement: z.boolean().refine(val => val === true, "You must agree to the physical requirements"),
  legal_agreement: z.boolean().refine(val => val === true, "You must agree to the legal requirements"),
  how_did_you_hear: z.enum(["Friend/Family", "Referral", "Facebook", "Instagram", "University", "Other"]),
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

export async function submitApplication(data: unknown) {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const rawIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";
    
    // 1. Rate Limiting via Postgres (Hash IP for privacy)
    // Note: If no DB is connected during local testing, this will fail unless mocked.
    // We enforce DB as source of truth.
    const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex');
    
    try {
      // Clean up old rate limits (> 5 mins)
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
    const parsed = applicationSchema.safeParse(data);
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
      // Note: Turnstile might fail on localhost if not configured for it, 
      // but in production it MUST pass.
      return { success: false, error: "Spam protection verification failed. Please try again." };
    }

    // 4. Duplicate Check (within DB)
    const duplicateRes = await sql`
      SELECT id FROM internship_applications 
      WHERE email = ${formData.email} 
      AND created_at > NOW() - INTERVAL '5 minutes' 
      LIMIT 1;
    `;
    if (duplicateRes.length > 0) {
      return { success: false, error: "It looks like you have already submitted this application." };
    }

    // Combine address fields for DB
    const address = [formData.addressLine1, formData.addressLine2, formData.city, formData.state, formData.zip]
      .filter(Boolean)
      .join(", ");

    // 5. Database Persistence (Source of Truth)
    let submissionId;
    try {
      const insertRes = await sql`
        INSERT INTO internship_applications (
          source_form, name, pronouns, email, phone, birthday, nationality, address, languages, 
          film_project, favorite_movie, traveled, why_youth, passions, passionate_filmmaking, bring_to_team, 
          positions, program, disabilities, costs_agreement, physical_agreement, legal_agreement, how_did_you_hear
        ) VALUES (
          '/internship-application', ${formData.name}, ${formData.pronouns}, ${formData.email}, ${formData.phone}, 
          ${formData.birthday}, ${formData.nationality}, ${address || null}, ${formData.languages}, 
          ${formData.film_project || null}, ${formData.favorite_movie}, ${formData.traveled}, ${formData.why_youth}, 
          ${formData.passions || null}, ${formData.passionate_filmmaking}, ${formData.bring_to_team}, 
          ${JSON.stringify(formData.positions)}, ${JSON.stringify(formData.program)}, ${formData.disabilities || null}, 
          ${formData.costs_agreement}, ${formData.physical_agreement}, ${formData.legal_agreement}, ${formData.how_did_you_hear}
        ) RETURNING id;
      `;
      submissionId = insertRes[0].id;
    } catch (insertErr) {
      console.error("Failed to save application to DB:", insertErr);
      return { success: false, error: "Failed to save application securely. Please try again later." };
    }

    // 5.5 Google Sheets Webhook
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      try {
        const sheetPayload = {
          name: formData.name,
          pronouns: formData.pronouns,
          email: formData.email,
          phone: formData.phone,
          birthday: formData.birthday,
          nationality: formData.nationality,
          address: address, // Combined address for Column H
          languages: formData.languages,
          film_project: formData.film_project,
          favorite_movie: formData.favorite_movie,
          traveled: formData.traveled,
          why_youth: formData.why_youth,
          passions: formData.passions,
          passionate_filmmaking: formData.passionate_filmmaking,
          bring_to_team: formData.bring_to_team,
          positions: formData.positions.join(", "),
          program: formData.program.join(", "),
          disabilities: formData.disabilities,
          costs_agreement: formData.costs_agreement ? "Yes" : "No",
          physical_agreement: formData.physical_agreement ? "Yes" : "No",
          legal_agreement: formData.legal_agreement ? "Yes" : "No",
          how_did_you_hear: formData.how_did_you_hear,
          secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET
        };

        const sheetRes = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sheetPayload)
        });

        if (!sheetRes.ok) {
          console.error("Google Sheets webhook failed:", sheetRes.status, await sheetRes.text());
        }
      } catch (sheetErr) {
        console.error("Google Sheets webhook error:", sheetErr);
        // Note: we don't fail the request here, DB holds the record.
      }
    }

    // 6. Email Delivery (Does not fail the request if it errors, just updates DB)
    const destination = process.env.DESTINATION_EMAIL;
    if (destination) {
      const emailHtml = `
        <h2>New Internship Application</h2>
        <p><strong>Submission ID:</strong> ${submissionId}</p>
        <p><strong>Submitted At:</strong> ${new Date().toISOString()}</p>
        
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> ${escapeHtml(formData.name)}</p>
        <p><strong>Pronouns:</strong> ${escapeHtml(formData.pronouns)}</p>
        <p><strong>Email:</strong> ${escapeHtml(formData.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(formData.phone)}</p>
        <p><strong>Birthday:</strong> ${escapeHtml(formData.birthday)}</p>
        <p><strong>Nationality:</strong> ${escapeHtml(formData.nationality)}</p>
        <p><strong>Address:</strong> ${escapeHtml(address)}</p>
        <p><strong>Languages:</strong> ${escapeHtml(formData.languages)}</p>

        <h3>Short Answers</h3>
        <p><strong>Film Project Experience:</strong> ${escapeHtml(formData.film_project)}</p>
        <p><strong>Favorite Movie:</strong> ${escapeHtml(formData.favorite_movie)}</p>
        <p><strong>Travel Experience:</strong> ${escapeHtml(formData.traveled)}</p>
        <p><strong>Why Youth:</strong> ${escapeHtml(formData.why_youth)}</p>
        <p><strong>Passions:</strong> ${escapeHtml(formData.passions)}</p>
        <p><strong>Passionate about Filmmaking:</strong> ${escapeHtml(formData.passionate_filmmaking)}</p>
        <p><strong>Bring to Team:</strong> ${escapeHtml(formData.bring_to_team)}</p>

        <h3>Program Details</h3>
        <p><strong>Positions:</strong> ${escapeHtml(formData.positions.join(", "))}</p>
        <p><strong>Programs:</strong> ${escapeHtml(formData.program.join(", "))}</p>
        <p><strong>Disabilities:</strong> ${escapeHtml(formData.disabilities)}</p>

        <h3>Agreements & Meta</h3>
        <p><strong>Costs Agreement:</strong> Yes</p>
        <p><strong>Physical Agreement:</strong> Yes</p>
        <p><strong>Legal Agreement:</strong> Yes</p>
        <p><strong>How did you hear about us:</strong> ${escapeHtml(formData.how_did_you_hear)}</p>
      `;

      const result = await resend.emails.send({
        from: "Internship Application <onboarding@resend.dev>",
        replyTo: formData.email,
        to: destination,
        subject: `New Internship Application from ${formData.name}`,
        html: emailHtml,
      });

      if (result.error) {
        console.error("Resend Error:", result.error);
        await sql`UPDATE internship_applications SET email_delivery_status = 'failed', email_delivery_error = ${result.error.message} WHERE id = ${submissionId}`;
        // Note: we still return success=true because the DB stored it safely.
      } else {
        await sql`UPDATE internship_applications SET email_delivery_status = 'sent' WHERE id = ${submissionId}`;
      }
    } else {
       await sql`UPDATE internship_applications SET email_delivery_status = 'failed', email_delivery_error = 'DESTINATION_EMAIL not configured' WHERE id = ${submissionId}`;
    }

    return { success: true };
  } catch (err) {
    console.error("Submission error:", err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
