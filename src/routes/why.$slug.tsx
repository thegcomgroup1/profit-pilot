import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, ErrorBox, Page } from "@/components/site";
import { fmtDay, pct, price, siteQuery, slugify } from "@/lib/sheet";

export const Route = createFileRoute("/why/$slug")({
  loader: async ({ context, params }) => {
    const d = await context.queryClient.ensureQueryData(siteQuery);
    const w = d.writeups.find((x) => slugify(x) === params.slug);
    return { title: w ? `${w.Player} ${w.Side} ${w.Line} ${w.Market}` : "Write-up", headline: w?.Headline ?? "" };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Write-up"} — Profit Pilot` },
      { name: "description", content: loaderData?.headline?.slice(0, 155) ?? "" },
      { property: "og:title", content: loaderData?.title ?? "Profit Pilot write-up" },
      { property: "og:description", content: loaderData?.headline?.slice(0, 155) ?? "" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: Writeup,
  errorComponent: ({ error }) => <Page eyebrow="Write-up" title="Write-up"><ErrorBox error={error} /></Page>,
});

function Writeup() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(siteQuery);
  const w = data.writeups.find((x) => slugify(x) === slug);
  if (!w) return <Page eyebrow="Write-up" title="Not found"><Empty>That write-up isn't here.</Empty></Page>;
  return (
    <Page eyebrow={`${w.Sport} · ${fmtDay(w.Date)} · ${w.Game}`} title={`${w.Player} ${w.Side} ${w.Line} ${w.Market}`}>
      <Link to="/why" className="mb-6 inline-block text-sm text-primary">← All write-ups</Link>
      <div className="mb-6 flex flex-wrap gap-4 font-mono text-xs">
        <span>{price(w.Price)} at {w.Book}</span>
        <span className="text-primary">Ours {pct(w["Our %"])}</span>
        <span className="text-muted-foreground">Book {pct(w["Book %"])}</span>
      </div>
      <h2 className="text-2xl font-semibold leading-snug">{w.Headline}</h2>
      <article className="mt-6 max-w-2xl space-y-4 leading-relaxed">
        {w.Body.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
      </article>
      {w["Post-mortem"] && (
        <div className="ledger mt-8 max-w-2xl p-5">
          <div className="eyebrow">Post-mortem</div>
          <p className="mt-2">{w["Post-mortem"]}</p>
        </div>
      )}
    </Page>
  );
}
