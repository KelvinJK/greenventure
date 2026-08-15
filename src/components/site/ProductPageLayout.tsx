import { Link } from "@tanstack/react-router";

import { ConfirmBlock } from "@/components/site/ConfirmBlock";
import { Photo } from "@/components/site/Photo";
import { Button } from "@/components/ui/button";
import {
  collectionNote,
  indicativeNote,
  vatNote,
  warranty,
  warrantyExtension,
  type ProductPage,
} from "@/lib/site-content";

/** Shared layout for every /products/* page. */
export function ProductPageLayout({ product }: { product: ProductPage }) {
  return (
    <>
      <section className="border-b border-border">
        <div className="shell grid items-center gap-10 py-12 md:py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-green">Product</p>
            <h1 className="mt-4 text-4xl md:text-6xl">{product.title}</h1>
            <p className="mt-5 text-lg text-muted-foreground">{product.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="h-12 rounded-none px-6">
                <Link to="/quote" search={{ product: product.slug }}>
                  Request a quote
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-none px-6">
                <Link to="/products">All products</Link>
              </Button>
            </div>
          </div>
          <Photo
            src={product.photo.src}
            shot={product.photo.shot}
            ratio={product.photo.ratio}
            priority
            alt={`${product.title} by Green Venture Limited`}
          />
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="max-w-2xl text-lg">{product.description}</p>

            <h2 className="mt-12 font-display text-2xl">Specification</h2>
            <dl className="mt-5 divide-y divide-border border-y border-border">
              {product.specs.map((spec, index) => (
                <div key={`${spec.label}-${index}`} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
                  <dt className="text-sm font-semibold">{spec.label}</dt>
                  <dd className="text-muted-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-12 font-display text-2xl">Warranty</h2>
            <ul className="mt-5 grid gap-2">
              {warranty.map((item) => (
                <li key={item.detail} className="flex gap-3">
                  <span className="w-24 shrink-0 font-semibold">{item.term}</span>
                  <span className="text-muted-foreground">{item.detail}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">{warrantyExtension}</p>
          </div>

          <aside className="h-fit border border-border bg-card p-6">
            <h2 className="font-display text-2xl">Price</h2>
            {product.price && <p className="mt-4 text-lg font-semibold">{product.price}</p>}
            {product.priceConfirm && (
              <p className="mt-4">
                <ConfirmBlock>{product.priceConfirm}</ConfirmBlock>
              </p>
            )}
            {product.priceNote && (
              <p className="mt-3 text-sm text-muted-foreground">{product.priceNote}</p>
            )}
            <p className="mt-4 text-sm font-semibold text-green">{vatNote}</p>
            <p className="mt-3 text-sm text-muted-foreground">{indicativeNote}</p>
            <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
              {collectionNote}
            </p>
            <Button asChild className="mt-6 h-12 w-full rounded-none">
              <Link to="/quote" search={{ product: product.slug }}>
                Request a quote
              </Link>
            </Button>
          </aside>
        </div>
      </section>
    </>
  );
}
