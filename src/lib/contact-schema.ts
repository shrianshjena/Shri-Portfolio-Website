import { z } from "zod";

/*
 * Shared contact-form validation. The client (ContactForm) validates before
 * POSTing and the API route re-validates server-side against the exact same
 * schema. strictObject rejects unexpected fields; `website` is a honeypot
 * that must be the empty string for human submissions.
 */

export const FIELD_LIMITS = {
  name: 100,
  email: 200,
  message: 2000,
} as const;

export const contactSchema = z.strictObject({
  name: z.string().trim().min(1).max(FIELD_LIMITS.name),
  email: z.email().max(FIELD_LIMITS.email),
  message: z.string().trim().min(1).max(FIELD_LIMITS.message),
  website: z.literal(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
