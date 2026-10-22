import { describe, expect, it } from "vitest";
import { normDate, parseCsv } from "./sheet";

describe("sheet helpers", () => {
  it("converts serial dates", () => expect(normDate("46315")).toBe("2026-10-20"));
  it("parses quoted CSV", () => {
    expect(parseCsv('"A","B"\n"x, y","say ""hi"""\n')).toEqual([{ A: "x, y", B: 'say "hi"' }]);
  });
});
