import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import logo from "@/assets/logo.png.asset.json";
import { pct, price, sports, type Row, type Sport } from "@/lib/sheet";

const nav = [
  { to: "/", label: "Board" },
  { to: "/edges", label: "Edges" },
  { to: "/record", label: "Record" },
  { to: "/why", label: "Why" },
  { to: "/about", label: "How it works" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-bar text-bar-foreground">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo.url} alt="" className="h-8 w-8 rounded-md" />
          <span className="font-display text-lg font-semibold">Profit Pilot</span>
        </Link>
        <nav className="ml-auto flex flex-wrap gap-0.5">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-md px-2.5 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-bar-muted data-[status=active]:bg-highlight data-[status=active]:text-bar"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t py-8 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-4xl flex-wrap gap-4 px-4">
        <span>Profit Pilot — free NBA & NFL prop model. Not betting advice.</span>
        <a className="text-primary" href="https://teejtradez.substack.com" target="_blank" rel="noreferrer">Substack</a>
        <a className="text-primary" href="https://x.com/TeejTradez" target="_blank" rel="noreferrer">X / @TeejTradez</a>
      </div>
    </footer>
  );
}

export function Page({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-4xl px-4 pt-10">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{title}</h1>
      {intro && <p className="mt-3 max-w-2xl text-muted-foreground">{intro}</p>}
      <div className="mt-8">{children}</div>
    </main>
  );
}

export function SportTabs({ sport, to }: { sport: Sport; to: "/" | "/edges" }) {
  return (
    <div className="mb-6 inline-flex rounded-lg border bg-card p-1">
      {sports.map((s) => (
        <Link
          key={s}
          to={to}
          search={{ sport: s }}
          className={`rounded-md px-4 py-1.5 font-mono text-xs font-semibold tracking-widest ${s === sport ? "bg-bar text-bar-foreground" : "text-muted-foreground"}`}
        >
          {s}
        </Link>
      ))}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="ledger p-8 text-center text-muted-foreground">{children}</div>;
}

export function PropRow({ p }: { p: Row }) {
  const edge = Number(p["Edge %"] || 0);
  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b p-4 last:border-b-0 sm:grid-cols-[1.6fr_1fr_1fr_auto]">
      <div>
        <div className="font-semibold">{p.Player}</div>
        <div className="font-mono text-xs text-muted-foreground">
          {p.Side} {p.Line} {p.Market} · {price(p.Price)} {p.Book && `· ${p.Book}`}
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="eyebrow">Ours / Book</div>
        <div className="font-mono text-sm">{pct(p["Our %"])} / {pct(p["Book %"])}</div>
      </div>
      <div className="hidden sm:block">
        <div className="eyebrow">Projection</div>
        <div className="font-mono text-sm">{p.Projection || "—"}</div>
      </div>
      <div className="text-right">
        <span className={`rounded px-2 py-1 font-mono text-xs font-semibold ${edge >= 5 ? "bg-accent text-primary" : "bg-gold-soft text-gold"}`}>
          {edge ? `+${edge.toFixed(1)}%` : p.Tier || "—"}
        </span>
      </div>
      {p.Note && <p className="col-span-full text-sm text-muted-foreground">{p.Note}</p>}
    </div>
  );
}

export function ErrorBox({ error }: { error: unknown }) {
  return <Empty>Couldn't load the latest numbers. {error instanceof Error ? error.message : ""}</Empty>;
}
