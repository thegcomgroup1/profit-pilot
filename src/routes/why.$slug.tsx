import { createFileRoute } from "@tanstack/react-router";
import { OriginalPage } from "@/components/original-page";
import { Page, ErrorBox } from "@/components/site";
import { siteQuery, sportSearch, type Row } from "@/lib/sheet";
export const Route = createFileRoute("/why/$slug")({
 validateSearch: sportSearch,
 loader: ({context}) => context.queryClient.ensureQueryData(siteQuery),
 head: () => ({meta:[{title:"Pick breakdown — Profit Pilot"},{name:"description",content:"The reasoning behind the pick"},{property:"og:title",content:"Pick breakdown — Profit Pilot"},{property:"og:description",content:"The reasoning behind the pick"},{property:"og:type",content:"article"},{name:"twitter:card",content:"summary_large_image"}]}),
 component:Writeup,
 errorComponent: ({error}) => <Page eyebrow="Pick breakdown" title="The reasoning behind the pick"><ErrorBox error={error}/></Page>,
});

function Writeup(){const { slug: id } = Route.useParams(); const sport = Route.useSearch().sport ?? "NBA"; return <OriginalPage key={sport} view="writeup" sport={sport} id={id}/>}
