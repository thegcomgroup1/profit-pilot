import { createFileRoute } from "@tanstack/react-router";
import { OriginalPage } from "@/components/original-page";
import { Page, ErrorBox } from "@/components/site";
import { siteQuery, sportSearch, slugify, type Row } from "@/lib/sheet";
export const Route = createFileRoute("/why/$slug")({
  staticData: { sitemap: true },
 validateSearch: sportSearch,
 loader: ({context}) => context.queryClient.ensureQueryData(siteQuery),
 head: ({ params, loaderData }) => {
   const writeup = loaderData?.writeups.find(row => slugify(row) === params.slug);
   const clean = (text: string) => text.replace(/\bClaude\b/gi, "Model A").replace(/\bGemini\b/gi, "Model B");
   const title = writeup ? `${clean(writeup.Headline || `${writeup.Player} ${writeup.Market} pick breakdown`)} — The Aviator — Profit Pilot` : "Player-prop pick breakdown — The Aviator — Profit Pilot";
   const description = writeup ? `Read the ${clean(writeup.Player)} ${writeup.Side} ${writeup.Line} ${writeup.Market} breakdown for ${writeup.Game.replace("@", " at ")} on ${writeup.Date}: model reasoning, matchup, sharp-money checks, and how the pick can lose.` : "Read the reasoning behind a player-prop model pick, including player role, matchup, sharp-money checks, risks, and available postgame grading.";
   return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: clean(description) }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }] };
 },
 component:Writeup,
 errorComponent: ({error}) => <Page eyebrow="Pick breakdown" title="The reasoning behind the pick"><ErrorBox error={error}/></Page>,
});

function Writeup(){const { slug: id } = Route.useParams(); const sport = Route.useSearch().sport ?? "NBA"; return <OriginalPage key={sport} view="writeup" sport={sport} id={id}/>}
