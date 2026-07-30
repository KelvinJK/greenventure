import { createFileRoute } from "@tanstack/react-router";

import { LegalList, LegalPage, LegalSection } from "@/components/site/LegalPage";

export const Route = createFileRoute("/return-policy")({
  head: () => ({
    meta: [
      { title: "Return & Refund Policy | Green Venture Tanzania" },
      {
        name: "description",
        content:
          "How to report transit damage, return an incorrect item, and how refunds to mobile money or bank accounts are processed.",
      },
      { property: "og:title", content: "Return & Refund Policy | Green Venture Tanzania" },
      {
        property: "og:description",
        content: "Damaged goods, 14-day returns on incorrect items, and refund timelines.",
      },
    ],
  }),
  component: ReturnPolicyPage,
});

function ReturnPolicyPage() {
  return (
    <LegalPage
      title="Return & Refund Policy"
      intro="We want every plank, bench and fence panel to arrive right. If something is wrong, here is exactly what to do."
    >
      <LegalSection heading="1. Damaged goods in transit">
        <p>
          Report transit damage within 48 hours of delivery, with clear photographs of the damaged
          material and the packaging. Send them to greenventuretanzania@gmail.com or WhatsApp
          (+255) 748 576 025. Confirmed transit damage is replaced at our cost.
        </p>
      </LegalSection>

      <LegalSection heading="2. Wrong or incorrect items">
        <p>
          If you receive an item you did not order, you have 14 days from delivery to request a
          return. Goods must be unused, uninstalled, and in their original condition.
        </p>
      </LegalSection>

      <LegalSection heading="3. Custom and B2B orders">
        <p>
          Custom-manufactured items — including lumber cut to bespoke dimensions and project-specific
          fabrication — are non-refundable unless defective or not to the agreed specification.
        </p>
      </LegalSection>

      <LegalSection heading="4. How to start a return">
        <LegalList
          items={[
            "Contact us with your order reference and photographs.",
            "We confirm the return and arrange collection or a drop-off point.",
            "Once the goods are inspected, we issue a replacement or a refund.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="5. Refunds">
        <p>
          Approved refunds are returned to the original mobile money or bank account used for
          payment within 5–10 business days. We do not refund to a different account holder.
        </p>
      </LegalSection>

      <LegalSection heading="6. Donations">
        <p>
          Donations made through the Education Initiative fund desk production and are
          non-refundable once a pledge is confirmed.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
