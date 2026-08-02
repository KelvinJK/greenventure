import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
          "Finished pieces made from recycled plastic lumber in Arusha: round side tables with marbled tops and colour-poured legs, photographed on site.",
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

type Work = {
  id: string;
  title: string;
  caption: string;
  images: { src: string; alt: string }[];
};

const works: Work[] = [
  {
    id: "olive",
    title: "Olive & lime round side table",
    caption:
      "Poured plastic top in olive and lime blends on tapered legs. Every top is unique, the striping comes from the plastic feedstock itself.",
    images: [
      { src: shot1.url, alt: "Olive marbled recycled plastic side table in a hardwood lounge setting" },
      { src: shot2.url, alt: "Close view of the olive marbled recycled plastic table top" },
      { src: shot6.url, alt: "Lime pour recycled plastic side table in raking sunlight" },
    ],
  },
  {
    id: "slate",
    title: "Slate & charcoal round side table",
    caption:
      "Dark slate blend top with pale veining on dip-poured two-tone legs. Hand finished, polished and fully weatherproof.",
    images: [
      { src: shot3.url, alt: "Charcoal recycled plastic round side table lit from the side" },
      { src: shot4.url, alt: "Slate blend recycled plastic round table seen from above" },
      { src: shot5.url, alt: "Low angle view of the slate blend recycled plastic side table" },
    ],
  },
];

function PortfolioPage() {
  const [openWork, setOpenWork] = useState<Work | null>(null);
  const [startIndex, setStartIndex] = useState(0);

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
            The colour and marbling come straight from the waste stream we collect. Tap a piece to open the gallery and
            slide through every angle.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {works.map((work) => (
            <article key={work.id} className="overflow-hidden rounded-xl border bg-card">
              <button
                type="button"
                onClick={() => {
                  setStartIndex(0);
                  setOpenWork(work);
                }}
                className="group block w-full cursor-pointer text-left"
                aria-label={`Open gallery for ${work.title}`}
              >
                <div className="aspect-4/3 overflow-hidden">
                  <img
                    src={work.images[0]!.src}
                    alt={work.images[0]!.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              </button>

              <div className="p-6">
                <h2 className="font-display text-lg">{work.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{work.caption}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {work.images.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => {
                        setStartIndex(index);
                        setOpenWork(work);
                      }}
                      className="size-16 shrink-0 cursor-pointer overflow-hidden rounded-md border transition-colors hover:border-primary"
                      aria-label={`Open ${work.title} photo ${index + 1}`}
                    >
                      <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  ))}
                  <span className="ml-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {work.images.length} photos
                  </span>
                </div>
              </div>
            </article>
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

      <Dialog open={openWork !== null} onOpenChange={(next) => !next && setOpenWork(null)}>
        <DialogContent className="w-[96vw] max-w-[min(64rem,96vw)] border-0 bg-transparent p-0 shadow-none sm:max-w-[min(64rem,92vw)]">
          <DialogTitle className="sr-only">{openWork?.title ?? "Gallery"}</DialogTitle>
          {openWork && (
            <Carousel
              key={`${openWork.id}-${startIndex}`}
              opts={{ loop: true, startIndex, align: "center" }}
              className="w-full px-2 sm:px-0"
            >
              <CarouselContent>
                {openWork.images.map((image) => (
                  <CarouselItem key={image.src}>
                    <div className="overflow-hidden rounded-lg bg-black">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="max-h-[65vh] w-full object-contain sm:max-h-[75vh]"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-3 z-20 size-10 bg-background/90 sm:-left-12 sm:size-11" />
              <CarouselNext className="right-3 z-20 size-10 bg-background/90 sm:-right-12 sm:size-11" />
            </Carousel>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
