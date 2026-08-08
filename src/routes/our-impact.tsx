import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { donationTiersQuery } from "@/lib/catalog-queries";
import { createDonationCheckoutSession } from "@/lib/checkout.functions";
import { formatTzs } from "@/lib/format";
import classroomImage from "@/assets/donate-classroom.jpg";

type DonationTier = {
  id: string;
  slug: string;
  name: string;
  amount_tzs: number | null;
  is_custom: boolean;
  description: string;
};

export const Route = createFileRoute("/our-impact")({
  head: () => ({
    meta: [
      { title: "Donate a Desk | Green Venture Tanzania" },
      {
        name: "description",
        content:
          "Every desk donated recycles plastic waste and equips a Tanzanian classroom. Give one desk, a classroom set, or partner with us.",
      },
      { property: "og:title", content: "Every Desk Donated Recycles Plastic and Educates a Child" },
      {
        property: "og:description",
        content: "Fund indestructible recycled-plastic desks for Tanzanian schools.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(donationTiersQuery),
  component: DonatePage,
});

function DonatePage() {
  const { data } = useSuspenseQuery(donationTiersQuery);
  const tiers = data as DonationTier[];
  const startDonation = useServerFn(createDonationCheckoutSession);

  const [selected, setSelected] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donor, setDonor] = useState({ name: "", email: "", phone: "" });
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const tier = tiers.find((candidate) => candidate.slug === selected) ?? null;
  const amount = tier?.is_custom ? Number(customAmount.replace(/[^\d]/g, "")) : (tier?.amount_tzs ?? 0);

  async function handleDonate() {
    if (!tier) return;
    if (!Number.isFinite(amount) || amount < 1000) {
      toast.error("Please enter a donation of at least TZS 1,000.");
      return;
    }

    setPending(true);
    setNotice(null);
    try {
      const result = await startDonation({
        data: {
          amountTzs: amount,
          tierName: tier.name,
          customer: {
            name: donor.name || null,
            email: donor.email || null,
            phone: donor.phone || null,
          },
        },
      });

      if (result.status === "ok") {
        window.location.href = result.checkoutUrl;
        return;
      }
      if (result.status === "not_configured") {
        setNotice(
          `Thank you, your ${formatTzs(result.totalTzs)} pledge is recorded. Mobile money checkout isn't switched on yet; add the Snippe credentials and this button will take you straight to payment.`,
        );
        return;
      }
      toast.error(result.message);
    } catch {
      toast.error("Something went wrong starting your donation. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <section className="relative flex min-h-[62svh] items-center overflow-hidden">
        <img
          src={classroomImage}
          alt="Tanzanian schoolchildren at their desks in a bright classroom"
          width={1600}
          height={900}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/55" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="deck-fade-up max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.24em] text-charcoal-foreground/80 uppercase">
              The desk programme
            </p>
            <h1 className="mt-5 font-display text-[clamp(1.85rem,5.5vw,3.5rem)] leading-[1.08] text-charcoal-foreground">
              Every Desk Donated Recycles Plastic and Educates a Child.
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-base leading-relaxed text-muted-foreground">
            Across Tanzania, children share broken timber desks that termites and rain destroy within
            a few years. We press collected plastic waste into desks that cannot rot, splinter or be
            eaten, and we deliver them to the schools that need them most. Each desk keeps roughly
            sixty kilograms of plastic out of waterways and landfill, and it will still be in that
            classroom decades from now.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((option) => {
            const active = selected === option.slug;
            return (
              <button
                key={option.slug}
                type="button"
                onClick={() => setSelected(option.slug)}
                aria-pressed={active}
                className={`flex min-h-11 flex-col rounded-lg border p-6 text-left transition-shadow duration-300 ${
                  active
                    ? "border-primary bg-primary/5 shadow-card-hover"
                    : "border-border bg-card shadow-card hover:shadow-card-hover"
                }`}
              >
                <h2 className="font-display text-lg">{option.name}</h2>
                <p className="mt-2 font-display text-2xl text-primary">
                  {option.is_custom ? "Custom amount" : formatTzs(option.amount_tzs ?? 0)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        {tier && (
          <div className="mt-10 max-w-xl rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-lg">{tier.name}</h2>

            {tier.is_custom && (
              <div className="mt-4">
                <Label htmlFor="donate-amount">Donation amount (TZS)</Label>
                <Input
                  id="donate-amount"
                  inputMode="numeric"
                  placeholder="5,000,000"
                  className="mt-1.5 h-11"
                  value={customAmount}
                  onChange={(event) => setCustomAmount(event.target.value)}
                />
              </div>
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="donate-name">Your name</Label>
                <Input
                  id="donate-name"
                  className="mt-1.5 h-11"
                  value={donor.name}
                  onChange={(event) => setDonor({ ...donor, name: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="donate-phone">Mobile money number</Label>
                <Input
                  id="donate-phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="+255 700 000 000"
                  className="mt-1.5 h-11"
                  value={donor.phone}
                  onChange={(event) => setDonor({ ...donor, phone: event.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="donate-email">Email (for your receipt)</Label>
                <Input
                  id="donate-email"
                  type="email"
                  className="mt-1.5 h-11"
                  value={donor.email}
                  onChange={(event) => setDonor({ ...donor, email: event.target.value })}
                />
              </div>
            </div>

            <Button
              className="mt-6 h-12 w-full px-6 text-base"
              onClick={handleDonate}
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Preparing payment…
                </>
              ) : (
                "Donate Now"
              )}
            </Button>

            {notice && (
              <p className="mt-4 rounded-md bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
                {notice}
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
