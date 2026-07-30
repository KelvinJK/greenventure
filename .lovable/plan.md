## Green Venture Tanzania — build plan

### Brand foundation
- Palette as tokens in `src/styles.css` (oklch): Forest Green #2E7D32 primary, Bright Green #4CAF50 accent, Off-White #FAFAFA, Dark Charcoal #1A1A1A for contrast sections. No hardcoded color classes anywhere.
- Typography: Poppins 700 headings, Open Sans 400 body, loaded via a `<link>` in the root route head.
- Mobile-first, generous whitespace, large imagery, restrained fade/rise motion.
- Shared header (logo left, links center: Shop, About, Donate, Contact; right: "Get a Quote" solid green + cart icon with live item count) and footer in `src/routes/__root.tsx`. Header collapses to a hamburger sheet below 768px; all tap targets ≥44px.

### Pages
- `/` — cinematic hero with AI-generated autoplaying muted looping video of recycled decking/outdoor furniture, 40% dark overlay, fade-in on load, H1 + sub-headline + "Shop Decking" (solid) and "Get a Custom Quote" (outline) CTAs, trust line at the bottom. Then: 3-card product showcase (Decking / Furniture / Lumber) with hover shadow and "Learn More" links, and a "Why Choose Recycled Plastic?" two-column section on off-white — 4 icon benefits left, green-check vs red-X comparison table (Lifespan, Maintenance, Weather Resistance, Environmental Impact) right.
- `/shop` — sidebar with category filter (Decking, Furniture, Fencing, Lumber) + price-range slider; responsive product grid with image, title, TZS price, one-line description, bright-green "Add to Cart" with clear hover state. Sidebar becomes a filter drawer on mobile.
- `/product/$id` — split layout: main image + 3 thumbnails left; title, large price, two description paragraphs, quantity stepper, full-width Add to Cart, "Request Custom Quote" link right.
- `/cart` — line items, quantities, TZS totals, "Proceed to Checkout" with loading spinner state.
- `/donate` — hero image of a Tanzanian classroom with the overlay headline, intro paragraph, 3 tier cards (One Desk TZS 150,000 / Classroom Set TZS 1,500,000 / Corporate Partner custom amount), selection state, then "Donate Now".
- `/about`, `/contact` (quote request form) — kept concise so nav has no dead links.
- `/success` — thank-you page with order summary, reached after payment.
- Each route gets its own `head()` with unique title/description/OG tags.

Images: generated for hero video, product shots, and the donate hero; no lorem ipsum.

### Backend and payments
- Enable Lovable Cloud (database + secrets). Tables: `products`, `orders`, `order_items`, `donations` — RLS on, explicit grants, public read for products, seeded with the real catalog and donation tiers via migration.
- Checkout runs through this stack's server layer (not Supabase Edge Functions):
  - A server function `createPaymentSession` builds the order (status `pending`, server-recalculated totals from DB prices) and calls Snippe.sh to create a mobile-money payment session, returning `checkout_url`.
  - A public server route `/api/public/snippe-webhook` verifies the `X-Webhook-Signature` HMAC, handles `payment.completed`, and flips the order/donation to `completed`.
  - The same session function serves both shop checkout and donations (amount + description).
- Since the Snippe key isn't ready yet: the flow is fully built but the payment call returns a clear "payments not yet configured" state, and the UI shows a friendly notice instead of redirecting. Once you paste `SNIPPE_API_KEY` and `SNIPPE_WEBHOOK_SECRET`, live checkout works with no code changes. Cart state persists in localStorage meanwhile.

### Technical notes
- TanStack Start file routes; `createServerFn` for app logic, a server route only for the webhook. Snippe credentials live in server-side secrets only, never in frontend code.
- Snippe's exact API surface will be confirmed against their docs before wiring; the session-create and webhook-verify calls are isolated in one server-only module so adjusting to their spec is a single-file change.
- Cart context + `sonner` toasts; `<Toaster />` mounted once in the root route.
- Final pass: hamburger nav, 44px targets, hero video aspect ratio on mobile, fluid heading sizes so H1/H2 don't overflow.

### What I'll need from you later
Snippe API key (`snp_...`) and webhook signing secret, plus real product photos/prices if you want to replace the generated placeholders.
