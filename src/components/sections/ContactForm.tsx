"use client";

import { useState, type FormEvent } from "react";
import type { ContactContent } from "@/content/types";
import { contactSchema, FIELD_LIMITS } from "@/lib/contact-schema";
import { MagneticButton } from "@/components/fx/MagneticButton";

/*
 * Contact form: underline fields, a hidden honeypot, and the site's single
 * pill CTA. Validates with the shared zod schema, then POSTs straight to
 * Web3Forms from the browser: their free tier only accepts client-side
 * submissions, and the access key is a public form identifier (it can only
 * route mail to the owner's own inbox), not a secret. A filled honeypot
 * short-circuits locally without any network request. Success replaces the
 * form; errors offer a direct mailto fallback. The status region is a
 * persistent aria-live container so state changes are announced.
 */

interface ContactFormProps {
  readonly data: ContactContent;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

const CONTACT_ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ??
  "03801fe0-3a26-45af-9472-d1035dad4c4a";
const MESSAGE_ROWS = 5;
const INPUT_CLASSES =
  "w-full border-0 border-b border-line bg-transparent py-3 text-base text-fg focus:border-steel focus:outline-none";

export function ContactForm({ data }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (status === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const website = String(formData.get("website") ?? "");
    const candidate = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    /* A filled honeypot means a bot: report success, send nothing. */
    if (website !== "") {
      setStatus("success");
      return;
    }

    const parsed = contactSchema.safeParse({ ...candidate, website: "" });
    if (!parsed.success) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio contact from ${parsed.data.name}`,
          from_name: parsed.data.name,
          name: parsed.data.name,
          email: parsed.data.email,
          message: parsed.data.message,
          botcheck: "",
        }),
      });
      const result: unknown = await response.json();
      const isOk =
        response.ok &&
        typeof result === "object" &&
        result !== null &&
        (result as { readonly success?: unknown }).success === true;
      setStatus(isOk ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      {status !== "success" ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div>
              <label htmlFor="contact-name" className="eyebrow block">
                {data.form.nameLabel}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                maxLength={FIELD_LIMITS.name}
                autoComplete="name"
                className={INPUT_CLASSES}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="eyebrow block">
                {data.form.emailLabel}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={FIELD_LIMITS.email}
                autoComplete="email"
                className={INPUT_CLASSES}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="eyebrow block">
                {data.form.messageLabel}
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={MESSAGE_ROWS}
                maxLength={FIELD_LIMITS.message}
                className={`${INPUT_CLASSES} resize-none`}
              />
            </div>
          </div>

          {/* Honeypot: hidden from humans and assistive tech; bots fill it. */}
          <div aria-hidden="true" className="absolute -left-[9999px]">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          <div className="mt-10">
            <MagneticButton>
              <button
                type="submit"
                data-cursor="link"
                disabled={status === "submitting"}
                className="pill eyebrow px-10 py-4 !text-xs text-fg transition-colors hover:bg-fg hover:text-canvas disabled:opacity-60"
              >
                {status === "submitting"
                  ? data.form.submittingLabel
                  : data.form.submitLabel}
              </button>
            </MagneticButton>
          </div>
        </form>
      ) : null}

      <div aria-live="polite" role="status">
        {status === "success" ? (
          <div>
            <p className="text-2xl uppercase text-fg">
              {data.form.successTitle}
            </p>
            <p className="mt-3 max-w-[38ch] leading-relaxed text-muted">
              {data.form.successBody}
            </p>
          </div>
        ) : null}
        {status === "error" ? (
          <div className="mt-6">
            <p className="max-w-[38ch] leading-relaxed text-muted">
              {data.form.errorBody}
            </p>
            <a
              href={`mailto:${data.email}`}
              data-cursor="link"
              className="mono-nums mt-2 inline-block break-all lowercase text-fg underline-offset-4 hover:underline"
            >
              {data.email}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
