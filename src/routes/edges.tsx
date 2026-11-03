import { createFileRoute } from "@tanstack/react-router";
import { OriginalPage } from "@/components/original-page";
import { Page, ErrorBox } from "@/components/site";
import { siteQuery, sportSearch, type Row } from "@/lib/sheet";
export const Route = createFileRoute("/edges")({
  staticData: { sitemap: true },
 validateSearch: sportSearch,
 loader: ({context}) => context.queryClient.ensureQueryData(siteQuery),
 head: () => ({meta:[{title:"Edges — The Aviator — Profit Pilot"},{name:"description",content:"Compare player props by model edge, with filters for sharp-backed picks, market, player, and team. See model probabilities beside estimated sportsbook prices."},{property:"og:title",content:"Edges — The Aviator — Profit Pilot"},{property:"og:description",content:"Compare player props by model edge, with filters for sharp-backed picks, market, player, and team. See model probabilities beside estimated sportsbook prices."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
 component:Content,
 errorComponent: ({error}) => <Page eyebrow="Edges" title="Where the model disagrees with the book"><ErrorBox error={error}/></Page>,
});

function Content(){ const sport = Route.useSearch().sport ?? "NBA"; return <OriginalPage key={sport} view="edges" sport={sport} />}
