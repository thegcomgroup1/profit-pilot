import type { Row } from "./sheet";

export const categories = [
  { key: "POINTS", label: "💥 Points" },
  { key: "THREES", label: "🎯 Threes" },
  { key: "BOARDS", label: "🧱 Boards" },
  { key: "DIMES", label: "🪄 Dimes" },
  { key: "DDTD", label: "🔺 Double/Triple-Doubles" },
  { key: "COMBOS", label: "⚡ Combos" },
  { key: "STOCKS", label: "🛡️ Stocks" },
] as const;

export const sourceOf = (r: Row) => r.Source?.trim() === "Model B" ? "Model B" : "Model A";
export const flagsOf = (r: Row) => (r.Flags ?? "").split(/[·|]/).map(f => f.trim()).filter(Boolean);
export const categoryOf = (r: Row) => flagsOf(r)[0]?.toUpperCase() ?? "";
export const publicPicks = (rows: Row[]) => rows.filter(r => r.Type === "Straight");
export const extraRows = (rows: Row[]) => rows.filter(r => r.Type === "Lean" || r.Type === "Pass");

export function groupGems(rows: Row[], category: string, source = "All") {
  const grouped = new Map<string, Row[]>();
  for (const r of rows) {
    if (r.Type !== "Gem" || categoryOf(r) !== category || (source !== "All" && sourceOf(r) !== source)) continue;
    // Match within the same game: identical names on different matchups are not the same bet.
    const key = [r.Game, r.Player, r.Market, r.Side, r.Line].map(v => (v ?? "").trim().toLowerCase()).join("|");
    const entries = grouped.get(key) ?? [];
    if (!entries.some(e => sourceOf(e) === sourceOf(r))) entries.push(r);
    grouped.set(key, entries);
  }
  return [...grouped.values()].flatMap(entries => {
    const first = entries[0];
    if (!first) return [];
    return [{ row: first, entries, source: entries.length > 1 ? "Both models" : sourceOf(first) }];
  });
}

export function categoryTickets(tickets: Row[], category: string, source = "All") {
  return tickets.filter(t => (t.Ticket ?? "").toUpperCase().startsWith(category + " ") && (source === "All" || sourceOf(t) === source));
}

export function orderTickets(tickets: Row[]) {
  const rank = (t: Row) => t.Tier === "Outlier Lotto" ? 0 : t.Tier === "Moonshot" ? 1 : categories.some(c => (t.Ticket ?? "").toUpperCase().startsWith(c.key + " ")) ? 2 : 3;
  return [...tickets].sort((a, b) => rank(a) - rank(b));
}

export function splitBreakdown(text: string) {
  const narrative: string[] = [];
  const body = (text ?? "").split(/\r?\n/).filter(line => {
    if (!/^\s*NARRATIVE\s*:/i.test(line)) return true;
    narrative.push(...line.trim().split("|").map(part => part.trim()).filter(Boolean));
    return false;
  }).join("\n").trim();
  return { body, narrative };
}