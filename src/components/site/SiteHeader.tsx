import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart } from "lucide-react";
import { useState } from "react";

import logoAsset from "@/assets/green-venture-logo.webp.asset.json";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";

const navLinks: { to: string; label: string; exact?: boolean }[] = [
  { to: "/", label: "Home", exact: true },
  { to: "/shop", label: "Shop" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About" },
  { to: "/donate", label: "Donate" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-h-11 items-center gap-2" aria-label="Green Venture Tanzania home">
          <img
            src={logoAsset.url}
            alt="Green Venture Tanzania logo"
            width={40}
            height={40}
            className="size-10 shrink-0 object-contain"
          />

          <span className="font-display text-base leading-tight font-bold tracking-tight">
            Green Venture
            <span className="block text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Tanzania
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-semibold text-foreground/75 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: link.exact ?? false }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden h-11 px-5 sm:inline-flex">
            <Link to="/contact">Get a Quote</Link>
          </Button>

          <Button asChild variant="ghost" size="icon" className="relative size-11" aria-label="Cart">
            <Link to="/cart">
              <ShoppingCart className="size-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-brand-accent text-[0.65rem] font-bold text-brand-accent-foreground">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="size-11 md:hidden" aria-label="Open menu">
                <Menu className="size-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,85vw)]">
              <SheetTitle className="px-4 pt-4 text-left font-display">Menu</SheetTitle>
              <nav className="mt-4 flex flex-col px-2" aria-label="Mobile">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center rounded-md px-4 text-base font-semibold text-foreground/80 transition-colors hover:bg-muted hover:text-primary"
                    activeProps={{ className: "text-primary" }}
                    activeOptions={{ exact: link.exact ?? false }}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild className="mt-4 mx-2 h-12">
                  <Link to="/contact" onClick={() => setOpen(false)}>
                    Get a Quote
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
