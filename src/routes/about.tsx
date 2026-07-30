import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import lumberImage from "@/assets/product-lumber.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Green Venture Tanzania | Circular Building Materials" },
      {
        name: "description",
        content:
          "We collect plastic waste across Tanzania and press it into decking, furniture and structural lumber that lasts over 50 years.",
      },
      { property: "og:title", content: "About Green Venture Tanzania" },
      {
        property: "og:description",
        content: "A circular-economy manufacturer turning Tanzanian plastic waste into premium building materials.",
      },
    ],
  }),
  component: AboutPage,
});

const numbers = [
  { value: "1,200+", label: "Tons of plastic recycled" },
  { value: "50+", label: "Year product lifespan" },
  { value: "9", label: "Regions served" },
];

function AboutPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">Our story</p>
          <h1 className="mt-4 font-display text-[clamp(1.85rem,5vw,3.25rem)] leading-tight">
            Waste is only waste until someone builds with it.
          </h1>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Green Venture Tanzania began with a simple observation: the plastic choking our drains
              and shorelines is one of the most durable materials ever invented, and we were throwing
              it away to import hardwood that rots in five years.
            </p>
            <p>
              Today we work with collection cooperatives across Dar es Salaam, Arusha and the Lake
              Zone. Their plastic is washed, shredded, colour-sorted and extruded into solid profiles
              on our own presses: decking, benches, fence slats, posts and beams that carpenters cut
              and fix with the tools they already own.
            </p>
            <p>
              We are a social enterprise. A share of every order funds our desk programme, which puts
              indestructible recycled-plastic desks into Tanzanian classrooms.
            </p>
          </div>
        </div>

        <dl className="mt-14 grid gap-6 sm:grid-cols-3">
          {numbers.map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-card p-6">
              <dt className="text-sm text-muted-foreground">{item.label}</dt>
              <dd className="mt-2 font-display text-3xl text-primary">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-offwhite">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <img
            src={lumberImage}
            alt="Recycled plastic lumber stacked at a Green Venture production yard"
            loading="lazy"
            width={1200}
            height={900}
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
          <div>
            <h2 className="font-display text-[clamp(1.6rem,3.6vw,2.5rem)] leading-tight">
              Built for Tanzanian conditions
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Coastal salt air, long rains and termites destroy timber structures fast. Our profiles
              are inert, non-porous and colour-through, so they hold up where imported hardwood and
              painted steel both fail, with no annual maintenance budget.
            </p>
            <Button asChild className="mt-8 h-11 px-6">
              <Link to="/contact">Talk to our team</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
