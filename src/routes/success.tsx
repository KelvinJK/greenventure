import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatTzs } from "@/lib/format";
import { getOrderSummary } from "@/lib/checkout.functions";

export const Route = createFileRoute("/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search.order === "string" ? search.order : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Thank You | Green Venture Tanzania" },
      { name: "description", content: "Your Green Venture Tanzania payment is confirmed." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Thank You | Green Venture Tanzania" },
      { property: "og:description", content: "Your order is confirmed." },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { order } = Route.useSearch();
  const fetchSummary = useServerFn(getOrderSummary);

  const { data, isLoading } = useQuery({
    queryKey: ["order-summary", order],
    queryFn: () => fetchSummary({ data: { orderId: order! } }),
    enabled: Boolean(order),
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-[clamp(1.85rem,4.5vw,2.75rem)] leading-tight">
          Thank you
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          We've received your payment. Our team will call you on the number you provided to confirm
          delivery or installation details.
        </p>
      </div>

      {order && (
        <div className="mt-12 rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-lg">Order details</h2>
          {isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading your order…</p>}
          {!isLoading && !data && (
            <p className="mt-4 text-sm text-muted-foreground">
              We couldn't find that order reference. Contact us and we'll track it down.
            </p>
          )}
          {data && (
            <>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Reference</dt>
                  <dd className="font-mono text-xs break-all">{data.order.id}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Description</dt>
                  <dd>{data.order.description}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="capitalize">{data.order.status}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-border pt-3 font-display text-base">
                  <dt>Total</dt>
                  <dd className="text-primary">{formatTzs(data.order.total_tzs)}</dd>
                </div>
              </dl>

              {data.items.length > 0 && (
                <ul className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
                  {data.items.map((item, index) => (
                    <li key={`${item.product_name}-${index}`} className="flex justify-between gap-4">
                      <span>
                        {item.quantity} × {item.product_name}
                      </span>
                      <span className="text-muted-foreground">
                        {formatTzs(item.unit_price_tzs * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild className="h-11 px-6">
          <Link to="/shop">Keep shopping</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 px-6">
          <Link to="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
