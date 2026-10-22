import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "How it works — Profit Pilot" },
      { name: "description", content: "How Profit Pilot prices props, compares them to the book and grades every pick." },
      { property: "og:title", content: "How Profit Pilot works" },
      { property: "og:description", content: "Price it. Compare it. Grade it." },
    ],
  }),
  component: About,
});

const steps = [
  ["Price it", "We project every player's role, minutes and volume, then turn that into our own odds for each prop."],
  ["Compare it", "We line our number up against the book's implied odds. When the gap is big enough, it's a pick."],
  ["Grade it", "Every pick is graded against the box score and stays on the record. Wins and losses. Nothing deleted."],
];

function About() {
  return (
    <Page eyebrow="How it works" title="Price it. Compare it. Grade it." intro="Profit Pilot is a free NBA and NFL player prop model.">
      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map(([t, d], i) => (
          <div key={t} className="ledger p-5">
            <div className="font-mono text-sm text-primary">0{i + 1}</div>
            <h3 className="mt-2 text-xl font-semibold">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}
