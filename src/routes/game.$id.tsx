import { createFileRoute } from "@tanstack/react-router";
import { OriginalPage } from "@/components/original-page";
import { Page, ErrorBox } from "@/components/site";
import { siteQuery, sportSearch, type Row } from "@/lib/sheet";
export const Route = createFileRoute("/game/$id")({
 validateSearch: sportSearch,
 loader: ({context}) => context.queryClient.ensureQueryData(siteQuery),
 head: () => ({meta:[{title:"Game props — The Aviator — Profit Pilot"},{name:"description",content:"Player prop analyzer"},{property:"og:title",content:"Game props — The Aviator — Profit Pilot"},{property:"og:description",content:"Player prop analyzer"},{property:"og:type",content:"article"},{name:"twitter:card",content:"summary_large_image"}]}),
 component:Game,
 errorComponent: ({error}) => <Page eyebrow="Game props" title="Player prop analyzer"><ErrorBox error={error}/></Page>,
});

function Game(){const { id } = Route.useParams(); const sport = Route.useSearch().sport ?? "NBA"; return <OriginalPage key={sport} view="game" sport={sport} id={id}/>}
