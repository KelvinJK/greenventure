import { createPublicSupabase } from "./catalog.server";
import { createSnippeSession } from "./snippe.server";

export type CheckoutCartItem = { slug: string; quantity: number };

export type CheckoutCustomer = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type CheckoutResult =
  | { status: "ok"; orderId: string; checkoutUrl: string }
  | { status: "not_configured"; orderId: string; totalTzs: number }
  | { status: "error"; message: string };

function siteOrigin(requestUrl: string): string {
  return new URL(requestUrl).origin;
}

/**
 * Creates a pending order (prices always re-read from the database, never
 * trusted from the browser) and then asks Snippe for a hosted checkout URL.
 */
export async function startShopCheckout(
  items: CheckoutCartItem[],
  customer: CheckoutCustomer,
  requestUrl: string,
): Promise<CheckoutResult> {
  if (items.length === 0) return { status: "error", message: "Your cart is empty." };

  const publicClient = createPublicSupabase();
  const { data: products, error: productsError } = await publicClient
    .from("products")
    .select("id, slug, name, price_tzs")
    .in(
      "slug",
      items.map((item) => item.slug),
    );

  if (productsError) return { status: "error", message: productsError.message };
  if (!products || products.length === 0) {
    return { status: "error", message: "None of those products could be found." };
  }

  const lines = items
    .map((item) => {
      const product = products.find((candidate) => candidate.slug === item.slug);
      if (!product) return null;
      const quantity = Math.max(1, Math.min(999, Math.round(item.quantity)));
      return { product, quantity };
    })
    .filter((line): line is { product: (typeof products)[number]; quantity: number } =>
      Boolean(line),
    );

  if (lines.length === 0) return { status: "error", message: "Your cart is empty." };

  const totalTzs = lines.reduce((sum, line) => sum + line.product.price_tzs * line.quantity, 0);
  const description = `Green Venture order — ${lines.length} product${lines.length > 1 ? "s" : ""}`;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      order_type: "shop",
      customer_name: customer.name ?? null,
      customer_email: customer.email ?? null,
      customer_phone: customer.phone ?? null,
      description,
      total_tzs: totalTzs,
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { status: "error", message: orderError?.message ?? "Could not create the order." };
  }

  const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
    lines.map((line) => ({
      order_id: order.id,
      product_id: line.product.id,
      product_name: line.product.name,
      unit_price_tzs: line.product.price_tzs,
      quantity: line.quantity,
    })),
  );
  if (itemsError) return { status: "error", message: itemsError.message };

  const origin = siteOrigin(requestUrl);
  const session = await createSnippeSession({
    reference: order.id,
    amountTzs: totalTzs,
    description,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    items: lines.map((line) => ({
      name: line.product.name,
      amount_tzs: line.product.price_tzs,
      quantity: line.quantity,
    })),
    successUrl: `${origin}/success?order=${order.id}`,
    cancelUrl: `${origin}/cart`,
  });

  if (session.status === "not_configured") {
    return { status: "not_configured", orderId: order.id, totalTzs };
  }
  if (session.status === "error") {
    return { status: "error", message: session.message };
  }

  await supabaseAdmin
    .from("orders")
    .update({ checkout_url: session.checkoutUrl, payment_reference: session.paymentReference })
    .eq("id", order.id);

  return { status: "ok", orderId: order.id, checkoutUrl: session.checkoutUrl };
}

export async function startDonationCheckout(
  amountTzs: number,
  tierName: string,
  customer: CheckoutCustomer,
  requestUrl: string,
): Promise<CheckoutResult> {
  const amount = Math.round(amountTzs);
  if (!Number.isFinite(amount) || amount < 1000) {
    return { status: "error", message: "Please enter a donation of at least TZS 1,000." };
  }

  const description = `Donation — ${tierName}`;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .insert({
      order_type: "donation",
      customer_name: customer.name ?? null,
      customer_email: customer.email ?? null,
      customer_phone: customer.phone ?? null,
      description,
      total_tzs: amount,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !order) {
    return { status: "error", message: error?.message ?? "Could not record the donation." };
  }

  const origin = siteOrigin(requestUrl);
  const session = await createSnippeSession({
    reference: order.id,
    amountTzs: amount,
    description,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    items: [{ name: description, amount_tzs: amount, quantity: 1 }],
    successUrl: `${origin}/success?order=${order.id}`,
    cancelUrl: `${origin}/donate`,
  });

  if (session.status === "not_configured") {
    return { status: "not_configured", orderId: order.id, totalTzs: amount };
  }
  if (session.status === "error") {
    return { status: "error", message: session.message };
  }

  await supabaseAdmin
    .from("orders")
    .update({ checkout_url: session.checkoutUrl, payment_reference: session.paymentReference })
    .eq("id", order.id);

  return { status: "ok", orderId: order.id, checkoutUrl: session.checkoutUrl };
}

export async function fetchOrderSummary(orderId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id, order_type, description, total_tzs, status, created_at")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return null;

  const { data: items } = await supabaseAdmin
    .from("order_items")
    .select("product_name, unit_price_tzs, quantity")
    .eq("order_id", orderId);

  return { order, items: items ?? [] };
}
