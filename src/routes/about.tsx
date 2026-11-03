import { createFileRoute } from "@tanstack/react-router";
import { OriginalPage } from "@/components/original-page";
import { Page, ErrorBox } from "@/components/site";
import { siteQuery, sportSearch, type Row } from "@/lib/sheet";
export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
 validateSearch: sportSearch,
 loader: ({context}) => context.queryClient.ensureQueryData(siteQuery),
 head: () => ({meta:[{title:"How it works — The Aviator — Profit Pilot"},{name:"description",content:"Learn how the NBA and NFL player-prop model projects outcomes, compares sportsbook prices, checks sharp money, and grades picks against official box scores."},{property:"og:title",content:"How it works — The Aviator — Profit Pilot"},{property:"og:description",content:"Learn how the NBA and NFL player-prop model projects outcomes, compares sportsbook prices, checks sharp money, and grades picks against official box scores."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
 component:Content,
 errorComponent: ({error}) => <Page eyebrow="How it works" title="Price it. Compare it. Grade it."><ErrorBox error={error}/></Page>,
});

function Content(){ const sport = Route.useSearch().sport ?? "NBA"; return <OriginalPage key={sport} view="method" sport={sport} />}
