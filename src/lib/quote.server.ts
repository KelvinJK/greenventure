export type QuoteRequestInput = {
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string;
};

export async function saveQuoteRequest(input: QuoteRequestInput) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin
    .from("quote_requests")
    .insert({
      name: input.name,
      company: input.company,
      email: input.email,
      phone: input.phone,
      message: input.message,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  return { id: data.id as string };
}
