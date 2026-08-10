import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const logoAsset = { url: "/media/green-venture-logo.webp" };

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/green-venture-tanzania/", Icon: Linkedin },
  { label: "Facebook", href: "https://web.facebook.com/greenventuretanzania", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/green_venture_tanzania/", Icon: Instagram },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-charcoal-foreground">
      <img
        src={logoAsset.url}
        alt=""
        aria-hidden="true"
        width={320}
        height={320}
        className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 select-none opacity-[0.04] sm:block lg:right-10 lg:size-80"
      />
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex min-w-0 items-center gap-2">
            <img
              src={logoAsset.url}
              alt="Green Venture Tanzania logo"
              width={44}
              height={44}
              className="size-11 shrink-0 rounded-md bg-white object-contain p-1"
            />
            <span className="font-display text-lg font-bold">Green Venture Tanzania</span>
          </div>

          <ul className="mt-5 space-y-3 text-sm text-charcoal-foreground/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Green%20Venture%20Limited%2C%20Njiro%20Road%2C%20Arusha%2C%20Tanzania"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-brand-accent"
              >
                Njiro Road, Arusha, Tanzania
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a href="tel:+255748576025" className="transition-colors hover:text-brand-accent">
                (+255) 748 576 025
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a
                href="mailto:greenventuretanzania@gmail.com"
                className="break-all transition-colors hover:text-brand-accent"
              >
                greenventuretanzania@gmail.com
              </a>
            </li>
          </ul>

          <div className="mt-6 flex items-center gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex size-11 items-center justify-center rounded-md border border-charcoal-foreground/15 text-charcoal-foreground/75 transition-colors hover:border-brand-accent hover:text-brand-accent"
              >
                <Icon className="size-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Shop and services" className="text-sm">
          <h2 className="font-display text-sm tracking-[0.14em] uppercase">Shop & Services</h2>
          <ul className="mt-4 space-y-3 text-charcoal-foreground/70">
            <li>
              <Link
                to="/shop"
                search={{ category: "Decking" }}
                className="transition-colors hover:text-brand-accent"
              >
                Decking & Construction
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                search={{ category: "Furniture" }}
                className="transition-colors hover:text-brand-accent"
              >
                Outdoor Furniture
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                search={{ category: "Fencing" }}
                className="transition-colors hover:text-brand-accent"
              >
                Fencing & Gates
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-brand-accent">
                Request a Custom Quote
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal and policies" className="text-sm">
          <h2 className="font-display text-sm tracking-[0.14em] uppercase">Legal & Policies</h2>
          <ul className="mt-4 space-y-3 text-charcoal-foreground/70">
            <li>
              <Link to="/privacy-policy" className="transition-colors hover:text-brand-accent">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className="transition-colors hover:text-brand-accent">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link to="/return-policy" className="transition-colors hover:text-brand-accent">
                Return & Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/cookie-policy" className="transition-colors hover:text-brand-accent">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link to="/payment-security" className="transition-colors hover:text-brand-accent">
                Payment Security
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Our impact" className="text-sm">
          <h2 className="font-display text-sm tracking-[0.14em] uppercase">Our Impact</h2>
          <ul className="mt-4 space-y-3 text-charcoal-foreground/70">
            <li>
              <Link to="/about" className="transition-colors hover:text-brand-accent">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/our-impact" className="transition-colors hover:text-brand-accent">
                The Education Initiative
              </Link>
            </li>
            <li>
              <Link to="/sustainability" className="transition-colors hover:text-brand-accent">
                Sustainability Commitment
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-brand-accent">
                Volunteer with Us
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-charcoal-foreground/10">
        <div className="mx-auto grid w-full max-w-7xl gap-2 px-4 py-6 text-xs text-charcoal-foreground/50 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Green Venture Tanzania. All Rights Reserved.</p>
          <p>
            Payments securely processed by{" "}
            <a
              href="https://snippe.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-charcoal-foreground/80 transition-colors hover:text-brand-accent"
            >
              Snippe.sh
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
