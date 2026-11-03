import { createFileRoute } from "@tanstack/react-router";
import { OriginalPage } from "@/components/original-page";
import { Page, ErrorBox } from "@/components/site";
import { siteQuery, sportSearch, type Row } from "@/lib/sheet";
export const Route = createFileRoute("/game/$id")({
  staticData: { sitemap: false },
 validateSearch: sportSearch,
 loader: ({context}) => context.queryClient.ensureQueryData(siteQuery),
 head: ({ params }) => {
   const matchup = params.id.replace("@", " at ");
   const title = `${matchup} player props — The Aviator — Profit Pilot`;
   const description = `Analyze ${matchup} player props with model projections, estimated sportsbook prices, model edges, and available game breakdowns. Filter by market or model picks.`;
   return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }] };
 },
 component:Game,
 errorComponent: ({error}) => <Page eyebrow="Game props" title="Player prop analyzer"><ErrorBox error={error}/></Page>,
});

function Game(){const { id } = Route.useParams(); const sport = Route.useSearch().sport ?? "NBA"; return <OriginalPage key={sport} view="game" sport={sport} id={id}/>}
