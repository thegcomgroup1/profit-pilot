<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Site data is read from the public Google Sheet (gviz CSV) via one server function in src/lib/sheet.ts, cached with React Query; the sheet stays the single source of truth so the owner edits picks there.
- Preserve the supplied HTML's pure view templates through the React adapter in original-page; TanStack routes and shared controls handle navigation and interaction so the original presentation remains faithful without embedding a separate app.
