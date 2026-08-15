import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";

import { PageIntro } from "@/components/site/PageIntro";
import { Photo } from "@/components/site/Photo";
import { collectionNote, productPages, vatNote } from "@/lib/site-content";

export const Route = createFileRoute("/products")({
  component: ProductsLayout,
});

function ProductsLayout() {
  return <Outlet />;
}

export function ProductsOverview() {
  return (
    <>
      <PageIntro
        eyebrow="Products"
        title="The range"
        lead="Solid profiles extruded in Arusha from 100% post-consumer recycled HDPE. Lumber, decking, panels, cladding, furniture and made-to-drawing work."
      />

      <section className="section">
        <div className="shell grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {productPages.map((product) => (
            <Link
              key={product.slug}
              to="/products/$slug"
              params={{ slug: product.slug }}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
            >
              <Photo
                src={product.photo.src}
                shot={product.photo.shot}
                ratio={product.photo.ratio}
                alt={product.title}
                className="transition-opacity group-hover:opacity-90"
              />
              <h2 className="mt-5 font-display text-2xl">{product.title}</h2>
              <p className="mt-2 text-muted-foreground">{product.summary}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-green">
                View specification
              </span>
            </Link>
          ))}
        </div>

        <div className="shell mt-14 grid gap-2 border-t border-border pt-8 text-sm text-muted-foreground">
          <p className="font-semibold text-green">{vatNote}</p>
          <p>{collectionNote}</p>
        </div>
      </section>
    </>
  );
}

/** Kept so the layout file has a stable reference for router state helpers. */
export const useProductsPathname = () =>
  useRouterState({ select: (state) => state.location.pathname });
