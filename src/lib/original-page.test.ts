import { describe, expect, it } from "vitest";
import { renderOriginal } from "./original-page";
import type { SiteData, Row } from "./sheet";

function row(partial: Record<string, string>): Row {
  return { Date: "", Sport: "", Game: "", Player: "", Team: "", Market: "", Side: "", Line: "", Price: "", Book: "", Projection: "", Tier: "", Type: "", Confidence: "", Note: "", Favorite: "", Spread: "", Total: "", Ticket: "", Legs: "", Headline: "", Body: "", Result: "", Units: "", Actual: "", Role: "", "Our %": "", "Book %": "", "Edge %": "", "Est. odds": "", "What kills it": "", "Post-mortem": "", "Tip ET": "", ...partial } as Row;
}

const site = (record: Row[]): SiteData => ({ board: [], games: [], tickets: [], writeups: [], record });

describe("record view", () => {
  it("shows only Model picks and Picks · 3%+ edge tiles", () => {
    const html = renderOriginal("record", site([]), "NBA", null);
    expect(html).toContain("Model picks");
    expect(html).toContain("Picks · 3%+ edge");
    expect(html).not.toContain("Unders · every row");
    expect(html).not.toContain("Every row priced");
  });

  it("uses the new record intro copy", () => {
    const html = renderOriginal("record", site([]), "NBA", null);
    expect(html).toContain("Only picks that clear the full model AND the sharp-money check count here");
    expect(html).toContain("The record starts Oct 22, 2026");
    expect(html).toContain("Losses stay on the record.");
  });

  it("shows the sharp-backed empty state when the tab's first cell starts with No sharp-backed", () => {
    const note = row({ Date: "No sharp-backed picks yet" });
    const html = renderOriginal("record", site([note]), "NBA", null);
    expect(html).toContain("The sharp-backed record starts with tonight's picks. Check back tomorrow morning.");
  });

  it("keeps the default empty state when the tab is simply empty", () => {
    const html = renderOriginal("record", site([]), "NBA", null);
    expect(html).toContain("NBA grading starts after the first board. Check back tomorrow morning.");
    expect(html).not.toContain("The sharp-backed record starts with tonight's picks");
  });
});

describe("game view", () => {
  it("tags Lean rows with a grey Lean tag", () => {
    const data: SiteData = {
      board: [
        row({ Date: "2026-10-22", Sport: "NBA", Game: "BOS@NYK", Player: "Jayson Tatum", Team: "BOS", Market: "PTS", Side: "Over", Line: "30.5", Price: "-110", "Edge %": "4.0", Type: "Lean" }),
      ],
      games: [row({ Date: "2026-10-22", Sport: "NBA", Game: "BOS@NYK", "Tip ET": "7:30 PM" })],
      tickets: [], writeups: [], record: [],
    };
    const html = renderOriginal("game", data, "NBA", "g-20261022-BOS-NYK");
    expect(html).toContain('<span class="tag">Lean</span>');
  });
});
