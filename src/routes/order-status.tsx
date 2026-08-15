import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageIntro } from "@/components/site/PageIntro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lookupOrder } from "@/lib/orders.functions";
import type { OrderStatusResult } from "@/lib/orders.server";
import { collectionNote, orderStatuses, whatsappHref } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/order-status")({
  head: () => ({
    meta: [
      { title: "Order status — Green Venture Limited" },
      {
        name: "description",
        content:
          "Enter your GVT reference number to see whether your order is received, in production, ready for collection or collected.",
      },
      { property: "og:title", content: "Order status — Green Venture Limited" },
      {
        property: "og:description",
        content: "Track a Green Venture order with your GVT reference number.",
      },
      { property: "og:url", content: "https://greenventure.lovable.app/order-status" },
    ],
    links: [{ rel: "canonical", href: "https://greenventure.lovable.app/order-status" }],
  }),
  component: OrderStatusPage,
});

function StatusTrack({ status }: { status: string }) {
  const activeIndex = Math.max(0, orderStatuses.indexOf(status as (typeof orderStatuses)[number]));

  return (
    <ol className="mt-8 grid gap-3 sm:grid-cols-4">
      {orderStatuses.map((step, index) => {
        const reached = index <= activeIndex;
        return (
          <li key={step} className="grid gap-2">
            <span
              aria-hidden="true"
              className={cn("block h-1.5", reached ? "bg-green" : "bg-border")}
            />
            <span
              className={cn(
                "text-sm font-semibold",
                reached ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step}
              {index === activeIndex && <span className="sr-only"> (current status)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function OrderStatusPage() {
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderStatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (reference.trim().length < 3) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await lookupOrder({ data: { reference } }));
    } catch {
      setError("We could not check that reference just now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="Order status"
        title="Track your order"
        lead="Enter the reference number from your quotation or order confirmation."
      />

      <section className="section">
        <div className="shell max-w-2xl">
          <form onSubmit={onSubmit} className="grid gap-4 sm:flex sm:items-end">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="reference">Reference number</Label>
              <Input
                id="reference"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="GVT-2608-0001"
                className="h-12 rounded-none"
                autoComplete="off"
              />
            </div>
            <Button type="submit" disabled={loading} className="h-12 rounded-none px-8">
              {loading ? "Checking…" : "Check status"}
            </Button>
          </form>

          {error && <p className="mt-6 text-sm font-semibold text-destructive">{error}</p>}

          {result?.found === true && (
            <div className="mt-10 border border-border bg-card p-6">
              <p className="eyebrow text-green">{result.reference}</p>
              <h2 className="mt-3 font-display text-2xl">{result.clientName ?? "Order"}</h2>
              {result.productSummary && (
                <p className="mt-2 text-muted-foreground">{result.productSummary}</p>
              )}
              <StatusTrack status={result.status} />
              <dl className="mt-8 grid gap-3 text-sm">
                <div className="flex gap-2">
                  <dt className="font-semibold">Status</dt>
                  <dd>{result.status}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold">Last updated</dt>
                  <dd>{new Date(result.lastUpdated).toLocaleDateString("en-GB")}</dd>
                </div>
                {result.notes && (
                  <div className="flex gap-2">
                    <dt className="font-semibold">Notes</dt>
                    <dd>{result.notes}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-6 text-sm text-muted-foreground">{collectionNote}</p>
            </div>
          )}

          {result?.found === false && (
            <div className="mt-10 border border-dashed border-border bg-secondary p-6">
              <h2 className="font-display text-xl">We could not find that reference</h2>
              <p className="mt-3 text-muted-foreground">
                Check the number against your quotation. References look like GVT-2608-0001. If it
                still does not match, message us and we will look it up by hand.
              </p>
              <Button asChild variant="outline" className="mt-5 h-12 rounded-none px-6">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Message on WhatsApp
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
