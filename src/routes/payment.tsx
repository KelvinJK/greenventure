import { createFileRoute } from "@tanstack/react-router";

import { ConfirmBlock } from "@/components/site/ConfirmBlock";
import { PageIntro } from "@/components/site/PageIntro";
import { collectionNote, company, indicativeNote, vatNote } from "@/lib/site-content";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Payment — Green Venture Limited" },
      {
        name: "description",
        content:
          "How to pay Green Venture Limited: bank transfer to Stanbic Bank Tanzania, Arusha branch, or mobile money via M-Pesa, Tigo Pesa and Airtel Money.",
      },
      { property: "og:title", content: "Payment — Green Venture Limited" },
      {
        property: "og:description",
        content: "Bank transfer and mobile money payment details for Green Venture Limited.",
      },
      { property: "og:url", content: "https://greenventure.lovable.app/payment" },
    ],
    links: [{ rel: "canonical", href: "https://greenventure.lovable.app/payment" }],
  }),
  component: PaymentPage,
});

/*
 * Payment gateway integration stub.
 * -------------------------------------------------------------------------
 * Card gateways such as Stripe and Squarespace Payments do not operate in
 * Tanzania, so no card gateway is integrated. When a local gateway is added,
 * wire it here as a server function and keep the manual bank and mobile money
 * details below as a fallback.
 *
 * Flutterwave:
 *   POST https://api.flutterwave.com/v3/payments
 *   headers: { Authorization: `Bearer ${process.env['FLUTTERWAVE_SECRET_KEY']}` }
 *   body: { tx_ref, amount, currency: "TZS", redirect_url, customer }
 *
 * DPO Pay:
 *   POST https://secure.3gdirectpay.com/API/v6/  (createToken XML payload)
 *   then redirect to https://secure.3gdirectpay.com/payv2.php?ID=<TransToken>
 *
 * Both need credentials stored as server secrets, plus a webhook route under
 * src/routes/api/public/ that verifies the provider signature before marking an
 * order as paid.
 */

function PaymentPage() {
  return (
    <>
      <PageIntro
        eyebrow="Payment"
        title="How to pay"
        lead="Payment is by bank transfer or mobile money against a written quotation."
      />

      <section className="section">
        <div className="shell grid gap-10 lg:grid-cols-2">
          <div className="border border-border bg-card p-6 md:p-8">
            <h2 className="font-display text-2xl">Bank transfer</h2>
            <dl className="mt-6 grid gap-4 text-sm">
              <div>
                <dt className="font-semibold">Bank</dt>
                <dd className="text-muted-foreground">Stanbic Bank Tanzania, Arusha branch</dd>
              </div>
              <div>
                <dt className="font-semibold">SWIFT</dt>
                <dd className="text-muted-foreground">SBICTZTX</dd>
              </div>
              <div>
                <dt className="font-semibold">Account name and number</dt>
                <dd className="mt-1">
                  <ConfirmBlock>account name and account number</ConfirmBlock>
                </dd>
              </div>
            </dl>
          </div>

          <div className="border border-border bg-card p-6 md:p-8">
            <h2 className="font-display text-2xl">Mobile money</h2>
            <ul className="mt-6 grid gap-2 text-sm text-muted-foreground">
              <li>M-Pesa</li>
              <li>Tigo Pesa</li>
              <li>Airtel Money</li>
            </ul>
            <p className="mt-6">
              <ConfirmBlock>till or merchant numbers</ConfirmBlock>
            </p>
          </div>
        </div>

        <div className="shell mt-12 grid gap-3 border-t border-border pt-8 text-sm text-muted-foreground">
          <p>{vatNote}. All prices are quoted in Tanzanian Shillings.</p>
          <p>{indicativeNote}</p>
          <p>{collectionNote}</p>
          <p>
            Questions about a payment: {company.email} · {company.phoneDisplay}
          </p>
        </div>
      </section>
    </>
  );
}
