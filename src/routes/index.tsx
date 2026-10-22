import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, ErrorBox, Page, PropRow, SportTabs } from "@/components/site";
import { fmtDay, latestDate, pct, siteQuery, sportSearch } from "@/lib/sheet";

export const Route = createFileRoute("/")({
  validateSearch: sportSearch,
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: () => ({
    meta: [
      { title: "Profit Pilot — Today's NBA & NFL prop board" },
      { name: "description", content: "Our number vs the book's on every player prop today, NBA and NFL." },
      { property: "og:title", content: "Profit Pilot — Today's prop board" },
      { property: "og:description", content: "Our number vs the book's on every player prop today." },
    ],
  }),
  component: Board,
  errorComponent: ({ error }) => <Page eyebrow="Board" title="Our number vs the book's"><ErrorBox error={error} /></Page>,
});

function Board() {
  const sport = Route.useSearch().sport ?? "NBA";
  const { data } = useSuspenseQuery(siteQuery);
  const board = data.board.filter((r) => r.Sport === sport);
  const day = latestDate(board);
  const picks = board.filter((r) => r.Date === day);
  const games = data.games.filter((g) => g.Sport === sport && g.Date === day);
  const tickets = data.tickets.filter((t) => t.Sport === sport && t.Date === day);

  return (
    <Page eyebrow={`${sport} board${day ? ` · ${fmtDay(day)}` : ""}`} title="Our number vs the book's"
      intro="Every prop we price, side by side with the book's implied odds. Green means we like it more than they do.">
      <SportTabs sport={sport} to="/" />
      {!picks.length ? (
        <Empty>Next {sport} board is on the way.</Empty>
      ) : (
        <>
          {games.length > 0 && (
            <div className="mb-10 grid gap-3 sm:grid-cols-2">
              {games.map((g) => (
                <Link key={g.Game} to="/game/$id" params={{ id: g.Game }} className="ledger block p-4 transition hover:border-primary">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-xl font-semibold">{g.Game}</span>
                    <span className="eyebrow">{g["Tip ET"]}</span>
                  </div>
                  <div className="mt-1 font-mono text-xs text-muted-foreground">
                    {g.Favorite} -{g.Spread} · O/U {g.Total}
                  </div>
                  {g.Note && <p className="mt-2 text-sm text-muted-foreground">{g.Note}</p>}
                </Link>
              ))}
            </div>
          )}
          <h2 className="mb-3 text-2xl font-semibold">Today's picks</h2>
          <div className="ledger">{picks.map((p, i) => <PropRow key={i} p={p} />)}</div>
          {tickets.length > 0 && (
            <>
              <h2 className="mb-3 mt-10 text-2xl font-semibold">Tickets</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {tickets.map((t, i) => (
                  <div key={i} className="ledger p-4">
                    <div className="flex justify-between gap-2">
                      <h3 className="text-lg font-semibold">{t.Ticket}</h3>
                      <span className="eyebrow">{t.Tier}</span>
                    </div>
                    <ul className="mt-2 space-y-1 font-mono text-xs">
                      {t.Legs.split("|").map((l) => <li key={l}>{l.trim()}</li>)}
                    </ul>
                    <div className="mt-3 flex gap-4 font-mono text-xs">
                      <span>Odds +{t["Est. odds"]}</span><span className="text-primary">Ours {pct(t["Our %"])}</span>
                    </div>
                    {t["What kills it"] && <p className="mt-2 text-sm text-muted-foreground">Kills it: {t["What kills it"]}</p>}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Page>
  );
}
