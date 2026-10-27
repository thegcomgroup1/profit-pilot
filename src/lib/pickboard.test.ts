import { describe, expect, it } from "vitest";
import { categories, sourceOf, categoryOf, flagsOf, groupGems, publicPicks, extraRows, categoryTickets, orderTickets, splitBreakdown } from "./pickboard";
import { renderOriginal } from "./original-page";
import type { Row, SiteData } from "./sheet";

const row = (values: Partial<Row>): Row => ({ Date: "2026-10-27", Sport: "NBA", Game: "BOS@NYK", Player: "Jayson Tatum", Market: "3PM", Side: "", Line: "4+", Flags: "THREES · THREES_UP · FIT", Type: "Gem", ...values } as Row);
const data = (board: Row[], games: Row[] = [], tickets: Row[] = []): SiteData => ({ board, games, tickets, record: [], writeups: [] });

describe("Pickboard v2.1 rules", () => {
  it("defaults a blank legacy source to Model A", () => {
    expect(sourceOf(row({ Source: "" }))).toBe("Model A");
    expect(sourceOf(row({ Source: "Model B" }))).toBe("Model B");
  });
  it("uses the first flag as the category and the rest as chips", () => {
    expect(categoryOf(row({}))).toBe("THREES");
    expect(flagsOf(row({})).slice(1)).toEqual(["THREES_UP", "FIT"]);
    expect(categories.map(c => c.key)).toEqual(["POINTS", "THREES", "BOARDS", "DIMES", "DDTD", "COMBOS", "STOCKS"]);
  });
  it("merges the same player and bet from both models while keeping their prices and theses", () => {
    const gems = groupGems([row({ Source: "Model A", Price: "+400", Thesis: "A thesis" }), row({ Source: "Model B", Price: "+450", Thesis: "B thesis" })], "THREES");
    expect(gems).toHaveLength(1);
    expect(gems[0]?.source).toBe("Both models");
    expect(gems[0]?.entries.map(r => [r.Price, r.Thesis])).toEqual([["+400", "A thesis"], ["+450", "B thesis"]]);
  });
  it("filters gems by category and model without merging different bets", () => {
    const rows = [row({ Source: "Model A" }), row({ Source: "Model B" }), row({ Source: "Model B", Line: "5+" }), row({ Source: "Model B", Flags: "POINTS · FIT" })];
    expect(groupGems(rows, "THREES", "Model A")).toHaveLength(1);
    expect(groupGems(rows, "THREES", "Model B")).toHaveLength(2);
    expect(groupGems(rows, "POINTS", "Model B")).toHaveLength(1);
  });
  it("only includes Straight rows in public picks and puts Lean/Pass in extras", () => {
    const rows = ["Straight", "Gem", "Lean", "Pass", "Fade"].map(Type => row({ Type }));
    expect(publicPicks(rows).map(r => r.Type)).toEqual(["Straight"]);
    expect(extraRows(rows).map(r => r.Type)).toEqual(["Lean", "Pass"]);
  });
  it("puts Outlier Lotto and Moonshot before category parlays", () => {
    const tickets = [row({ Ticket: "THREES parlay", Tier: "Category", Source: "Model B" }), row({ Ticket: "Moon", Tier: "Moonshot" }), row({ Ticket: "Lotto", Tier: "Outlier Lotto" })];
    expect(orderTickets(tickets).map(t => t.Ticket)).toEqual(["Lotto", "Moon", "THREES parlay"]);
    expect(categoryTickets(tickets, "THREES", "Model B").map(t => t.Ticket)).toEqual(["THREES parlay"]);
    expect(categoryTickets(tickets, "THREES", "Model A")).toEqual([]);
  });
  it("separates the narrative from the game thesis into four fields", () => {
    expect(splitBreakdown("Game thesis\nNARRATIVE: revenge game | PRICED IN yes | OPPOSITE SCRIPT 35% | VERDICT pass")).toEqual({ body: "Game thesis", narrative: ["NARRATIVE: revenge game", "PRICED IN yes", "OPPOSITE SCRIPT 35%", "VERDICT pass"] });
  });
  it("keeps games available when today's sheet has breakdowns but no board rows", () => {
    const html = renderOriginal("board", data([], [row({ Breakdown: "Game-only thesis", "Model B Thesis": "Second view" })]), "NBA", null);
    expect(html).toContain("Game-only thesis");
    expect(html).toContain("Second view");
    expect(html).not.toContain("Next NBA board is on the way");
  });
});