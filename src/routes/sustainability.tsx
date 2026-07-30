import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { LegalList, LegalPage, LegalSection } from "@/components/site/LegalPage";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability & Impact Commitment | Green Venture Tanzania" },
      {
        name: "description",
        content:
          "Our recycled-by-design commitment, how we calculate tons recycled and trees saved, and where donation funds go.",
      },
      { property: "og:title", content: "Sustainability Commitment | Green Venture Tanzania" },
      {
        property: "og:description",
        content: "100% post-consumer plastic, verified impact metrics, and the Education Initiative.",
      },
    ],
  }),
  component: SustainabilityPage,
});

function SustainabilityPage() {
  return (
    <LegalPage
      title="Sustainability & Impact Commitment"
      intro="Green Venture Tanzania is a social enterprise. This page sets out the commitments behind the numbers we publish."
    >
      <LegalSection heading="1. The recycled-material commitment">
        <p>
          100% of the core material in our decking, furniture, fencing and structural lumber is
          sourced from post-consumer plastic waste collected in Tanzania. We add only the pigments
          and UV stabilisers required for performance in strong sun.
        </p>
      </LegalSection>

      <LegalSection heading="2. How we calculate impact">
        <LegalList
          items={[
            "Tons recycled: the weighed intake of sorted post-consumer plastic entering our production line, logged per batch.",
            "Trees saved: tons of finished lumber produced, converted using the equivalent volume of hardwood timber it displaces.",
            "Figures are updated from production records and rounded down, never up.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="3. The Education Initiative">
        <p>
          Funds raised through our donation page go toward manufacturing and delivering desks to
          Tanzanian public schools. Each pledge tier maps to a defined number of desks, and
          recipient schools are recorded so donors can be told where their desks landed.
        </p>
        <div className="pt-2">
          <Button asChild className="h-11 px-5">
            <Link to="/donate">Donate a desk</Link>
          </Button>
        </div>
      </LegalSection>

      <LegalSection heading="4. Responsible operations">
        <p>
          Off-cuts and rejected batches are re-milled back into production rather than discarded. We
          buy waste feedstock from local collectors at a fair, published rate.
        </p>
      </LegalSection>

      <LegalSection heading="5. Honest claims">
        <p>
          We publish only what our own production records support. We do not claim third-party
          environmental certification, and we will correct any figure found to be inaccurate.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
