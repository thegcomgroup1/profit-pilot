import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, ErrorBox, Page } from "@/components/site";
import { price, siteQuery, type Row } from "@/lib/sheet";

const filters = { all: "All picks", NBA: "NBA", NFL: "NFL" } as const;
type F = keyof typeof filters;

export const Route = createFileRoute("/record")({
  validateSearch: (s: Record<string, unknown>): { f?: F } => (s["f"] === "NBA" || s["f"] === "NFL" ? { f: s["f"] } : {}),
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
  head: () => ({
    meta: [
      { title: "Record — every Profit Pilot pick, graded" },
      { name: "description", content: "Every pick. Graded against the box score. Nothing deleted." },
      { property: "og:title", content: "Profit Pilot record" },
      { property: "og:description", content: "Every pick graded against the box score. Nothing deleted." },
    ],
  }),
  component: Record_,
  errorComponent: ({ error }) => <Page eyebrow="Record" title="Every pick. Graded."><ErrorBox error={error} /></Page>,
});

export function summarize(rows: Row[]) {
  const w = rows.filter((r) => r.Result === "WIN").length;
  const l = rows.filter((r) => r.Result === "LOSS").length;
  const p = rows.filter((r) => r.Result === "PUSH").length;
  const units = rows.reduce((s, r) => s + (Number(r.Units) || 0), 0);
  return { w, l, p, units };
}

function Record_() {
  const f = Route.useSearch().f ?? "all";
  const { data } = useSuspenseQuery(siteQuery);
  const rows = data.record.filter((r) => r.Result && (f === "all" || r.Sport === f));
  const s = summarize(rows);
  const tone = (r: string) => (r === "WIN" ? "bg-accent text-primary" : r === "LOSS" ? "bg-destructive-soft text-destructive" : "bg-secondary text-muted-foreground");

  return (
    <Page eyebrow="Record" title="Every pick. Graded. Nothing deleted.">
      <div className="mb-6 flex flex-wrap gap-2">
        {(Object.keys(filters) as F[]).map((k) => (
          <Link key={k} to="/record" search={{ f: k }}
            className={`rounded-md border px-3 py-1.5 font-mono text-xs font-semibold ${k === f ? "bg-bar text-bar-foreground" : "bg-card text-muted-foreground"}`}>
            {filters[k]}
          </Link>
        ))}
      </div>
      <div className="mb-8 grid grid-cols-3 gap-3">
        {[["Record", `${s.w}-${s.l}${s.p ? `-${s.p}` : ""}`], ["Win rate", s.w + s.l ? `${((s.w / (s.w + s.l)) * 100).toFixed(1)}%` : "—"], ["Units", `${s.units >= 0 ? "+" : ""}${s.units.toFixed(2)}`]].map(([k, v]) => (
          <div key={k} className="ledger p-4">
            <div className="eyebrow">{k}</div>
            <div className={`mt-1 font-display text-3xl font-bold ${k === "Units" ? (s.units >= 0 ? "text-primary" : "text-destructive") : ""}`}>{v}</div>
          </div>
        ))}
      </div>
      {!rows.length ? <Empty>No graded picks yet.</Empty> : (
        <div className="ledger overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left">{["Date", "Pick", "Price", "Actual", "Result", "Units"].map((h) => <th key={h} className="eyebrow p-3">{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="p-3 font-mono text-xs text-muted-foreground">{r.Date}<br />{r.Sport} · {r.Game}</td>
                  <td className="p-3"><div className="font-semibold">{r.Player}</div><div className="font-mono text-xs text-muted-foreground">{r.Side} {r.Line} {r.Market}</div></td>
                  <td className="p-3 font-mono text-xs">{price(r.Price)}</td>
                  <td className="p-3 font-mono text-xs">{r.Actual}</td>
                  <td className="p-3"><span className={`rounded px-2 py-0.5 font-mono text-xs font-semibold ${tone(r.Result)}`}>{r.Result}</span></td>
                  <td className="p-3 font-mono text-xs">{r.Units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Page>
  );
}
