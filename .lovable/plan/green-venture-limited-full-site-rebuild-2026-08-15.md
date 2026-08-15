# Green Venture Limited — full site rebuild

A complete rebuild of the site around the new brief: premium building-materials brand, quote-led, Arusha collection-only, with the existing shop and mobile-money checkout retained.

## Decisions carried in

- Full rebuild: new routes, new content, new visual language.
- Keep your real photographs; labelled placeholder blocks only where no photo exists (safari-camp hero, project case studies, panels, cladding/bathroom units, solutions diagrams, professionals downloads).
- Replace the theme with the brief palette and Playfair Display + Open Sans.
- Keep the working Snippe mobile-money checkout, and add the bank transfer / mobile money instruction page.

## Design system

New tokens in `src/styles.css` (OKLCH equivalents of the brief hex values): forest #0F3D24, green #1A5E38, moss #8CB369, lime #B8D97A, terracotta #C4703A, bone #FAF8F3, charcoal #1F1E1B. Bone page background, charcoal body text, green primary buttons, forest footer and impact bands. Playfair Display for headings, Open Sans for body, loaded via `<link>` in the root route. Generous section spacing, large heading scale, no gradients, no recycling icons.

A `<Photo>` component renders either a real image (with alt text) or a labelled placeholder card showing the intended shot description and aspect ratio.

## Routes

- `/` — full-bleed hero ("Timber that never rots." / subline / See the products + Request a quote), value strip (No maintenance · No termites · No splinters), product grid, six-step "How it's made", three featured projects, forest impact band, closing CTA with WhatsApp.
- `/products` overview plus `/products/lumber`, `/decking`, `/prefabricated-panels`, `/cladding-and-bathroom-units`, `/furniture`, `/other`. Each: hero, one paragraph, spec list, warranty terms, collection notice, "Prices exclude 18% VAT", quote button that pre-fills the product.
- `/solutions` — the four decking purchase routes plus wall cladding, each with a diagram placeholder.
- `/projects` — the ten named case studies, from Supabase. Corporate logo strip left commented out in code.
- `/sustainability` — the loop, collector network, impact figures, and the impact calculator.
- `/about` — founding story, Edgar Edmund Tarimo, team, factory, the five certifications with reference numbers.
- `/professionals` — spec sheets, profile drawings, fixing and span notes (placeholder download links), material estimator.
- `/quote`, `/order-status`, `/payment`, `/contact`.
- Retained: `/shop`, `/product/$slug`, `/cart`, `/success`, and the legal pages (privacy, terms, returns, cookies, payment security).
- Removed/replaced: `/our-work`, `/our-impact`, `/about` in their current form; `/portfolio` content folds into `/projects`.

## Commercial rules enforced everywhere

Prices in TSH, ex-VAT, with "Prices exclude 18% VAT" beside every price. "Collection only from the Njiro yard, Arusha" on every product page, the quote form and contact page — no delivery or shipping wording anywhere. "Prices are indicative and subject to confirmation on a written quotation."

## Impact calculator

Input linear metres of lumber or m² of decking; output kilograms of plastic diverted using 2.5 kg/lm and 12.5 lm per m². The arithmetic is printed underneath. Labelled an estimate. No CO₂ conversion.

## Unconfirmed content

Rendered as visible `[CONFIRM: …]` blocks, not filler: decking price per m²; furniture price list; tonnes processed (1,800+ or 2,000+); bank account name and number; mobile money till numbers; social media URLs (icons omitted entirely until supplied).

## Global

Sticky header (logo left, nav centre, Request a quote right, mobile drawer), floating WhatsApp button with pre-filled message to +255 748 576 025, forest footer with address, contact, quick links, certifications strip, company no. 22443, VAT 100-12835-S, copyright. Per-page title/description/OG tags, LocalBusiness and Product JSON-LD, sitemap.xml, robots.txt. Semantic headings, alt text, visible focus rings, AA contrast. No analytics or tracking scripts.

## Technical notes

- Database: extend `products` with the fields the new product pages need (spec list, unit, profile dimensions, weight per lm); add `projects` (name, location, scope, result, images, sort order); add `orders` reference lookup fields (reference, client name, product summary, status enum, notes, updated_at); extend `quote_requests` with company, location, product, quantity + unit, installation, timeline, reference. Every new table gets GRANTs plus RLS: public read for products/projects, insert-only for quote requests, and no client read on orders — status lookup goes through a server function that returns only the safe fields for an exact reference match.
- Reference numbers generated server-side in `GVT-YYMM-####` format.
- Drawing uploads go to a private storage bucket, written from the server function.
- `/products/*` pages are separate route files (not hash sections) so each gets its own metadata.
- Payment page keeps a commented Flutterwave / DPO Pay stub; the existing Snippe checkout and webhook stay untouched.
- Performance for slow 3G: existing photos served from `public/media`, `loading="lazy"` and explicit width/height on non-hero images, hero video poster-first with `preload="none"` on small screens.
