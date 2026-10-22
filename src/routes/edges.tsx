import { createFileRoute } from "@tanstack/react-router";
import { OriginalPage } from "@/components/original-page";
import { Page, ErrorBox } from "@/components/site";
import { siteQuery, sportSearch, type Row } from "@/lib/sheet";
export const Route = createFileRoute("/edges")({
 validateSearch: sportSearch,
 loader: ({context}) => context.queryClient.ensureQueryData(siteQuery),
 head: () => ({meta:[{title:"Edges — Profit Pilot"},{name:"description",content:"Where the model disagrees with the book"},{property:"og:title",content:"Edges — Profit Pilot"},{property:"og:description",content:"Where the model disagrees with the book"},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
 component:Content,
 errorComponent: ({error}) => <Page eyebrow="Edges" title="Where the model disagrees with the book"><ErrorBox error={error}/></Page>,
});

function Content(){ const sport = Route.useSearch().sport ?? "NBA"; return <OriginalPage key={sport} view="edges" sport={sport} />}
