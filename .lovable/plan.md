# Profit Pilot Prediction Model

Rebuild the uploaded Profit Pilot page as a proper multi-page site, keeping its look (dark green bar, paper "ledger" pages, Fraunces / IBM Plex fonts, mint/gold/loss colors, light + dark mode) and the wing logo.

Note: the Claude chat link can't be opened from here, so this plan is based on the uploaded page.

## Pages
- **Board (/)** — "Our number vs the book's": today's picks for NBA / NFL (sport switcher), tickets.
- **Game (/game/$id)** — prop analyzer for one matchup, markets with model vs book line.
- **Edges (/edges)** — "Where we disagree with the book".
- **Record (/record)** — "Every pick. Graded. Nothing deleted." with range filters and win/loss totals.
- **Write-ups (/why, /why/$slug)** — "The why behind every main pick".
- **How it works (/about)** — "Price it. Compare it. Grade it."; links to Substack and X.

## Data
Keep reading from the same Google Sheet tabs the current page uses (public CSV export), so you keep updating the sheet as today. Empty state: "Next board is on the way".

## Technical details
- Shared header/nav in __root; one route file per page; per-page head metadata.
- Sheet fetch + CSV parsing in a small data module, loaded via route loaders with React Query.
- Logo uploaded as a CDN asset; design tokens ported into styles.css (oklch).
- No backend needed yet.
