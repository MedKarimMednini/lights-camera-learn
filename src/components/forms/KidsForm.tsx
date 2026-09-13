"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { submitKidsForm } from "@/app/actions/submit-kids-form";

const schema = z.object({
  name: z.string().min(1, "Name of Student is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  age: z.enum(["8", "9", "10", "11", "12", "13", "14", "15", "16", "17"]),
  location: z.enum(["Tunis"]).optional(),
  cfTurnstileResponse: z.string().min(1, "Please complete the CAPTCHA")
});

type FormData = z.infer<typeof schema>;

export default function KidsForm() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    const res = await submitKidsForm(data);
    if (res.success) {
      setSuccess(true);
    } else {
      setServerError(res.error || "An unknown error occurred.");
    }
  };

  if (success) {
    return (
      <div className="bg-gray-50 p-12 text-center border-t-4 border-black" role="alert" aria-live="polite">
        <h2 className="font-fjalla text-3xl uppercase tracking-widest mb-4">Form Submitted!</h2>
        <p className="font-libre text-lg text-gray-700">Thank you for your submission. We will be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto font-libre" noValidate>
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md" role="alert" aria-live="assertive">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="kf-name" className="block font-bold mb-2">Name of Student *</label>
        <input 
          id="kf-name"
          type="text" 
          {...register("name")} 
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "kf-name-error" : undefined}
          className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" 
        />
        {errors.name && <p id="kf-name-error" className="text-red-600 text-sm mt-1" role="alert">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="kf-email" className="block font-bold mb-2">Email Address *</label>
        <input 
          id="kf-email"
          type="email" 
          {...register("email")} 
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "kf-email-error" : undefined}
          className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" 
        />
        {errors.email && <p id="kf-email-error" className="text-red-600 text-sm mt-1" role="alert">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="kf-phone" className="block font-bold mb-2">Phone Number</label>
        <input 
          id="kf-phone"
          type="text" 
          {...register("phone")} 
          className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" 
        />
      </div>

      <div>
        <label htmlFor="kf-age" className="block font-bold mb-2">Age of Student *</label>
        <select 
          id="kf-age"
          {...register("age")} 
          aria-invalid={!!errors.age}
          aria-describedby={errors.age ? "kf-age-error" : undefined}
          className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white"
        >
          <option value="">Select...</option>
          {["8", "9", "10", "11", "12", "13", "14", "15", "16", "17"].map(age => (
            <option key={age} value={age}>{age}</option>
          ))}
        </select>
        {errors.age && <p id="kf-age-error" className="text-red-600 text-sm mt-1" role="alert">{errors.age.message}</p>}
      </div>

      <div>
        <label htmlFor="kf-location" className="block font-bold mb-2">Location</label>
        <select 
          id="kf-location"
          {...register("location")} 
          className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white"
        >
          <option value="">Select...</option>
          <option value="Tunis">Tunis</option>
        </select>
      </div>

      <div className="pt-8 flex flex-col items-center">
        <div className="mb-6">
          <Turnstile 
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} 
            onSuccess={(token) => setValue("cfTurnstileResponse", token, { shouldValidate: true })}
            onError={() => setServerError("Spam protection challenge failed.")}
          />
          {errors.cfTurnstileResponse && <p className="text-red-600 text-sm mt-2 text-center" role="alert">{errors.cfTurnstileResponse.message}</p>}
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-black text-white px-12 py-4 font-fjalla text-xl uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
