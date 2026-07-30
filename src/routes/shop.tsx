import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { formatTzs } from "@/lib/format";
import { productsQuery, type Product } from "@/lib/catalog-queries";
import { productImage } from "@/lib/product-images";

const categories = ["Decking", "Furniture", "Fencing", "Lumber"] as const;

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Recycled Plastic Decking, Furniture & Lumber | Green Venture" },
      {
        name: "description",
        content:
          "Browse recycled plastic decking planks, outdoor furniture, fencing slats and structural lumber with prices in TZS.",
      },
      { property: "og:title", content: "Shop | Green Venture Tanzania" },
      {
        property: "og:description",
        content: "Termite-proof, maintenance-free building materials made from Tanzanian plastic waste.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: ShopPage,
});

function ShopPage() {
  const { data } = useSuspenseQuery(productsQuery);
  const products = data as Product[];
  const { category } = Route.useSearch();

  const maxPrice = useMemo(
    () => products.reduce((max, product) => Math.max(max, product.price_tzs), 0),
    [products],
  );
  const [priceCeiling, setPriceCeiling] = useState<number | null>(null);
  const ceiling = priceCeiling ?? maxPrice;

  const visible = products.filter(
    (product) => (!category || product.category === category) && product.price_tzs <= ceiling,
  );

  const filters = (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-sm tracking-[0.14em] uppercase">Categories</h2>
        <ul className="mt-4 space-y-1">
          <li>
            <Link
              to="/shop"
              search={{ category: undefined }}
              className="flex min-h-11 items-center rounded-md px-3 text-sm font-semibold transition-colors hover:bg-muted"
              activeProps={{ className: !category ? "bg-primary/10 text-primary" : "" }}
            >
              All products
            </Link>
          </li>
          {categories.map((name) => (
            <li key={name}>
              <Link
                to="/shop"
                search={{ category: name }}
                className={`flex min-h-11 items-center rounded-md px-3 text-sm font-semibold transition-colors hover:bg-muted ${
                  category === name ? "bg-primary/10 text-primary" : ""
                }`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-display text-sm tracking-[0.14em] uppercase">Price range</h2>
        <p className="mt-3 text-sm text-muted-foreground">Up to {formatTzs(ceiling)}</p>
        <Slider
          className="mt-4"
          min={5000}
          max={maxPrice}
          step={5000}
          value={[ceiling]}
          onValueChange={(value) => setPriceCeiling(value[0])}
          aria-label="Maximum price"
        />
        {priceCeiling !== null && priceCeiling < maxPrice && (
          <Button
            variant="ghost"
            className="mt-3 h-11 px-3 text-sm"
            onClick={() => setPriceCeiling(null)}
          >
            Reset price
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-[clamp(1.85rem,4.5vw,3rem)] leading-tight">
          {category ? `${category}` : "The full catalogue"}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Everything is milled from 100% recycled plastic, cut to length on request, and delivered
          across Tanzania.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">{filters}</aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
            <p className="text-sm text-muted-foreground">{visible.length} products</p>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-11 gap-2 px-4">
                  <SlidersHorizontal className="size-4" aria-hidden="true" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[min(20rem,85vw)] overflow-y-auto">
                <SheetTitle className="px-6 pt-4 text-left font-display">Filters</SheetTitle>
                <div className="p-6">{filters}</div>
              </SheetContent>
            </Sheet>
          </div>

          {visible.length === 0 ? (
            <p className="rounded-lg border border-border bg-muted/50 p-8 text-sm text-muted-foreground">
              No products match those filters yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addLine } = useCart();

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block overflow-hidden">
        <img
          src={productImage(product.image_key)}
          alt={product.name}
          loading="lazy"
          width={1200}
          height={900}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          {product.category}
        </p>
        <h3 className="mt-2 font-display text-base leading-snug">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 font-display text-lg text-primary">
          {formatTzs(product.price_tzs)}{" "}
          <span className="font-sans text-xs font-semibold text-muted-foreground">{product.unit}</span>
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {product.short_description}
        </p>
        <Button
          className="mt-5 h-11 w-full bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/85"
          onClick={() => {
            addLine({
              slug: product.slug,
              name: product.name,
              priceTzs: product.price_tzs,
              unit: product.unit,
              imageKey: product.image_key,
            });
            toast.success(`${product.name} added to your cart`);
          }}
        >
          Add to Cart
        </Button>
      </div>
    </article>
  );
}
