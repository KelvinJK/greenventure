import { createFileRoute } from "@tanstack/react-router";

import { LegalList, LegalPage, LegalSection } from "@/components/site/LegalPage";

export const Route = createFileRoute("/payment-security")({
  head: () => ({
    meta: [
      { title: "Payment Security | Green Venture Tanzania" },
      {
        name: "description",
        content:
          "How payments are processed by Snippe.sh, and the terms for M-Pesa, Airtel Money and Halotel mobile money transactions.",
      },
      { property: "og:title", content: "Payment Security | Green Venture Tanzania" },
      {
        property: "og:description",
        content: "Our authorised payment processor, encryption in transit, and mobile money terms.",
      },
    ],
  }),
  component: PaymentSecurityPage,
});

function PaymentSecurityPage() {
  return (
    <LegalPage
      title="Payment Security & Terms"
      intro="Green Venture Tanzania is the app owner responsible for this page. It describes how payments are handled today — it is not an independent certification."
    >
      <LegalSection heading="1. Authorised payment processor">
        <p>
          All online payments are processed by Snippe.sh. You are redirected to their secure
          checkout to authorise the transaction, and we receive only a payment reference and status
          in return.
        </p>
      </LegalSection>

      <LegalSection heading="2. What we do not store">
        <p>
          We do not store card numbers, CVV codes, mobile money PINs, or any other raw payment
          credential — those never touch our systems.
        </p>
      </LegalSection>

      <LegalSection heading="3. Encryption">
        <p>
          Traffic between your browser, this site, and the payment processor is encrypted in transit
          using industry-standard TLS.
        </p>
      </LegalSection>

      <LegalSection heading="4. Mobile money terms">
        <LegalList
          items={[
            "We support M-Pesa, Airtel Money and Halotel through our processor.",
            "The phone number you enter at checkout must match the number paying, or the transaction may be rejected.",
            "Confirm the amount and merchant name on the USSD prompt before entering your PIN.",
            "Never share your PIN with anyone — no member of our team will ever ask for it.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="5. Failed or duplicate payments">
        <p>
          If a payment is debited but your order is not confirmed, contact us with the mobile money
          transaction ID and we will trace and resolve it, refunding duplicates in full.
        </p>
      </LegalSection>

      <LegalSection heading="6. Reporting a security concern">
        <p>
          Email greenventuretanzania@gmail.com with the subject “Security” if you spot a
          vulnerability or a suspicious message claiming to be from us.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
