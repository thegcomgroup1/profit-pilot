import { describe, expect, it } from "vitest";
import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { sitemapStaticPaths, sitemapXML } from "./sitemap";

describe("public sitemap", () => {
  it("includes public routes and excludes private subtrees and parameterized paths", () => {
    const root = createRootRoute({ staticData: { sitemap: false } });
    const home = createRoute({ getParentRoute: () => root, path: "/", staticData: { sitemap: true } });
    const about = createRoute({ getParentRoute: () => root, path: "about", staticData: { sitemap: true } });
    const hidden = createRoute({ getParentRoute: () => root, path: "hidden", staticData: { sitemap: "exclude-subtree" } });
    const child = createRoute({ getParentRoute: () => hidden, path: "child", staticData: { sitemap: true } });
    const article = createRoute({ getParentRoute: () => root, path: "why/$slug", staticData: { sitemap: true } });
    const router = createRouter({ routeTree: root.addChildren([home, about, hidden.addChildren([child]), article]) });
    expect(sitemapStaticPaths(router)).toEqual(["/", "/about"]);
  });

  it("uses the published origin, deduplicates entries and omits unsupported change dates", () => {
    const xml = sitemapXML("https://profit-pilot-prediction-model.lovable.app", [{ path: "/" }, { path: "/about" }, { path: "/about" }]);
    expect(xml.match(/<loc>/g)).toHaveLength(2);
    expect(xml).toContain("<loc>https://profit-pilot-prediction-model.lovable.app/about</loc>");
    expect(xml).not.toContain("<lastmod>");
  });

  it("rejects unsafe paths rather than emitting external URLs", () => {
    expect(() => sitemapXML("https://profit-pilot-prediction-model.lovable.app", [{ path: "//other.example/private" }])).toThrow("Invalid sitemap path");
  });
});