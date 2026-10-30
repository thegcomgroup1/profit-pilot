import { createFileRoute } from "@tanstack/react-router";
import { OriginalPage } from "@/components/original-page";
import { Page, ErrorBox } from "@/components/site";
import { siteQuery, sportSearch, type Row } from "@/lib/sheet";
export const Route = createFileRoute("/")({
 validateSearch: sportSearch,
 loader: ({context}) => context.queryClient.ensureQueryData(siteQuery),
 head: () => ({meta:[{title:"Flight Plan — The Aviator — Profit Pilot"},{name:"description",content:"Free NBA + NFL prop model. Every flight logged, every pick graded."},{property:"og:title",content:"Flight Plan — The Aviator — Profit Pilot"},{property:"og:description",content:"Free NBA + NFL prop model. Every flight logged, every pick graded."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
 component:Content,
 errorComponent: ({error}) => <Page eyebrow="Board" title="The model’s number vs the book’s"><ErrorBox error={error}/></Page>,
});

function Content(){ const sport = Route.useSearch().sport ?? "NBA"; return <OriginalPage key={sport} view="board" sport={sport} />}
