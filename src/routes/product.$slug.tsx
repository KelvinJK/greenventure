import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { formatQuantity, formatTzs, isPerMetre, snapMetres } from "@/lib/format";
import { productQuery, type Product } from "@/lib/catalog-queries";
import { productImage } from "@/lib/product-images";
import { CoverageCalculator } from "@/components/site/CoverageCalculator";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    return { name: (product as Product).name, summary: (product as Product).short_description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable | Green Venture Tanzania" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} | Green Venture Tanzania`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.summary },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: ProductNotFound,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const product = data as Product;
  const { addLine } = useCart();
  const perMetre = isPerMetre(product.unit);
  const step = perMetre ? 0.5 : 1;
  const clampQuantity = (value: number) =>
    perMetre ? snapMetres(value) : Math.min(999, Math.max(1, Math.round(value)));
  const [quantity, setQuantity] = useState(perMetre ? 3 : 1);
  const [metresText, setMetresText] = useState(perMetre ? "3" : "1");

  useEffect(() => {
    if (perMetre) setMetresText(String(quantity));
  }, [perMetre, quantity]);

  const image = productImage(product.image_key);
  const paragraphs = product.long_description.split("\n\n").filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/shop" className="hover:text-primary">
          Shop
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <Link to="/shop" search={{ category: product.category }} className="hover:text-primary">
          {product.category}
        </Link>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div>
          <img
            src={image}
            alt={product.name}
            width={1200}
            height={900}
            className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
          />
          <div className="mt-4 grid grid-cols-3 gap-4">
            {["Full board", "Surface detail", "In situ"].map((label) => (
              <figure key={label} className="overflow-hidden rounded-md border border-border">
                <img
                  src={image}
                  alt={`${product.name}: ${label}`}
                  loading="lazy"
                  width={600}
                  height={450}
                  className="aspect-[4/3] w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {product.category}
          </p>
          <h1 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight">
            {product.name}
          </h1>
          <p className="mt-5 font-display text-3xl text-primary">
            {formatTzs(product.price_tzs)}{" "}
            <span className="font-sans text-sm font-semibold text-muted-foreground">
              {product.unit}
            </span>
          </p>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-semibold">
                {perMetre ? "Metres needed" : "Quantity"}
              </span>
              <div className="flex items-center rounded-md border border-input">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-11"
                  aria-label={perMetre ? "Decrease metres" : "Decrease quantity"}
                  onClick={() => setQuantity((value) => clampQuantity(value - step))}
                >
                  <Minus className="size-4" aria-hidden="true" />
                </Button>
                {perMetre ? (
                  <Input
                    type="number"
                    inputMode="decimal"
                    step={0.5}
                    min={0.5}
                    max={999}
                    aria-label="Metres needed"
                    value={metresText}
                    onChange={(event) => {
                      setMetresText(event.target.value);
                      const parsed = Number.parseFloat(event.target.value.replace(",", "."));
                      if (Number.isFinite(parsed) && parsed > 0) setQuantity(clampQuantity(parsed));
                    }}
                    onBlur={() => setMetresText(String(quantity))}
                    className="h-11 w-24 border-0 text-center text-sm font-semibold shadow-none focus-visible:ring-0"
                  />
                ) : (
                  <span className="w-12 text-center text-sm font-semibold" aria-live="polite">
                    {quantity}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-11"
                  aria-label={perMetre ? "Increase metres" : "Increase quantity"}
                  onClick={() => setQuantity((value) => clampQuantity(value + step))}
                >
                  <Plus className="size-4" aria-hidden="true" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground" aria-live="polite">
                = {formatTzs(product.price_tzs * quantity)}
              </span>

            </div>
            {perMetre && (
              <p className="mt-2 text-xs text-muted-foreground">
                Sold by the running metre in half metre steps. Boards are supplied in 3 m lengths and
                cut to your measurement on request.
              </p>
            )}
          </div>

          <Button
            className="mt-6 h-12 w-full bg-brand-accent text-base text-brand-accent-foreground hover:bg-brand-accent/85"
            onClick={() => {
              addLine(
                {
                  slug: product.slug,
                  name: product.name,
                  priceTzs: product.price_tzs,
                  unit: product.unit,
                  imageKey: product.image_key,
                },
                quantity,
              );
              toast.success(
                `${formatQuantity(quantity, product.unit)} of ${product.name} added to your cart`,
              );
            }}
          >
            {perMetre ? `Add ${formatQuantity(quantity, product.unit)} to Cart` : "Add to Cart"}
          </Button>


          <Link
            to="/contact"
            className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Request Custom Quote for bulk orders
          </Link>

          {product.category !== "Furniture" && <CoverageCalculator product={product} />}
        </div>
      </div>
    </div>
  );
}

function ProductNotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-3xl">We couldn't find that product</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        It may have been renamed or retired from the catalogue.
      </p>
      <Button asChild className="mt-8 h-11 px-6">
        <Link to="/shop">Back to the shop</Link>
      </Button>
    </div>
  );
}
