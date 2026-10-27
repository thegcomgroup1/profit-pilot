import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import parse, { attributesToProps, domToReact, Element, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";
import { Button } from "@/components/ui/button";
import { renderOriginal } from "@/lib/original-page";
import { siteQuery, slugify, type Sport } from "@/lib/sheet";

export function OriginalPage({ view, sport = "NBA", id = null }: { view: string; sport?: Sport; id?: string | null }) {
  const { data } = useSuspenseQuery(siteQuery);
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const [copied, setCopied] = useState(false);
  const internalId = view === "game" ? `g-${data.board.filter(r => r.Game === id).map(r => r.Date).sort().at(-1)?.replace(/-/g, "")}-${id?.replace("@", "-")}`
    : view === "writeup" ? (() => { const w = data.writeups.find(r => slugify(r) === id); return w ? `w-${w.Date.replace(/-/g, "")}-${slug(w.Player)}-${slug(w.Market)}-${slug(w.Side)}` : id; })() : id;
  function go(target: string) {
    if (target.startsWith("g-")) {
      const game = [...data.board, ...data.games].find(r => `g-${r.Date.replace(/-/g, "")}-${r.Game.replace("@", "-")}` === target);
      if (game) void navigate({ to: "/game/$id", params: { id: game.Game }, search: { sport } });
    } else if (target.startsWith("w-")) {
      const w = data.writeups.find(r => `w-${r.Date.replace(/-/g, "")}-${slug(r.Player)}-${slug(r.Market)}-${slug(r.Side)}` === target);
      if (w) void navigate({ to: "/why/$slug", params: { slug: slugify(w) }, search: { sport } });
    } else {
      const to = target === "record" ? "/record" : target === "edges" ? "/edges" : target === "reads" ? "/why" : target === "method" ? "/about" : "/";
      void navigate({ to, search: { sport } });
    }
  }
  const options: HTMLReactParserOptions = {
    replace(node) {
      if (!(node instanceof Element)) return;
      const a = node.attribs;
      if (node.name === "button") {
        const props = attributesToProps(a);
        const onClick = () => {
          if (a["data-go"]) { go(a["data-go"]); if(a["data-mf"]) setTimeout(() => document.querySelector('[id^="m-First"]')?.scrollIntoView(), 200); }
          if (a["data-jump"]) document.getElementById(a["data-jump"])?.scrollIntoView({ behavior: "smooth" });
          for (const k of ["gf", "ef", "emk", "rf", "rmk", "oc", "os"]) {
            const v = a[`data-${k}`];
            if (v) setFilters(f => ({ ...f, [k]: v, ...(k === "rf" ? { rmk: "All", shown: 40 } : k === "rmk" ? { shown: 40 } : {}) }));
          }
          if (a["data-sp"] === "NFL") void navigate({ to: "/record", search: { sport: "NFL" } });
          if (a["id"] === "more") setFilters(f => ({ ...f, shown: Number(f["shown"] ?? 40) + 60 }));
          if (a["id"] === "share") navigator.clipboard.writeText(location.href).then(() => setCopied(true)).catch(() => setCopied(false));
        };
        return <Button {...props} variant="ghost" onClick={onClick}>{a["id"] === "share" && copied ? "Link copied" : domToReact(node.children as DOMNode[], options)}</Button>;
      }
      if (node.name === "input" && a["id"] === "q") return <input {...attributesToProps(a)} value={String(filters["q"] ?? "")} onChange={e => setFilters(f => ({ ...f, q: e.target.value }))} />;
      return;
    },
  };
  return <main className="wrap">{parse(renderOriginal(view, data, sport, internalId ?? null, filters), options)}</main>;
}

function slug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }