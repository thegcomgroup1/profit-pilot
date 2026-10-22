import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, ErrorBox, Page } from "@/components/site";
import { fmtDay, price, siteQuery, slugify } from "@/lib/sheet";

export const Route = createFileRoute("/why/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: () => ({
    meta: [
      { title: "The why behind every main pick — Profit Pilot" },
      { name: "description", content: "Write-ups explaining the role, the number and the risk behind each main pick." },
      { property: "og:title", content: "The why behind every main pick" },
      { property: "og:description", content: "Write-ups behind each Profit Pilot main pick." },
    ],
  }),
  component: Why,
  errorComponent: ({ error }) => <Page eyebrow="Why" title="The why behind every main pick"><ErrorBox error={error} /></Page>,
});

function Why() {
  const { data } = useSuspenseQuery(siteQuery);
  const list = [...data.writeups].sort((a, b) => b.Date.localeCompare(a.Date));
  return (
    <Page eyebrow="Write-ups" title="The why behind every main pick">
      {!list.length ? <Empty>No write-ups yet.</Empty> : (
        <div className="grid gap-4">
          {list.map((w) => (
            <Link key={slugify(w)} to="/why/$slug" params={{ slug: slugify(w) }} className="ledger block p-5 transition hover:border-primary">
              <div className="eyebrow">{w.Sport} · {fmtDay(w.Date)} · {w.Game}</div>
              <div className="mt-2 font-mono text-sm text-primary">{w.Player} {w.Side} {w.Line} {w.Market} ({price(w.Price)})</div>
              <h3 className="mt-2 text-xl font-semibold leading-snug">{w.Headline}</h3>
            </Link>
          ))}
        </div>
      )}
    </Page>
  );
}
