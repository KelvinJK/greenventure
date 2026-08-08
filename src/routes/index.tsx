import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Droplets, Bug, ShieldCheck, Timer, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { productsQuery } from "@/lib/catalog-queries";
import { productImage } from "@/lib/product-images";
const heroVideo = { url: "/media/hero-background-v2.mp4" };
const heroPoster = { url: "/media/hero-poster-v2.jpg" };
const deckingShowcase = { url: "/media/showcase-decking.jpg" };
const furnitureShowcase = { url: "/media/showcase-furniture.jpg" };
const lumberShowcase = { url: "/media/showcase-lumber.jpg" };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Green Venture Tanzania | Recycled Plastic Decking & Lumber" },
      {
        name: "description",
        content:
          "Termite-proof, weatherproof decking, furniture and structural lumber made from Tanzanian plastic waste. Built to last 50+ years, maintenance free.",
      },
      { property: "og:title", content: "Sustainable Outdoor Living, Built to Last 50+ Years" },
      {
        property: "og:description",
        content:
          "Green Venture Tanzania transforms plastic waste into premium decking, furniture and fencing.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: HomePage,
});

const showcase = [
  {
    title: "Weatherproof Decking",
    image: deckingShowcase.url,
    alt: "Charcoal recycled plastic decking boards on a tropical terrace",
    category: "Decking",
    cta: "View Planks",
    copy: "Solid boards that never splinter, warp or need sealing, laid on hotel terraces, pool surrounds and family courtyards.",
  },
  {
    title: "Durable Furniture",
    image: furnitureShowcase.url,
    alt: "Recycled plastic lumber picnic table and benches on a lawn",
    category: "Furniture",
    cta: "View Furniture",
    copy: "Benches and tables specified by municipalities and lodges that are done replacing timber every other season.",
  },
  {
    title: "Structural Lumber",
    image: lumberShowcase.url,
    alt: "Stacked recycled plastic structural posts and beams in a yard",
    category: "Lumber",
    cta: "View Lumber",
    copy: "Posts and beams you can set straight into wet ground, cut and fix with the tools your carpenters already own.",
  },
];

const benefits = [
  { icon: Timer, title: "50+ Year Lifespan", copy: "Engineered to outlast the structure it supports." },
  { icon: ShieldCheck, title: "Zero Maintenance", copy: "No sealing, staining, oiling or sanding. Ever." },
  { icon: Bug, title: "100% Termite Proof", copy: "Inert plastic offers nothing for termites to eat." },
  { icon: Droplets, title: "Waterproof", copy: "Non-porous through its full thickness, so it cannot rot." },
];

const comparison = [
  { label: "Lifespan", ours: "50+ years", theirs: "5 to 10 years", oursGood: true },
  { label: "Maintenance", ours: "None", theirs: "Annual sealing", oursGood: true },
  { label: "Weather Resistance", ours: "Rain, sun & salt air", theirs: "Warps and splits", oursGood: true },
  { label: "Environmental Impact", ours: "Removes plastic waste", theirs: "Fells hardwood", oursGood: true },
];

function HomePage() {
  const { data: products } = useSuspenseQuery(productsQuery);

  return (
    <>
      <section className="relative flex min-h-[92svh] items-center overflow-hidden">
        <video
          className="absolute inset-0 size-full object-cover"
          src={heroVideo.url}
          poster={heroPoster.url}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-charcoal/40" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-charcoal/25"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 py-24 sm:px-6 lg:px-8">
          <div className="deck-fade-up max-w-3xl">
            <h1 className="font-display text-[clamp(2rem,7vw,4.25rem)] leading-[1.05] text-charcoal-foreground">
              Turning plastic trash to treasure
            </h1>
            <p className="mt-6 max-w-2xl text-[clamp(1rem,2.4vw,1.2rem)] leading-relaxed text-charcoal-foreground/85">
              We transform plastic waste into premium decking, furniture, and fencing that is termite-proof,
              weatherproof, and maintenance-free.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild className="h-11 rounded-md px-7 text-base">
                <Link to="/shop">Shop Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-md border-charcoal-foreground/70 bg-transparent px-7 text-base text-charcoal-foreground hover:bg-charcoal-foreground/10 hover:text-charcoal-foreground"
              >
                <Link to="/our-work">Our Work</Link>
              </Button>
            </div>
          </div>

          <p className="mt-16 text-xs font-semibold tracking-[0.16em] text-charcoal-foreground/70 uppercase sm:mt-24">
            Award-Winning Circular Economy Innovation <span className="mx-2 opacity-40">|</span> 1,200+ Tons
            Recycled
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight">
            Built from waste. Engineered for permanence.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Every plank, bench and beam starts as plastic collected from Tanzanian streets and
            waterways.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {showcase.map((item) => (
            <article
              key={item.title}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover"
            >
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
                <Button asChild className="mt-6 h-11 self-start px-6">
                  <Link to="/shop" search={{ category: item.category }}>
                    {item.cta}
                  </Link>
                </Button>
                <Link
                  to="/shop"
                  search={{ category: item.category }}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Learn More
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-offwhite">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
              Why choose recycled plastic?
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight">
              The Green Venture Advantage
            </h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <li key={benefit.title}>
                  <span className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <benefit.icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-lg">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.copy}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Green Venture recycled plastic compared with traditional wood
              </caption>
              <thead>
                <tr className="bg-charcoal text-charcoal-foreground">
                  <th scope="col" className="p-4 font-display text-xs tracking-[0.12em] uppercase">
                    &nbsp;
                  </th>
                  <th scope="col" className="p-4 font-display text-xs tracking-[0.12em] uppercase">
                    Green Venture Plastic
                  </th>
                  <th scope="col" className="p-4 font-display text-xs tracking-[0.12em] uppercase">
                    Traditional Wood
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-t border-border align-top">
                    <th scope="row" className="p-4 font-semibold">
                      {row.label}
                    </th>
                    <td className="p-4">
                      <span className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand-accent" aria-hidden="true" />
                        <span>{row.ours}</span>
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      <span className="flex items-start gap-2">
                        <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                        <span>{row.theirs}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)]">Popular right now</h2>
          <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">
            Browse the full catalogue
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <Link
              key={product.slug}
              to="/product/$slug"
              params={{ slug: product.slug }}
              className="group overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-card-hover"
            >
              <img
                src={productImage(product.image_key)}
                alt={product.name}
                loading="lazy"
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="p-5">
                <h3 className="font-display text-base leading-snug">{product.name}</h3>
                <p className="mt-2 text-sm font-semibold text-primary">
                  {new Intl.NumberFormat("en-US").format(product.price_tzs)} TZS {product.unit}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-charcoal text-charcoal-foreground">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight">
              Every desk donated recycles plastic and educates a child.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-foreground/75">
              Our desk programme puts indestructible recycled-plastic furniture into Tanzanian
              classrooms.
            </p>
          </div>
          <Button asChild className="h-11 self-start px-7 text-base lg:self-auto">
            <Link to="/our-impact">Donate a desk</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
