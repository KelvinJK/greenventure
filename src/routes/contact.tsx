import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitQuoteRequest } from "@/lib/quote.functions";
import { PhoneField } from "@/components/site/PhoneField";
import { QuoteEstimator } from "@/components/site/QuoteEstimator";
import { productsQuery, type Product } from "@/lib/catalog-queries";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Get a Quote | Green Venture Tanzania" },
      {
        name: "description",
        content:
          "Request a custom quote for recycled plastic decking, furniture, fencing or structural lumber anywhere in Tanzania.",
      },
      { property: "og:title", content: "Get a Quote | Green Venture Tanzania" },
      {
        property: "og:description",
        content: "Tell us about your project and we'll price it in Tanzanian shillings.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const sendQuote = useServerFn(submitQuoteRequest);
  const [message, setMessage] = useState("");
  const { data } = useSuspenseQuery(productsQuery);
  const products = data as Product[];

  function applyEstimate(summary: string) {
    setMessage((current) => {
      const body = current.trim();
      const next = body ? `${body}\n\n${summary}` : summary;
      return next.slice(0, 4000);
    });
    document.getElementById("contact-message")?.scrollIntoView({ behavior: "smooth", block: "center" });
    toast.success("Estimate added to your request. Add any extra details and send it.");
  }

  return (
    <>
    <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_20rem] lg:px-8 lg:py-24">
      <div>
        <h1 className="font-display text-[clamp(1.85rem,4.5vw,3rem)] leading-tight">
          Get a custom quote
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Tell us the project, the rough quantities and where it is. We price in Tanzanian shillings,
          including delivery, and we can cut profiles to length before dispatch.
        </p>

        <div className="max-w-2xl">
          <QuoteEstimator products={products} onUseEstimate={applyEstimate} />
        </div>

        <form
          className="mt-10 max-w-2xl space-y-5"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const values = new FormData(form);
            setSending(true);
            try {
              await sendQuote({
                data: {
                  name: String(values.get("name") ?? ""),
                  company: String(values.get("company") ?? ""),
                  email: String(values.get("email") ?? ""),
                  phone: String(values.get("phone") ?? ""),
                  message: String(values.get("message") ?? ""),
                },
              });
              setSent(true);
              form.reset();
              setMessage("");
              toast.success("Thanks, we'll be in touch within one working day.");
            } catch {
              toast.error("We couldn't send that. Please call or email us directly.");
            } finally {
              setSending(false);
            }
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" name="name" required className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="contact-company">Company (optional)</Label>
              <Input id="contact-company" name="company" className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                className="mt-1.5 h-11"
              />
            </div>
            <PhoneField />
          </div>
          <div>
            <Label htmlFor="contact-message">Project details</Label>
            <Textarea
              id="contact-message"
              name="message"
              required
              rows={8}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mt-1.5"
              placeholder="e.g. 120 m² of decking for a lodge terrace in Bagamoyo, needed in October."
            />
          </div>
          <Button type="submit" disabled={sending} className="h-12 px-7 text-base">
            {sending ? "Sending..." : sent ? "Request sent" : "Request my quote"}
          </Button>
        </form>

      </div>

      <aside className="h-fit rounded-lg border border-border bg-offwhite p-6">
        <h2 className="font-display text-lg">Reach us directly</h2>
        <ul className="mt-5 space-y-4 text-sm">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <a
              href="https://www.google.com/maps/search/?api=1&query=Green%20Venture%20Limited%2C%20Njiro%20Road%2C%20Arusha%2C%20Tanzania"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              Njiro Road, Arusha, Tanzania
            </a>
          </li>
          <li className="flex gap-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <a href="tel:+255748576025" className="text-muted-foreground hover:text-primary">
              (+255) 748 576 025
            </a>
          </li>
          <li className="flex gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <a
              href="mailto:greenventuretanzania@gmail.com"
              className="break-all text-muted-foreground hover:text-primary"
            >
              greenventuretanzania@gmail.com
            </a>
          </li>
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Bulk and tender enquiries are answered within one working day, Mon to Sat, 8:00 to 18:00 EAT.
        </p>
      </aside>
    </div>

    <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <h2 className="font-display text-xl">Find us on the map</h2>
      <div className="mt-5 overflow-hidden rounded-lg border border-border shadow-sm">
        <iframe
          title="Green Venture Limited location map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4465.067639512589!2d36.702333575481795!3d-3.4042227416100395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x183705c1e74a1519%3A0xbef03e52de12e3dd!2sGreen%20Venture%20Limited!5e1!3m2!1sen!2stz!4v1785453308829!5m2!1sen!2stz"
          width="100%"
          height="380"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="block h-[260px] w-full sm:h-[340px] lg:h-[380px]"
        />
      </div>
    </section>
    </>
  );
}
