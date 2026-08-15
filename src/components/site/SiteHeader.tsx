import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";

const logo = "/media/green-venture-logo.webp";

const navLinks: { to: string; label: string; exact?: boolean }[] = [
  { to: "/products", label: "Products" },
  { to: "/solutions", label: "Solutions" },
  { to: "/projects", label: "Projects" },
  { to: "/sustainability", label: "Sustainability" },
  { to: "/professionals", label: "Professionals" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between gap-4 md:h-20">
        <Link to="/" className="flex min-h-11 items-center gap-2.5" aria-label="Green Venture Limited home">
          <img
            src={logo}
            alt="Green Venture Limited logo"
            width={40}
            height={40}
            className="size-10 shrink-0 object-contain"
          />
          <span className="font-display text-base leading-none font-semibold tracking-tight">
            Green Venture
            <span className="mt-1 block font-sans text-[0.6rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Arusha, Tanzania
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-[0.8rem] font-semibold tracking-wide text-foreground/75 uppercase transition-colors hover:text-green"
              activeProps={{ className: "text-green" }}
              activeOptions={{ exact: link.exact ?? false }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="relative size-11" aria-label="Cart">
            <Link to="/cart">
              <ShoppingCart className="size-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-terracotta text-[0.65rem] font-bold text-terracotta-foreground">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </Button>

          <Button asChild className="hidden h-11 rounded-none px-5 sm:inline-flex">
            <Link to="/quote">Request a quote</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="size-11 lg:hidden" aria-label="Open menu">
                <Menu className="size-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,86vw)] overflow-y-auto">
              <SheetTitle className="px-4 pt-4 text-left font-display">Menu</SheetTitle>
              <nav className="mt-4 flex flex-col px-2 pb-6" aria-label="Mobile">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center px-4 text-base font-semibold text-foreground/80 transition-colors hover:text-green"
                  activeProps={{ className: "text-green" }}
                  activeOptions={{ exact: true }}
                >
                  Home
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center px-4 text-base font-semibold text-foreground/80 transition-colors hover:text-green"
                    activeProps={{ className: "text-green" }}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/shop"
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center px-4 text-base font-semibold text-foreground/80 transition-colors hover:text-green"
                >
                  Shop
                </Link>
                <Link
                  to="/order-status"
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center px-4 text-base font-semibold text-foreground/80 transition-colors hover:text-green"
                >
                  Order status
                </Link>
                <Button asChild className="mx-2 mt-4 h-12 rounded-none">
                  <Link to="/quote" onClick={() => setOpen(false)}>
                    Request a quote
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
