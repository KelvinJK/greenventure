import { createHmac, timingSafeEqual } from "crypto";

/**
 * All Snippe.sh specifics live in this one server-only module so the API surface
 * can be adjusted in a single place. Credentials are read at call time and never
 * reach the browser.
 */
const SNIPPE_API_BASE = "https://api.snippe.sh/v1";

export type SnippeLineItem = {
  name: string;
  amount_tzs: number;
  quantity: number;
};

export type SnippeSessionInput = {
  reference: string;
  amountTzs: number;
  description: string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  items: SnippeLineItem[];
  successUrl: string;
  cancelUrl: string;
};

export type SnippeSessionResult =
  | { status: "ok"; checkoutUrl: string; paymentReference: string | null }
  | { status: "not_configured" }
  | { status: "error"; message: string };

export function isSnippeConfigured(): boolean {
  return Boolean(process.env.SNIPPE_API_KEY);
}

export async function createSnippeSession(
  input: SnippeSessionInput,
): Promise<SnippeSessionResult> {
  const apiKey = process.env.SNIPPE_API_KEY;
  if (!apiKey) return { status: "not_configured" };

  try {
    const response = await fetch(`${SNIPPE_API_BASE}/payment-sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reference: input.reference,
        currency: "TZS",
        amount: input.amountTzs,
        description: input.description,
        method: "mobile_money",
        customer: {
          name: input.customerName ?? undefined,
          email: input.customerEmail ?? undefined,
          phone: input.customerPhone ?? undefined,
        },
        line_items: input.items.map((item) => ({
          name: item.name,
          amount: item.amount_tzs,
          quantity: item.quantity,
        })),
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[snippe] session create failed", response.status, detail);
      return { status: "error", message: "The payment provider rejected this request." };
    }

    const payload = (await response.json()) as {
      checkout_url?: string;
      id?: string;
      reference?: string;
    };

    if (!payload.checkout_url) {
      console.error("[snippe] session response missing checkout_url");
      return { status: "error", message: "The payment provider returned no checkout link." };
    }

    return {
      status: "ok",
      checkoutUrl: payload.checkout_url,
      paymentReference: payload.id ?? payload.reference ?? null,
    };
  } catch (error) {
    console.error("[snippe] session create threw", error);
    return { status: "error", message: "Could not reach the payment provider." };
  }
}

export function verifySnippeWebhook(rawBody: string, signature: string | null): boolean {
  const secret = process.env.SNIPPE_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = signature.replace(/^sha256=/, "").trim();

  const a = Buffer.from(received, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
