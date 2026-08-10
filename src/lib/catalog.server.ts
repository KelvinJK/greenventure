import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Publishable-key client for public, read-only catalogue reads during SSR.
 * Products and donation tiers have narrow `TO anon` SELECT policies.
 */
export function createPublicSupabase() {
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const url =
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured on the server (missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY).",
    );
  }


  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

const PRODUCT_COLUMNS =
  "id, slug, name, category, price_tzs, unit, short_description, long_description, image_key, sort_order";

export async function fetchProducts() {
  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchProductBySlug(slug: string) {
  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchDonationTiers() {
  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("donation_tiers")
    .select("id, slug, name, amount_tzs, is_custom, description, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}
