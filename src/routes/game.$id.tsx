import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, ErrorBox, Page, PropRow } from "@/components/site";
import { fmtDay, latestDate, siteQuery } from "@/lib/sheet";

export const Route = createFileRoute("/game/$id")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} props — Profit Pilot` },
      { name: "description", content: `Every ${params.id} player prop we price, our number vs the book's.` },
      { property: "og:title", content: `${params.id} props — Profit Pilot` },
      { property: "og:description", content: `Our number vs the book's for ${params.id}.` },
      { property: "og:type", content: "article" },
    ],
  }),
  component: Game,
  errorComponent: ({ error }) => <Page eyebrow="Game" title="Game"><ErrorBox error={error} /></Page>,
});

function Game() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(siteQuery);
  const all = data.board.filter((r) => r.Game === id);
  const day = latestDate(all);
  const props = all.filter((r) => r.Date === day);
  const g = data.games.find((x) => x.Game === id && x.Date === day);
  const markets = [...new Set(props.map((p) => p.Market))];

  return (
    <Page eyebrow={`${props[0]?.Sport ?? ""} · ${fmtDay(day)} ${g?.["Tip ET"] ?? ""}`} title={id.replace("@", " at ")}
      intro={g ? `${g.Favorite} -${g.Spread} · O/U ${g.Total}. ${g.Note}` : undefined}>
      <Link to="/" className="mb-6 inline-block text-sm text-primary">← Back to the board</Link>
      {!props.length ? <Empty>No props priced for this game yet.</Empty> : markets.map((m) => (
        <section key={m} className="mb-8">
          <h3 className="mb-3 text-xl font-semibold">{m}</h3>
          <div className="ledger">{props.filter((p) => p.Market === m).map((p, i) => <PropRow key={i} p={p} />)}</div>
        </section>
      ))}
    </Page>
  );
}
