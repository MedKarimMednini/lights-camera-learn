# Light's Camera Learn

A Next.js standalone application housing the visual migration of the Light's Camera Learn website, along with integrated form submission logic (Neon PostgreSQL, Resend email notifications, and Google Sheets webhook).

## Overview

This project is a pixel-accurate migration of the original Squarespace website. The static HTML, CSS, and JS from the live site have been imported and are served natively through Next.js using a `beforeFiles` rewrite configuration. This guarantees 100% visual fidelity while allowing custom backend logic (server actions) to be developed in isolation.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL (via Neon Serverless)
- **Email Delivery**: Resend
- **Spam Protection**: Cloudflare Turnstile
- **Form Validation**: Zod
- **External Integration**: Google Sheets (via Apps Script Webhook)

## Development

### Requirements

- Node.js (v18+)
- npm / yarn / pnpm

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd lights-camera-learn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   *Edit `.env.local` to include your actual `DATABASE_URL`, `RESEND_API_KEY`, Turnstile keys, and the Google Sheets Webhook URL/Secret.*

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Verification Commands

- **Lint**: `npm run lint`
- **Typecheck**: `npm run typecheck`
- **Production Build**: `npm run build`

## Project Structure

- `public/html/`: Contains the 100% accurate static HTML layouts mirrored from the live site.
- `public/styles/`: Contains the global Squarespace CSS.
- `src/app/actions/`: Contains the Next.js Server Actions for handling form submissions (e.g., `submit-application.ts`).
- `src/components/forms/`: React components (Tailwind-based) implementing the form UI and client-side Zod validation.
- `next.config.ts`: Contains the routing logic mapping Next.js routes to the static HTML files, and the proxy configuration for Squarespace assets.

## Forms & Applications

The website includes multiple forms. Their current implementation statuses are:

1. **/internship-application**: The most complex form. Uses the native Squarespace UI rendered via the original Javascript. The custom Tailwind form (`src/components/forms/InternshipForm.tsx`) and its Server Action backend (`src/app/actions/submit-application.ts`) are fully built and ready, but are currently detached from the UI to preserve 100% visual accuracy. (See "Where to start" below).
2. **/apply**: General application form. Currently serving native Squarespace HTML.
3. **/inscription**: French/Arabic enrollment form. Currently serving native Squarespace HTML.
4. **/contactus**: Contact form. Currently serving native Squarespace HTML.
5. **Newsletter (Footer)**: Global footer subscription form. Currently serving native Squarespace HTML.

## Application Submission Flow (Internship Form)

When the custom Tailwind form (`InternshipForm.tsx`) is wired up, the architecture flows as follows:

1. **User** fills out the application form on the website.
2. **Client Validation** ensures required fields (using Zod schema) and Cloudflare Turnstile are complete.
3. **Next.js Server Action** (`submit-application.ts`) receives the payload securely.
4. **Neon PostgreSQL Database** serves as the ultimate *Source of Truth*. The record is immediately inserted to guarantee no data loss.
5. **Google Sheets Webhook (Secondary)** is called to forward the data to the Google Sheet. (Does not block or fail the submission if it errors).
6. **Email Notification (Secondary)** is dispatched via Resend to notify administrators.
7. **Success Response** is returned to the UI.

## Internship Application — Google Sheet Mapping

The `submit-application.ts` Server Action maps the form payload exactly to the "New applicants" worksheet in the "2022 Summer Intern Applicants" Google Sheet. 

The columns map exactly as follows (and preserve required blank columns):

* **A** = (blank)
* **B** = `data.name`
* **C** = `data.pronouns`
* **D** = `data.email`
* **E** = `data.phone`
* **F** = `data.birthday`
* **G** = `data.nationality`
* **H** = `data.address` (Address Line 1, Address Line 2, City, State, ZIP concatenated)
* **I** = `data.languages`
* **J** = `data.film_project`
* **K** = `data.favorite_movie`
* **L** = `data.traveled`
* **M** = `data.why_youth`
* **N** = `data.passions`
* **O** = `data.passionate_filmmaking`
* **P** = `data.bring_to_team`
* **Q** = `data.positions` (Multi-select checkbox, joined by commas)
* **R** = `data.program` (Multi-select checkbox, joined by commas)
* **S** = `data.disabilities`
* **T** = `data.costs_agreement` ("Yes" or "No")
* **U** = `data.physical_agreement` ("Yes" or "No")
* **V** = `data.legal_agreement` ("Yes" or "No")
* **W** = `data.how_did_you_hear`
* **X** = (blank)
* **Y** = (blank)
* **Z** = (blank)

## Known Issue — Google Sheets Webhook (403)

The frontend/server-side application flow for the Internship Application is completely implemented. Data is successfully captured, saved to the Neon database, and emailed. 

However, **the Google Apps Script Web App endpoint currently returns HTTP 403 (Forbidden).** 
This 403 was reproduced independently and is a backend authorization issue, not a frontend validation error. The Next.js server gracefully catches this failure and completes the submission successfully (since the database insert succeeded), but the row will not appear in Google Sheets.

**Karim should inspect the Apps Script deployment and authorization configuration.** The script must be deployed to execute as the owner and set to allow access to "Anyone".

## Where to start if you are fixing Google Sheets

Karim, to fix the Google Sheets 403 error and wire up the final UI, look at these specific files in order:

1. **Environment Variables**: Configure `.env.local` using `.env.example`.
2. **Form UI & Client Validation**: `src/components/forms/InternshipForm.tsx`
3. **Server-Side Submission**: `src/app/actions/submit-application.ts`
   * Lines 89-113 handle payload construction.
   * Lines 115-125 execute the `fetch` request to the Google Sheets Webhook.
4. **Current UI Route**: `public/html/internship-application.html` is the native Squarespace HTML. You will need to decide whether to intercept its native `onSubmit` event via an injected script (to hit the Server Action), or swap it out with the React `InternshipForm.tsx` (which is fully built but alters the Squarespace visual layout).

## Testing

To test form submissions locally:
1. Ensure all variables in `.env.local` are set.
2. The Database is the primary source of truth. Check your Neon DB dashboard to verify row insertion.
3. Use a fake name (e.g., "Test User") and fake email. Do not use real personal information.
4. If you fix the 403, you will see a new row appear in the Google Sheet. Until then, you can check the server console for the `console.error("Google Sheets webhook failed:", sheetRes.status)` log.
