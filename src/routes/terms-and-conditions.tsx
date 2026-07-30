import { createFileRoute } from "@tanstack/react-router";

import { LegalList, LegalPage, LegalSection } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions of Sale | Green Venture Tanzania" },
      {
        name: "description",
        content:
          "The terms governing orders, pricing in TZS, delivery, the 50-year durability guarantee and custom B2B projects.",
      },
      { property: "og:title", content: "Terms and Conditions | Green Venture Tanzania" },
      {
        property: "og:description",
        content: "Our sale contract for recycled plastic decking, furniture, fencing and lumber.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions of Sale"
      intro="These terms form the contract between Green Venture Tanzania and you when you buy our recycled plastic building materials."
    >
      <LegalSection heading="1. Acceptance">
        <p>
          By placing an order on this website, by mobile money, or by signing a quote, you accept
          these terms in full.
        </p>
      </LegalSection>

      <LegalSection heading="2. Pricing and currency">
        <p>
          All prices are displayed in Tanzanian Shillings (TZS) and may change without notice.
          The price shown at the moment you complete checkout is the price locked to your order.
          Delivery charges, where applicable, are quoted separately before payment.
        </p>
      </LegalSection>

      <LegalSection heading="3. Orders and availability">
        <p>
          An order is confirmed once payment is received and we send you an order reference. If an
          item is unavailable we will contact you to substitute, delay, or refund in full.
        </p>
      </LegalSection>

      <LegalSection heading="4. Delivery and risk">
        <p>
          Ownership of and risk in the goods transfer to you upon full payment and physical
          delivery. Delivery dates are estimates given in good faith; we will keep you informed of
          any change.
        </p>
      </LegalSection>

      <LegalSection heading="5. 50-year durability guarantee">
        <p>
          Our recycled plastic lumber carries a 50-year durability guarantee against rot, termite
          attack, and weather degradation under normal use in Tanzanian conditions. The guarantee
          covers replacement of defective material and excludes damage from misuse, fire,
          structural overloading, or installation outside our published span guidance.
        </p>
      </LegalSection>

      <LegalSection heading="6. Custom and B2B orders">
        <LegalList
          items={[
            "Bespoke dimensions and project work require a written specification and an agreed deposit.",
            "Deposits on custom manufacturing are non-refundable once production begins.",
            "Lead times for custom orders are confirmed in the project quote.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="7. Payment">
        <p>
          Payments are handled by Snippe.sh, our authorised processor, supporting M-Pesa, Airtel
          Money, Halotel and card. Orders are only released for fulfilment once payment is
          confirmed.
        </p>
      </LegalSection>

      <LegalSection heading="8. Liability">
        <p>
          Our liability for any claim is limited to the value of the goods supplied. Nothing in
          these terms limits rights you hold under Tanzanian consumer protection law.
        </p>
      </LegalSection>

      <LegalSection heading="9. Governing law">
        <p>
          These terms are governed by the laws of the United Republic of Tanzania, and disputes fall
          under the jurisdiction of the Tanzanian courts.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
