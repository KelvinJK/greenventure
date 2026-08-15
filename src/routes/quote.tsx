import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { PageIntro } from "@/components/site/PageIntro";
import { PhoneField } from "@/components/site/PhoneField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitQuoteRequest } from "@/lib/quote.functions";
import {
  collectionNote,
  installationOptions,
  productPages,
  quantityUnits,
  whatsappHref,
} from "@/lib/site-content";

const searchSchema = z.object({ product: z.string().optional() });

export const Route = createFileRoute("/quote")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Request a quote — Green Venture Limited" },
      {
        name: "description",
        content:
          "Request a written quotation for recycled plastic lumber, decking, panels, cladding or furniture from Green Venture Limited, Arusha.",
      },
      { property: "og:title", content: "Request a quote — Green Venture Limited" },
      {
        property: "og:description",
        content: "Tell us the product, quantity and location. We reply within two working days.",
      },
      { property: "og:url", content: "https://greenventure.lovable.app/quote" },
    ],
    links: [{ rel: "canonical", href: "https://greenventure.lovable.app/quote" }],
  }),
  component: QuotePage,
});

const productOptions = productPages.map((page) => page.title);

async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function QuotePage() {
  const { product } = Route.useSearch();
  const preselected = productPages.find((page) => page.slug === product)?.title ?? "";

  const [selectedProduct, setSelectedProduct] = useState(preselected);
  const [unit, setUnit] = useState<string>(quantityUnits[0]);
  const [installation, setInstallation] = useState<string>(installationOptions[2]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    try {
      const file = form.get("drawing");
      let drawing: { name: string; contentBase64: string; contentType: string } | null = null;
      if (file instanceof File && file.size > 0) {
        if (file.size > 5 * 1024 * 1024) throw new Error("Please keep drawings under 5 MB.");
        drawing = {
          name: file.name,
          contentBase64: await fileToBase64(file),
          contentType: file.type || "application/octet-stream",
        };
      }

      const quantityRaw = String(form.get("quantity") ?? "").trim();
      const result = await submitQuoteRequest({
        data: {
          name: String(form.get("name") ?? "").trim(),
          company: String(form.get("company") ?? "").trim() || null,
          email: String(form.get("email") ?? "").trim(),
          phone: String(form.get("phone") ?? "").trim() || null,
          location: String(form.get("location") ?? "").trim() || null,
          product: selectedProduct || null,
          quantity: quantityRaw ? Number(quantityRaw) : null,
          quantityUnit: quantityRaw ? unit : null,
          installation,
          timeline: String(form.get("timeline") ?? "").trim() || null,
          message: String(form.get("message") ?? "").trim() || null,
          drawing,
        },
      });
      setReference(result.reference);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <>
        <PageIntro eyebrow="Quote request" title="Request received" />
        <section className="section">
          <div className="shell max-w-2xl">
            <p className="eyebrow text-green">Your reference</p>
            <p className="mt-3 font-display text-4xl md:text-5xl">{reference}</p>
            <p className="mt-6 text-lg">
              Green Venture will respond within two working days with a written quotation.
            </p>
            <p className="mt-4 text-muted-foreground">{collectionNote}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="h-12 rounded-none px-6">
                <Link to="/payment">Payment details</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-none px-6">
                <Link to="/order-status">Check order status</Link>
              </Button>
              <Button asChild variant="ghost" className="h-12 rounded-none px-6">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Message on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageIntro
        eyebrow="Quote request"
        title="Request a quote"
        lead="Tell us what you are building. We reply within two working days with a written quotation."
      />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={onSubmit} className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required maxLength={120} className="h-12 rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" maxLength={160} className="h-12 rounded-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  className="h-12 rounded-none"
                />
              </div>
              <PhoneField id="quote-phone" label="Phone (WhatsApp)" />
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Town, region or camp name"
                  maxLength={200}
                  className="h-12 rounded-none"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="product">Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger id="product" className="h-12 rounded-none">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {productOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex gap-2">
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="0.5"
                    inputMode="decimal"
                    className="h-12 rounded-none"
                  />
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger aria-label="Quantity unit" className="h-12 w-36 rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {quantityUnits.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="installation">Installation required</Label>
                <Select value={installation} onValueChange={setInstallation}>
                  <SelectTrigger id="installation" className="h-12 rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {installationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="timeline">Project timeline</Label>
                <Input
                  id="timeline"
                  name="timeline"
                  placeholder="e.g. within three months"
                  maxLength={200}
                  className="h-12 rounded-none"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={5} maxLength={4000} className="rounded-none" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="drawing">Drawings (optional)</Label>
              <Input
                id="drawing"
                name="drawing"
                type="file"
                accept=".pdf,.dwg,.png,.jpg,.jpeg"
                className="h-12 rounded-none py-2.5"
              />
              <p className="text-xs text-muted-foreground">PDF, DWG or image, up to 5 MB.</p>
            </div>

            {error && <p className="text-sm font-semibold text-destructive">{error}</p>}

            <Button type="submit" disabled={submitting} className="h-12 w-full rounded-none sm:w-auto sm:px-8">
              {submitting ? "Sending…" : "Send request"}
            </Button>
          </form>

          <aside className="h-fit border border-border bg-card p-6">
            <h2 className="font-display text-2xl">Before you send</h2>
            <p className="mt-4 text-sm text-muted-foreground">{collectionNote}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Prices are quoted in Tanzanian Shillings and exclude 18% VAT.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Prices are indicative and subject to confirmation on a written quotation.
            </p>
            <Button asChild variant="outline" className="mt-6 h-12 w-full rounded-none">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                Ask on WhatsApp
              </a>
            </Button>
          </aside>
        </div>
      </section>
    </>
  );
}
