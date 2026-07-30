import { Link } from "@tanstack/react-router";
import { Recycle } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-charcoal-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-brand-accent text-brand-accent-foreground">
              <Recycle className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold">Green Venture Tanzania</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal-foreground/70">
            We transform plastic waste into premium decking, furniture, fencing and structural
            lumber — engineered for Tanzanian sun, rain and termites.
          </p>
          <p className="mt-6 text-xs tracking-[0.18em] text-charcoal-foreground/50 uppercase">
            1,200+ tons recycled
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <h2 className="font-display text-sm tracking-[0.14em] uppercase">Explore</h2>
          <ul className="mt-4 space-y-3 text-charcoal-foreground/70">
            <li>
              <Link to="/shop" className="transition-colors hover:text-brand-accent">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-brand-accent">
                About
              </Link>
            </li>
            <li>
              <Link to="/donate" className="transition-colors hover:text-brand-accent">
                Donate a desk
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-brand-accent">
                Request a quote
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <h2 className="font-display text-sm tracking-[0.14em] uppercase">Talk to us</h2>
          <ul className="mt-4 space-y-3 text-charcoal-foreground/70">
            <li>Dar es Salaam, Tanzania</li>
            <li>
              <a href="mailto:hello@greenventure.co.tz" className="transition-colors hover:text-brand-accent">
                hello@greenventure.co.tz
              </a>
            </li>
            <li>
              <a href="tel:+255700000000" className="transition-colors hover:text-brand-accent">
                +255 700 000 000
              </a>
            </li>
            <li>Mon – Sat, 8:00 – 18:00 EAT</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-charcoal-foreground/10">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 text-xs text-charcoal-foreground/50 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Green Venture Tanzania. Circular by design.
        </div>
      </div>
    </footer>
  );
}
