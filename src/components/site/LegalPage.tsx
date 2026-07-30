import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated = "30 July 2026",
  intro,
  children,
}: {
  title: string;
  updated?: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Legal
        </p>
        <h1 className="mt-3 font-display text-[clamp(1.75rem,4.5vw,2.75rem)] leading-tight">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        {intro && <p className="mt-6 text-base leading-relaxed text-muted-foreground">{intro}</p>}
        <div className="mt-10 space-y-8">{children}</div>
        <p className="mt-12 rounded-lg border border-border bg-muted/40 p-5 text-sm leading-relaxed text-muted-foreground">
          This page is maintained by Green Venture Tanzania. Questions? Email{" "}
          <a
            href="mailto:greenventuretanzania@gmail.com"
            className="font-semibold text-primary hover:underline"
          >
            greenventuretanzania@gmail.com
          </a>{" "}
          or call (+255) 748 576 025.
        </p>
      </div>
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl leading-snug">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
