import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const eventSchema = z.object({
  event: z.string().min(1),
  data: z
    .object({
      reference: z.string().max(200).optional(),
      id: z.string().max(200).optional(),
      metadata: z.object({ reference: z.string().max(200).optional() }).partial().optional(),
    })
    .partial(),
});

export const Route = createFileRoute("/api/public/snippe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const { verifySnippeWebhook } = await import("@/lib/snippe.server");

        if (!verifySnippeWebhook(rawBody, request.headers.get("x-webhook-signature"))) {
          return new Response("Invalid signature", { status: 401 });
        }

        let parsed: z.infer<typeof eventSchema>;
        try {
          parsed = eventSchema.parse(JSON.parse(rawBody));
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        if (parsed.event !== "payment.completed") {
          return new Response("ignored", { status: 200 });
        }

        const orderId =
          parsed.data.metadata?.reference ?? parsed.data.reference ?? parsed.data.id ?? null;
        if (!orderId) return new Response("Missing reference", { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin
          .from("orders")
          .update({ status: "completed" })
          .eq("id", orderId)
          .eq("status", "pending");

        if (error) {
          console.error("[snippe-webhook] order update failed", error.message);
          return new Response("Could not update order", { status: 500 });
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
