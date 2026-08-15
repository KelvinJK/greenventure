import { orderStatuses } from "./site-content";

export type OrderStatusResult =
  | {
      found: true;
      reference: string;
      clientName: string | null;
      productSummary: string | null;
      status: string;
      lastUpdated: string;
      notes: string | null;
    }
  | { found: false };

/**
 * Reference lookup. Runs with the service role because the orders table is
 * closed to clients, and returns only the fields the status page displays.
 */
export async function lookupOrderByReference(reference: string): Promise<OrderStatusResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("reference, customer_name, product_summary, status, updated_at, notes")
    .eq("reference", reference.trim().toUpperCase())
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data?.reference) return { found: false };

  const status = orderStatuses.includes(data.status as (typeof orderStatuses)[number])
    ? (data.status as string)
    : orderStatuses[0];

  return {
    found: true,
    reference: data.reference,
    clientName: data.customer_name ?? null,
    productSummary: data.product_summary ?? null,
    status,
    lastUpdated: data.updated_at as string,
    notes: data.notes ?? null,
  };
}
