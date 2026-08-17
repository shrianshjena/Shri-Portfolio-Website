import { RATE_LIMIT } from "@/lib/constants";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";

/*
 * Contact endpoint. Hardening layers, in order: JSON parse guard, honeypot
 * (silent bot success), strict schema validation, per-IP sliding-window rate
 * limit, same-origin check, then relay to Web3Forms with a hard timeout.
 * Internal errors are logged server-side and never echoed to the client.
 */

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const SEND_TIMEOUT_MS = 10_000;
const MAX_TRACKED_KEYS = 500;

/* Sliding-window submission log per client key, capped so it cannot grow
 * unbounded. Module scope persists across requests in one server instance. */
const submissionLog = new Map<string, number[]>();

function success(): Response {
  return Response.json({ ok: true });
}

function failure(status: number, error: string): Response {
  return Response.json({ ok: false, error }, { status });
}

function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first ? first : "unknown";
}

/* Returns null when the request is allowed (and records it), or the number
 * of seconds the client should wait before retrying. */
function takeRateLimitSlot(key: string): number | null {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;
  const recent = (submissionLog.get(key) ?? []).filter(
    (stamp) => stamp > windowStart,
  );

  if (recent.length >= RATE_LIMIT.max) {
    submissionLog.set(key, recent);
    const oldest = recent[0] ?? now;
    return Math.max(1, Math.ceil((oldest + RATE_LIMIT.windowMs - now) / 1000));
  }

  submissionLog.set(key, [...recent, now]);
  if (submissionLog.size > MAX_TRACKED_KEYS) {
    const oldestKey = submissionLog.keys().next().value;
    if (oldestKey !== undefined && oldestKey !== key) {
      submissionLog.delete(oldestKey);
    }
  }
  return null;
}

function isCrossOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin === null) return false;
  try {
    return new URL(origin).host !== new URL(request.url).host;
  } catch {
    return true;
  }
}

async function forwardToWeb3Forms(
  accessKey: string,
  input: ContactInput,
): Promise<Response> {
  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: input.name,
        email: input.email,
        message: input.message,
        subject: `Portfolio contact from ${input.name}`,
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error(`contact: delivery failed with status ${response.status}`);
      return failure(502, "Unable to send");
    }
    return success();
  } catch (error: unknown) {
    console.error("contact: delivery failed", error);
    return failure(502, "Unable to send");
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return failure(400, "Invalid request");
  }

  if (typeof body !== "object" || body === null) {
    return failure(400, "Invalid request");
  }
  const candidate = body as Record<string, unknown>;

  /* Honeypot: humans always submit website === "". Anything else is a bot;
   * answer with a silent success so the bot learns nothing. */
  if (candidate.website !== "") {
    return success();
  }

  const parsed = contactSchema.safeParse(candidate);
  if (!parsed.success) {
    return failure(400, "Invalid request");
  }

  const retryAfterS = takeRateLimitSlot(getClientKey(request));
  if (retryAfterS !== null) {
    return Response.json(
      { ok: false, error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(retryAfterS) } },
    );
  }

  if (isCrossOrigin(request)) {
    return failure(403, "Invalid request");
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.error("contact: WEB3FORMS_ACCESS_KEY is not configured");
    return failure(500, "Unable to send");
  }

  return forwardToWeb3Forms(accessKey, parsed.data);
}
