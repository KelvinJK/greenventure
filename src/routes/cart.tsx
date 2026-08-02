import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { formatQuantity, formatTzs, isPerMetre, snapMetres } from "@/lib/format";
import { productImage } from "@/lib/product-images";
import { createShopCheckoutSession } from "@/lib/checkout.functions";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Green Venture Tanzania" },
      {
        name: "description",
        content: "Review your recycled plastic decking, furniture and lumber order and pay by mobile money.",
      },
      { property: "og:title", content: "Your Cart | Green Venture Tanzania" },
      { property: "og:description", content: "Checkout securely with mobile money in Tanzanian shillings." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, totalTzs, setQuantity, removeLine } = useCart();
  const startCheckout = useServerFn(createShopCheckoutSession);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });

  async function handleCheckout() {
    setPending(true);
    setNotice(null);
    try {
      const result = await startCheckout({
        data: {
          items: lines.map((line) => ({ slug: line.slug, quantity: line.quantity })),
          customer: {
            name: customer.name || null,
            email: customer.email || null,
            phone: customer.phone || null,
          },
        },
      });

      if (result.status === "ok") {
        window.location.href = result.checkoutUrl;
        return;
      }
      if (result.status === "not_configured") {
        setNotice(
          `Your order for ${formatTzs(result.totalTzs)} has been saved, but mobile money checkout isn't switched on yet. Add the Snippe credentials and this button will take you straight to payment.`,
        );
        return;
      }
      toast.error(result.message);
    } catch {
      toast.error("Something went wrong starting checkout. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="font-display text-[clamp(1.85rem,4.5vw,3rem)] leading-tight">Your cart</h1>

      {lines.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border bg-muted/40 p-10 text-center">
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-6 h-11 px-6">
            <Link to="/shop">Browse the catalogue</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <ul className="space-y-4">
            {lines.map((line) => {
              const perMetre = isPerMetre(line.unit);
              const step = perMetre ? 0.5 : 1;
              const adjust = (next: number) =>
                setQuantity(line.slug, perMetre ? snapMetres(next, 0) : Math.round(next));
              return (
              <li
                key={line.slug}
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center"
              >
                <img
                  src={productImage(line.imageKey)}
                  alt={line.name}
                  loading="lazy"
                  width={200}
                  height={150}
                  className="h-24 w-full rounded-md object-cover sm:w-32"
                />
                <div className="flex-1">
                  <h2 className="font-display text-base">
                    <Link to="/product/$slug" params={{ slug: line.slug }} className="hover:text-primary">
                      {line.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatTzs(line.priceTzs)} {line.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-md border border-input">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-11"
                      aria-label={`Decrease ${line.name}`}
                      onClick={() => adjust(line.quantity - step)}
                    >
                      <Minus className="size-4" aria-hidden="true" />
                    </Button>
                    <span className="w-14 text-center text-sm font-semibold">
                      {formatQuantity(line.quantity, line.unit)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-11"
                      aria-label={`Increase ${line.name}`}
                      onClick={() => adjust(line.quantity + step)}
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                  <p className="w-28 text-right font-display text-sm">
                    {formatTzs(line.priceTzs * line.quantity)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-11 text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${line.name}`}
                    onClick={() => removeLine(line.slug)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </li>
              );
            })}
          </ul>

          <aside className="h-fit rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-lg">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">{formatTzs(totalTzs)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="text-muted-foreground">Quoted on confirmation</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 font-display text-base">
                <dt>Total</dt>
                <dd className="text-primary">{formatTzs(totalTzs)}</dd>
              </div>
            </dl>

            <div className="mt-6 space-y-3">
              <div>
                <Label htmlFor="cart-name">Your name</Label>
                <Input
                  id="cart-name"
                  className="mt-1.5 h-11"
                  value={customer.name}
                  onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cart-phone">Mobile money number</Label>
                <Input
                  id="cart-phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="+255 700 000 000"
                  className="mt-1.5 h-11"
                  value={customer.phone}
                  onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cart-email">Email (for your receipt)</Label>
                <Input
                  id="cart-email"
                  type="email"
                  className="mt-1.5 h-11"
                  value={customer.email}
                  onChange={(event) => setCustomer({ ...customer, email: event.target.value })}
                />
              </div>
            </div>

            <Button
              className="mt-6 h-12 w-full bg-brand-accent text-base text-brand-accent-foreground hover:bg-brand-accent/85"
              onClick={handleCheckout}
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Starting checkout…
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </Button>

            {notice && (
              <p className="mt-4 rounded-md bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
                {notice}
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
