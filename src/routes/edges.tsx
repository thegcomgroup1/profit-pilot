import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, ErrorBox, Page, PropRow, SportTabs } from "@/components/site";
import { latestDate, siteQuery, sportSearch } from "@/lib/sheet";

export const Route = createFileRoute("/edges")({
  validateSearch: sportSearch,
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: () => ({
    meta: [
      { title: "Edges — where Profit Pilot disagrees with the book" },
      { name: "description", content: "Today's biggest gaps between our model's odds and the sportsbook's." },
      { property: "og:title", content: "Edges — Profit Pilot" },
      { property: "og:description", content: "The biggest gaps between our number and the book's." },
    ],
  }),
  component: Edges,
  errorComponent: ({ error }) => <Page eyebrow="Edges" title="Where we disagree with the book"><ErrorBox error={error} /></Page>,
});

function Edges() {
  const sport = Route.useSearch().sport ?? "NBA";
  const { data } = useSuspenseQuery(siteQuery);
  const board = data.board.filter((r) => r.Sport === sport);
  const day = latestDate(board);
  const rows = board
    .filter((r) => r.Date === day)
    .sort((a, b) => Number(b["Edge %"] || 0) - Number(a["Edge %"] || 0));
  return (
    <Page eyebrow={`${sport} edges`} title="Where we disagree with the book" intro="Sorted by the gap between our odds and the book's. Biggest first.">
      <SportTabs sport={sport} to="/edges" />
      {rows.length ? <div className="ledger">{rows.map((p, i) => <PropRow key={i} p={p} />)}</div> : <Empty>Next {sport} board is on the way.</Empty>}
    </Page>
  );
}
