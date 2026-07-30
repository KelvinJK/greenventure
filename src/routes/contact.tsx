import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_20rem] lg:px-8 lg:py-24">
      <div>
        <h1 className="font-display text-[clamp(1.85rem,4.5vw,3rem)] leading-tight">
          Get a custom quote
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Tell us the project, the rough quantities and where it is. We price in Tanzanian shillings,
          including delivery, and we can cut profiles to length before dispatch.
        </p>

        <form
          className="mt-10 max-w-2xl space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
            toast.success("Thanks — we'll be in touch within one working day.");
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" required className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="contact-company">Company (optional)</Label>
              <Input id="contact-company" className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" required className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="contact-phone">Phone</Label>
              <Input id="contact-phone" type="tel" inputMode="tel" className="mt-1.5 h-11" />
            </div>
          </div>
          <div>
            <Label htmlFor="contact-message">Project details</Label>
            <Textarea
              id="contact-message"
              required
              rows={6}
              className="mt-1.5"
              placeholder="e.g. 120 m² of decking for a lodge terrace in Bagamoyo, needed in October."
            />
          </div>
          <Button type="submit" className="h-12 px-7 text-base">
            {sent ? "Request sent" : "Request my quote"}
          </Button>
        </form>
      </div>

      <aside className="h-fit rounded-lg border border-border bg-offwhite p-6">
        <h2 className="font-display text-lg">Reach us directly</h2>
        <ul className="mt-5 space-y-4 text-sm">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-muted-foreground">Dar es Salaam, Tanzania</span>
          </li>
          <li className="flex gap-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <a href="tel:+255700000000" className="text-muted-foreground hover:text-primary">
              +255 700 000 000
            </a>
          </li>
          <li className="flex gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <a href="mailto:hello@greenventure.co.tz" className="text-muted-foreground hover:text-primary">
              hello@greenventure.co.tz
            </a>
          </li>
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Bulk and tender enquiries are answered within one working day, Mon – Sat, 8:00 – 18:00 EAT.
        </p>
      </aside>
    </div>
  );
}
