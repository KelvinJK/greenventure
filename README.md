# Green Venture Builder

# Green Venture Tanzania: Lovable AI Prompt Guide (with Snippe.sh Integration)

**Prepared by:** Manus AI**Date:** July 30, 2026

This guide provides a step-by-step blueprint for building the Green Venture Tanzania website using [Lovable.dev](https://lovable.dev/). It incorporates [Snippe.sh](https://snippe.sh/) as the payment gateway for both e-commerce and donations.

## Phase 1: Foundation and Setup

### Step 1: The Initial Project Prompt (The "Seed")

Before generating any pages, establish the foundational rules of the project. This prevents the AI from having to "guess" your design preferences later.

**Copy and paste this into the Lovable prompt box:**

> "I need a React, Vite, and TailwindCSS web application for a sustainable building materials company called 'Green Venture Tanzania'. We transform plastic waste into durable, eco-friendly lumber, decking, and furniture.**Design Principles:**- **Vibe:** Cinematic, premium, and earthy. It should feel like a high-end architectural firm that cares deeply about the environment.- **Color Palette:** Primary: Forest Green (#2E7D32), Accent: Bright Green (#4CAF50), Backgrounds: Off-White (#FAFAFA) and Dark Charcoal (#1A1A1A) for contrast sections.- **Typography:** Headings: Poppins (Bold, 700). Body: Open Sans (Regular, 400).- **Layout:** Mobile-first, generous whitespace, large high-quality imagery.**Core Navigation:**- Logo (left)- Links (center): Shop, About, Donate, Contact- CTAs (right): 'Get a Quote' (Solid Green), 'Cart' (Icon)**Action:**Please do not generate any pages yet. Just acknowledge these rules and ask me any clarifying questions about the user journey before we begin."

---

## Phase 2: The Cinematic Hero Section

### Step 2: The Video Background Hero

Lovable excels at creating modern, immersive hero sections. We will prompt it to build a hero section with a fading video background and clear, dual CTAs (one for retail, one for business).

**Copy and paste this prompt:**

> "Let's build the homepage starting with the Hero Section.**Layout:** A full-screen, cinematic hero section.**Background:** Use an autoplaying, muted, looping video background of beautiful recycled plastic decking or outdoor furniture. Add a dark overlay (opacity 40%) to ensure text readability. Include a smooth fade-in animation on load.**Content:**- **Headline (H1):** 'Sustainable Outdoor Living, Built to Last 50+ Years'- **Sub-headline:** 'We transform plastic waste into premium decking, furniture, and fencing—termite-proof, weatherproof, and maintenance-free.'- **Primary CTA Button:** 'Shop Decking' (Solid Forest Green background, white text, rounded corners, 44px height).- **Secondary CTA Button:** 'Get a Custom Quote' (Transparent background, white border, white text, rounded corners, 44px height).- **Trust Signal (Bottom):** 'Award-Winning Circular Economy Innovation | 1,200+ Tons Recycled'**Action:** Build this component only. Ensure it is fully responsive and the video resizes correctly on mobile."

---

## Phase 3: Core Homepage Sections

### Step 3: The Product Showcase (Carousel/Grid)

Instead of asking for a whole page, build this section by section.

**Copy and paste this prompt:**

> "Now, build the 'Product Showcase' section below the hero.**Layout:** A clean, spacious grid (3 columns on desktop, 1 column on mobile).**Content:** Create 3 premium product cards:1. **Recycled Decking:** Image of a lush patio. Text: 'Weatherproof Decking'. CTA: 'View Planks'.1. **Outdoor Furniture:** Image of a stylish park bench. Text: 'Durable Furniture'. CTA: 'View Furniture'.1. **Construction Lumber:** Image of structural posts. Text: 'Structural Lumber'. CTA: 'View Lumber'.**Style:** Cards should have a subtle shadow on hover and a 'Learn More' text link at the bottom. Use real placeholder images from Unsplash related to outdoor architecture. Do not use lorem ipsum."

### Step 4: The "Why Choose Us" Comparison Table

This is crucial for selling the product. We need a visual comparison against traditional wood.

**Copy and paste this prompt:**

> "Next, add a 'Why Choose Recycled Plastic?' section.**Layout:** A two-column layout. Left column: Text and icons. Right column: A comparison table.**Left Column:**- Heading: 'The Green Venture Advantage'- List 4 key benefits with custom SVG icons: 50+ Year Lifespan, Zero Maintenance, 100% Termite Proof, Waterproof.**Right Column (Table):**- Create a clean, bordered comparison table.- Rows: 'Lifespan', 'Maintenance', 'Weather Resistance', 'Environmental Impact'.- Columns: 'Green Venture Plastic' vs 'Traditional Wood'.- Use a green checkmark for our product and a red 'X' for wood.**Style:** Use the Off-White (#FAFAFA) background for this section to create visual separation from the previous section."

---

## Phase 4: E-Commerce Integration (The Shop)

### Step 5: The Shop Page Structure

Now we transition from the landing page to the e-commerce functionality.

**Copy and paste this prompt:**

> "Create a new page called `/shop`.**Layout:** A standard e-commerce catalog layout.**Sidebar (Left):** Categories (Decking, Furniture, Fencing, Lumber). Include a 'Price Range' slider.**Main Content (Right):** A grid of product cards.**Product Card Details:** Each card must include:- Product Image- Product Title (e.g., 'Classic Recycled Decking Plank')- Price (e.g., 'TZS 15,000 / meter')- A brief 1-sentence description.- An 'Add to Cart' button (Bright Green #4CAF50).**Action:** Generate 4 mock product cards to demonstrate the layout. Ensure the 'Add to Cart' button has a clear hover state."

### Step 6: The Product Details Page

**Copy and paste this prompt:**

> "Create a new page called `/product/:id` for individual product details.**Layout:** A split layout (Images on the left, details on the right).**Left Side:** A main large product image, with 3 smaller thumbnail images below it.**Right Side:**- Product Title (H1)- Price (Large, Bold text)- Description (2 paragraphs explaining durability and use case).- Quantity Selector (Stepper input).- 'Add to Cart' Button (Large, full width).- A 'Request Custom Quote' link for bulk buyers.**Style:** Keep it minimal and clean, focusing entirely on the product information."

---

## Phase 5: Snippe.sh Payment Gateway Integration

This phase connects your Lovable frontend to Snippe.sh for secure mobile money payments.

### Step 7: Backend Setup (Supabase + Snippe SDK)

**Copy and paste this prompt:**

> "We need to connect this frontend to a Supabase backend and integrate Snippe.sh for payments.**Action:**1. Set up Supabase Edge Functions.1. Install the `@snippe/sdk` package in the Supabase Edge Function.1. Create a new Edge Function called `create-snippe-session` that accepts cart data from the frontend.1. Inside the function, use the Snippe SDK to create a `Payment Session` with the `mobile_money` method.1. The function should return the `checkout_url` from Snippe back to the frontend.1. Store the order details in a Supabase `orders` table with a status of 'pending'."

### Step 8: The Cart & Checkout UI

**Copy and paste this prompt:**

> "Now let's build the Cart and Checkout UI on the frontend.**Action:**1. Create a `/cart` page displaying the items added to the cart, quantities, and total price in TZS.1. Add a 'Proceed to Checkout' button.1. When clicked, this button should call our Supabase Edge Function (`create-snippe-session`).1. While waiting for the response, show a loading spinner.1. Once the `checkout_url` is returned, redirect the user to the Snippe hosted checkout page using `window.location.href`.1. Update the Cart icon in the navbar to display the number of items in the user's cart."

### Step 9: Webhook Confirmation (Order Success)

**Copy and paste this prompt:**

> "We need to handle the payment confirmation.**Action:**1. Create a new Supabase Edge Function called `snippe-webhook`.1. Use the Snippe SDK's `verifyWebhook` helper to verify the signature in the `X-Webhook-Signature` header.1. Listen for the `payment.completed` event.1. When received, update the corresponding order in the Supabase `orders` table from 'pending' to 'completed'.1. Create a `/success` page on the frontend where users will land after paying. This page should show a 'Thank You' message and order details."

---

## Phase 6: The Donate Flow (Social Enterprise)

### Step 10: The Donate Page with Snippe

This is a key part of the Green Venture brand.

**Copy and paste this prompt:**

> "Create a new page called `/donate`.**Layout:** A focused, emotional landing page.**Hero:** A background image of a Tanzanian classroom. Overlay text: 'Every Desk Donated Recycles Plastic and Educates a Child.'**Content:**- A brief paragraph explaining the initiative.- A 'Donation Tier' selector. Create 3 cards:
    1. 'One Desk' (TZS 150,000) - 'Provides a durable desk for one student.'
    1. 'A Classroom Set' (TZS 1,500,000) - 'Equips an entire row of desks.'
    1. 'Corporate Partner' (Custom Amount) - 'Transforms a whole school.'**Integration:**- When a user selects a tier, add a 'Donate Now' button.- This button should call the same Supabase Edge Function (`create-snippe-session`) we created for the shop, passing the donation amount and description.- Redirect the user to the Snippe checkout URL."

---

## Phase 7: Final Polish and Responsiveness

### Step 11: Mobile Optimization Check

Always do a final pass to ensure the site works perfectly on phones.

**Copy and paste this prompt:**

> "Review the entire application for mobile responsiveness.**Action:**1. Ensure the main navigation collapses into a clean 'Hamburger Menu' on mobile screens (below 768px).1. Check that all buttons are at least 44px tall for easy tapping.1. Ensure the hero video scales correctly without losing its aspect ratio on mobile.1. Adjust font sizes so H1 and H2 headings don't overflow on small screens.Please detail your plan for these responsiveness adjustments before making the changes."

---

## Pro-Tips for Using Lovable

1. **Use the "Select" Tool:** If a specific button isn't quite right, click on it in the Lovable preview, then click the "Edit" (pencil) icon. This allows you to refine that exact component without rewriting the whole page.

1. **Iterate in Chunks:** Never ask Lovable to "build the whole website." Ask it to build the hero, review it, then ask it to build the products, review it, etc.

1. **Snippe API Keys:** Remember to add your Snippe API Key (`snp_...`) to your Supabase Edge Function secrets environment variables. Never expose it in the frontend code.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://greenventure.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/52bc47a3-37fb-49cc-845f-32db0d828e4f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
