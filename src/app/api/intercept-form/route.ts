import { NextResponse } from 'next/server';
import { submitApplication } from '@/app/actions/submit-application';

interface SquarespaceField {
  title?: string;
  value?: string | Record<string, string> | string[];
}

export async function POST(req: Request) {
  try {
    const rawText = await req.text();
    const payload = JSON.parse(rawText);
    
    const isInternship = payload.pagePath === '/apply-2' || payload.pagePath === '/internship-application' || rawText.includes("What's your name?");
    
    if (isInternship) {
      let formFields: SquarespaceField[] = [];
      if (typeof payload.form === 'string') {
        try {
          formFields = JSON.parse(payload.form);
        } catch (e) {
          void e;
        }
      } else {
        formFields = payload.form || [];
      }

      const getValue = (titleContains: string) => {
        const field = formFields.find((f: SquarespaceField) => typeof f.title === 'string' && f.title.toLowerCase().includes(titleContains.toLowerCase()));
        return field ? field.value : "";
      };
      
      const getName = (titleContains: string) => {
          const field = formFields.find((f: SquarespaceField) => typeof f.title === 'string' && f.title.toLowerCase().includes(titleContains.toLowerCase()));
          if (!field || !field.value) return "";
          if (typeof field.value === 'object' && !Array.isArray(field.value)) {
              return `${field.value.firstName || ''} ${field.value.lastName || ''}`.trim();
          }
          return typeof field.value === 'string' ? field.value : "";
      };
      
      const getAddress = (titleContains: string) => {
          const field = formFields.find((f: SquarespaceField) => typeof f.title === 'string' && f.title.toLowerCase().includes(titleContains.toLowerCase()));
          if (!field || !field.value) return {};
          if (typeof field.value === 'object' && !Array.isArray(field.value)) {
              return {
                  addressLine1: field.value.address1 || "",
                  addressLine2: field.value.address2 || "",
                  city: field.value.city || "",
                  state: field.value.state || "",
                  zip: field.value.zip || "",
                  country: field.value.country || ""
              };
          }
          return { addressLine1: typeof field.value === 'string' ? field.value : "" };
      };

      const getCheckbox = (titleContains: string) => {
          const val = getValue(titleContains);
          if (Array.isArray(val)) return val;
          if (typeof val === 'string' && val.length > 0) return [val]; 
          return [];
      };

      const addressObj = getAddress("address");

      const mappedData = {
        name: getName("name") || "",
        pronouns: (getValue("pronouns") || "") as string,
        email: (getValue("email") || "") as string,
        phone: (getValue("phone") || "") as string,
        birthday: (getValue("birthday") || "") as string,
        nationality: (getValue("nationality") || "") as string,
        addressLine1: addressObj.addressLine1 || "",
        addressLine2: addressObj.addressLine2 || "",
        city: addressObj.city || "",
        state: addressObj.state || "",
        zip: addressObj.zip || "",
        languages: (getValue("languages") || "") as string,
        film_project: (getValue("film project") || "") as string,
        favorite_movie: (getValue("favorite movie") || "") as string,
        traveled: (getValue("traveled outside") || "") as string,
        why_youth: (getValue("why work with youth") || "") as string,
        passions: (getValue("passions") || "") as string,
        passionate_filmmaking: (getValue("passion for filmmaking") || "") as string,
        bring_to_team: (getValue("bring to the team") || "") as string,
        positions: getCheckbox("positions") as string[],
        program: getCheckbox("program") as string[],
        disabilities: (getValue("disabilit") || "") as string,
        costs_agreement: getValue("costs") ? true : false,
        physical_agreement: getValue("physical") ? true : false,
        legal_agreement: getValue("legal") ? true : false,
        how_did_you_hear: (getValue("hear about us") || "") as string,
        cfTurnstileResponse: "skip"
      };
      
      const result = await submitApplication(mappedData);
      
      if (result.success) {
        return NextResponse.json({});
      } else {
        return NextResponse.json({ error: result.error || "Submission failed" }, { status: 400 });
      }
    } else {
      const sqsRes = await fetch("https://www.lightscameralearn.org/api/form/SaveFormSubmission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": req.headers.get("user-agent") || ""
        },
        body: rawText
      });
      const sqsData = await sqsRes.text();
      return new NextResponse(sqsData, {
        status: sqsRes.status,
        headers: { "Content-Type": sqsRes.headers.get("content-type") || "application/json" }
      });
    }
  } catch (err) {
    console.error("Intercept error:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
