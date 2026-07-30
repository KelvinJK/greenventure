import { createFileRoute } from "@tanstack/react-router";

import { LegalList, LegalPage, LegalSection } from "@/components/site/LegalPage";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy | Green Venture Tanzania" },
      {
        name: "description",
        content:
          "The cookies and browser storage Green Venture Tanzania uses to run the shopping cart and understand site traffic.",
      },
      { property: "og:title", content: "Cookie Policy | Green Venture Tanzania" },
      {
        property: "og:description",
        content: "Essential cart storage, optional analytics, and how to manage your choice.",
      },
    ],
  }),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="Cookies and local browser storage are small files this site saves on your device. Here is what we use and why."
    >
      <LegalSection heading="1. Essential storage">
        <p>
          Your shopping cart is saved in your browser's local storage so items are still there when
          you come back. Your cookie choice is stored the same way. Without this, checkout cannot
          work.
        </p>
      </LegalSection>

      <LegalSection heading="2. Analytics">
        <p>
          Where analytics is enabled, we use it only to count visits and see which pages are useful.
          These are optional and never used to identify you personally.
        </p>
      </LegalSection>

      <LegalSection heading="3. Consent">
        <p>
          On your first visit we show a banner: “We use cookies to improve your experience. By
          continuing to browse, you agree to our use of cookies.” Selecting Accept records your
          choice so the banner does not reappear.
        </p>
      </LegalSection>

      <LegalSection heading="4. Managing cookies">
        <LegalList
          items={[
            "You can clear cookies and site data at any time from your browser settings.",
            "Clearing site data will also empty your saved shopping cart.",
            "Blocking essential storage may prevent checkout from completing.",
          ]}
        />
      </LegalSection>
    </LegalPage>
  );
}
