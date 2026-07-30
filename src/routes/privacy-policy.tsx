import { createFileRoute } from "@tanstack/react-router";

import { LegalList, LegalPage, LegalSection } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Green Venture Tanzania" },
      {
        name: "description",
        content:
          "How Green Venture Tanzania collects, uses and protects your personal data under the Tanzanian Personal Data Protection Act.",
      },
      { property: "og:title", content: "Privacy Policy | Green Venture Tanzania" },
      {
        property: "og:description",
        content: "Our data handling practices for customers of recycled plastic building materials.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Green Venture Tanzania is the data controller for the information you share with us. This policy explains what we collect, why we collect it, and the rights you hold under the Tanzanian Personal Data Protection Act (Cap. 44, 2022)."
    >
      <LegalSection heading="1. Data we collect">
        <LegalList
          items={[
            "Name, phone number and email address you provide at checkout or in a quote request.",
            "Physical delivery address and site details needed to fulfil your order.",
            "Transaction history: items ordered, amounts in TZS, and order status.",
            "Basic technical data such as browser type and pages visited, used to keep the site working.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="2. Payment information">
        <p>
          Payments are processed by our authorised payment partner, Snippe.sh. Card numbers, mobile
          money PINs and other raw payment credentials are entered on the processor's secure
          checkout — Green Venture Tanzania never sees or stores them. We retain only a payment
          reference and the status of your transaction.
        </p>
      </LegalSection>

      <LegalSection heading="3. Why we use your data">
        <LegalList
          items={[
            "To process, deliver and support your order.",
            "To respond to quote requests and customer service enquiries.",
            "To meet accounting, tax and legal record-keeping obligations in Tanzania.",
          ]}
        />
        <p>We do not sell your personal data, and we do not share it for third-party marketing.</p>
      </LegalSection>

      <LegalSection heading="4. Who we share data with">
        <p>
          We share only what is necessary with our payment processor (Snippe.sh), our delivery
          partners, and our hosting and database providers, all of whom are bound to protect it.
        </p>
      </LegalSection>

      <LegalSection heading="5. Retention">
        <p>
          Order and transaction records are kept for as long as required by Tanzanian tax and
          commercial law. Quote enquiries are kept for up to 24 months unless you ask us to erase
          them sooner.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your rights">
        <p>
          Under the Personal Data Protection Act you may request access to your data, ask us to
          correct inaccurate details, request deletion where we have no legal obligation to keep the
          record, and object to specific uses. Write to
          greenventuretanzania@gmail.com and we will respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection heading="7. Cookies">
        <p>
          We use a small number of cookies and local browser storage to keep your shopping cart and
          your cookie choice between visits. See our Cookie Policy for the full breakdown.
        </p>
      </LegalSection>

      <LegalSection heading="8. Security">
        <p>
          Traffic to and from this site is encrypted in transit. Access to order records is
          restricted to trusted server-side processes and authorised staff.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
