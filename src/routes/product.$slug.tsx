import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatTzs } from "@/lib/format";
import { productQuery, type Product } from "@/lib/catalog-queries";
import { productImage } from "@/lib/product-images";

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
  const [quantity, setQuantity] = useState(1);

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

          <div className="mt-8 flex items-center gap-4">
            <span className="text-sm font-semibold">Quantity</span>
            <div className="flex items-center rounded-md border border-input">
              <Button
                variant="ghost"
                size="icon"
                className="size-11"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <Minus className="size-4" aria-hidden="true" />
              </Button>
              <span className="w-12 text-center text-sm font-semibold" aria-live="polite">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-11"
                aria-label="Increase quantity"
                onClick={() => setQuantity((value) => Math.min(999, value + 1))}
              >
                <Plus className="size-4" aria-hidden="true" />
              </Button>
            </div>
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
              toast.success(`${quantity} × ${product.name} added to your cart`);
            }}
          >
            Add to Cart
          </Button>

          <Link
            to="/contact"
            className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Request Custom Quote for bulk orders
          </Link>
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
