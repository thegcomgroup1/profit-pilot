import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { getSiteData, slugify } from "@/lib/sheet";
import { isSitemapRouteIncluded, sitemapPathForLocation, sitemapStaticPaths, sitemapXML, type SitemapEntry } from "@/lib/sitemap";

const BASE_URL = "https://profit-pilot-prediction-model.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map(path => ({ path }));
        const routeId = "/why/$slug";
        if (isSitemapRouteIncluded(router.routesById[routeId])) {
          // The public CSV reader returns the entire sheet and throws on failed tabs.
          const data = await getSiteData();
          for (const row of data.writeups) {
            // Default sport is NBA; NFL search variants cannot be represented by this
            // router's clean-path inventory. Keep the NBA pages rendered at these URLs.
            if (row.Sport && row.Sport !== "NBA") continue;
            const location = router.buildLocation({
              to: "/why/$slug", params: { slug: slugify(row) }, search: () => ({}), hash: "",
            });
            const path = sitemapPathForLocation(router, location, routeId);
            if (path) entries.push({ path });
          }
        }
        if (!entries.length) return new Response("No public sitemap pages", { status: 404 });
        return new Response(sitemapXML(BASE_URL, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});