import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import shot1 from "@/assets/portfolio-DSC0132.jpg.asset.json";
import shot2 from "@/assets/portfolio-DSC0137.jpg.asset.json";
import shot3 from "@/assets/portfolio-DSC0153.jpg.asset.json";
import shot4 from "@/assets/portfolio-DSC0160.jpg.asset.json";
import shot5 from "@/assets/portfolio-DSC0166.jpg.asset.json";
import shot6 from "@/assets/portfolio-DSC0167.jpg.asset.json";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio | Green Venture Tanzania Recycled Plastic Work" },
      {
        name: "description",
        content:
          "Finished pieces made from recycled plastic lumber in Arusha: round side tables, marbled tops and colour-poured legs, photographed on site.",
      },
      { property: "og:title", content: "Portfolio | Green Venture Tanzania" },
      {
        property: "og:description",
        content: "Real recycled-plastic furniture and surfaces built by Green Venture Tanzania.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: shot1.url },
      { name: "twitter:image", content: shot1.url },
    ],
  }),
  component: PortfolioPage,
});

const works = [
  {
    src: shot1.url,
    title: "Olive marble side table",
    caption: "Poured plastic top with olive legs, styled in a hardwood lounge setting.",
  },
  {
    src: shot2.url,
    title: "Olive marble side table, detail",
    caption: "Every top is unique, the striping comes from the plastic feedstock itself.",
  },
  {
    src: shot3.url,
    title: "Charcoal round table",
    caption: "Dark blend top on tapered charcoal legs, fully weatherproof.",
  },
  {
    src: shot4.url,
    title: "Slate blend round table",
    caption: "Slate grey pour with pale veining, hand finished and polished.",
  },
  {
    src: shot5.url,
    title: "Slate blend, low angle",
    caption: "Dip-poured legs give each piece a two-tone finish.",
  },
  {
    src: shot6.url,
    title: "Lime pour side table",
    caption: "Bright lime top from recycled HDPE, indoor and outdoor ready.",
  },
];

function PortfolioPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">Portfolio</p>
          <h1 className="mt-4 font-display text-[clamp(1.85rem,5vw,3.25rem)] leading-tight">
            Pieces we have pressed, poured and finished.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Photographs from our Arusha workshop. Each surface is 100% recycled plastic, no wood, no veneer, no paint.
            The colour and marbling come straight from the waste stream we collect.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <figure key={work.src} className="group overflow-hidden rounded-xl border bg-card">
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src={work.src}
                  alt={work.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="p-5">
                <h2 className="text-base font-semibold">{work.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{work.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <Button asChild className="h-11 rounded-md px-7">
            <Link to="/shop">Shop the collection</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-md px-7">
            <Link to="/contact">Talk to us</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
