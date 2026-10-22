import { createFileRoute } from "@tanstack/react-router";
import { OriginalPage } from "@/components/original-page";
import { Page, ErrorBox } from "@/components/site";
import { siteQuery, sportSearch, type Row } from "@/lib/sheet";
export const Route = createFileRoute("/record")({
 validateSearch: sportSearch,
 loader: ({context}) => context.queryClient.ensureQueryData(siteQuery),
 head: () => ({meta:[{title:"Record — Profit Pilot"},{name:"description",content:"Every pick. Graded. Nothing deleted."},{property:"og:title",content:"Record — Profit Pilot"},{property:"og:description",content:"Every pick. Graded. Nothing deleted."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
 component:Content,
 errorComponent: ({error}) => <Page eyebrow="Record" title="Every pick. Graded. Nothing deleted."><ErrorBox error={error}/></Page>,
});
export function summarize(rows: Row[]) {
  const w = rows.filter((r) => r.Result === "WIN").length;
  const l = rows.filter((r) => r.Result === "LOSS").length;
  const p = rows.filter((r) => r.Result === "PUSH").length;
  const units = rows.reduce((s, r) => s + (Number(r.Units) || 0), 0);
  return { w, l, p, units };
}


function Content(){ const sport = Route.useSearch().sport ?? "NBA"; return <OriginalPage key={sport} view="record" sport={sport} />}
