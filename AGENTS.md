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

## Application structure
- Use the existing TanStack routes and shared storefront layout; browser-only Fabric and Three.js modules load lazily behind ClientOnly to keep SSR safe.
- Preserve structured designs in cart state and save user-owned configurations through RLS-protected Cloud records; store uploaded artwork in private storage and resolve temporary signed URLs only for editing.
- Keep checkout and administration disabled until verified commerce services and server-authorized operational data exist; local preview state is never order or payment confirmation.
- Keep one shared auth provider for session-driven navigation; clear protected query caches before signing out.
