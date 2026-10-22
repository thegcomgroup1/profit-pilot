import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

const SHEET = "1dTxC7Bbtig2GbNb9fJPOcgaSKRdfCaIEMmNJltp-qRI";
type Known =
  | "Date" | "Sport" | "Game" | "Player" | "Team" | "Market" | "Side" | "Line" | "Price" | "Book"
  | "Projection" | "Tier" | "Type" | "Confidence" | "Note" | "Favorite" | "Spread" | "Total"
  | "Ticket" | "Legs" | "Headline" | "Body" | "Result" | "Units" | "Actual" | "Role"
  | "Our %" | "Book %" | "Edge %" | "Est. odds" | "What kills it" | "Post-mortem" | "Tip ET";
export type Row = { [K in Known]: string };

export function parseCsv(text: string): Row[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  if (!head) return [];
  return body
    .filter((r) => r.some((v) => v.trim()))
    .map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? "").trim()])) as Row);
}

/** Sheets sometimes sends dates as serial numbers (e.g. 46315). Normalize to YYYY-MM-DD. */
export function normDate(v: string): string {
  if (/^\d{5}$/.test(v)) {
    const d = new Date(Date.UTC(1899, 11, 30) + Number(v) * 86400000);
    return d.toISOString().slice(0, 10);
  }
  return v;
}

async function tab(name: string): Promise<Row[]> {
  const res = await fetch(
    `https://docs.google.com/spreadsheets/d/${SHEET}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`,
  );
  if (!res.ok) throw new Error(`Couldn't load "${name}" (${res.status})`);
  return parseCsv(await res.text()).map((r) => (r.Date ? { ...r, Date: normDate(r.Date) } : r));
}

export type SiteData = {
  board: Row[]; games: Row[]; tickets: Row[]; writeups: Row[]; record: Row[];
};

export const getSiteData = createServerFn({ method: "GET" }).handler(async (): Promise<SiteData> => {
  const [board, games, tickets, writeups, nba, nfl] = await Promise.all(
    ["Board", "Games", "Tickets", "Writeups", "Record NBA", "Record NFL"].map(tab),
  );
  const record = [
    ...nba.map((r) => ({ ...r, Sport: "NBA" })),
    ...nfl.map((r) => ({ ...r, Sport: "NFL" })),
  ].sort((a, b) => b.Date.localeCompare(a.Date));
  return { board, games, tickets, writeups, record };
});

export const siteQuery = queryOptions({
  queryKey: ["site"],
  queryFn: () => getSiteData(),
  staleTime: 5 * 60_000,
});

export const latestDate = (rows: Row[]) => rows.reduce((m, r) => (r.Date > m ? r.Date : m), "");
export const pct = (v?: string) => (v ? `${(Number(v) * 100).toFixed(1)}%` : "—");
export const price = (v?: string) => (!v ? "" : Number(v) > 0 ? `+${v}` : v);
export const slugify = (w: Row) =>
  `${w.Date}-${w.Player}-${w.Market}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const fmtDay = (d: string) =>
  d ? new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }) : "";
export const sports = ["NBA", "NFL"] as const;
export type Sport = (typeof sports)[number];
export const sportSearch = (s: Record<string, unknown>): { sport: Sport } => ({
  sport: s.sport === "NFL" ? "NFL" : "NBA",
});
