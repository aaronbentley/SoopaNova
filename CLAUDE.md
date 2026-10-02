@AGENTS.md

# SoopaNova

Next.js app that turns gaming screenshots into physical prints (posters, canvas, framed prints). A learning side project: deployed on Vercel at soopanova.app, but not actively marketed.

**Stack:** Next.js 16 App Router (Turbopack) · React 19 · TypeScript 5.9 · Tailwind v4 + shadcn/ui · Clerk v7 (auth) · Firebase (client Storage + callable Functions, Admin SDK Firestore) · CanvasPop (print fulfilment, third-party) · Vercel Analytics/Speed Insights · Yarn 4.

## Print flow

1. `/create` → `src/components/upload-file.tsx` (a thin component): signed-in user drops a JPG/PNG (`screenshot-dropzone.tsx`). `src/hooks/use-screenshot.ts` holds the file, preview url and dimensions (minimum size checked in the browser). `src/hooks/use-create-print.ts` runs steps 2–4 as one pipeline with a single `status` (`idle → uploading → moderating → pushing → ready`, or `flagged` / `error`). It supports cancel (a cancelled run's late results are ignored) and retry (an already-uploaded file isn't uploaded again).
2. Browser uploads to Firebase Storage as `{uuid}--{clerkUserId}--{filename}` (`react-firebase-hooks` `useUploadFile`).
3. Browser calls the `moderateImageUrl` callable (`functions/src/index.ts`, Cloud Vision SafeSearch). It rejects `adult === 'VERY_LIKELY'` and writes the verdict to the file's custom metadata as `moderation: passed | rejected` (clients can't set it; see `storage.rules`).
4. Browser POSTs the file name to `src/app/api/canvaspop/push-image/route.ts`. The route checks the file is the user's own and tagged `passed`, downloads it with the Admin SDK and pushes it to CanvasPop. It then opens a **print session** at `customers/{userId}/printSessions/{sessionId}` (`imageToken`, `fileName`, `orderId: null`) and returns the `image_token` and `sessionId`.
5. CanvasPop cart loads in an iframe (`canvaspop-cart.tsx`) with `reference_id={sessionId}`, so CanvasPop's orders can be matched to ours. `canvaspop-event-listener.tsx` tracks product choices from `postMessage` events, and on `appOrderComplete` POSTs them with the `sessionId` to `src/app/api/firestore/create-order/route.ts`. In one transaction, that claims the session (it must exist under the user and have no `orderId`) and writes the order, so made-up and duplicate orders are rejected (404/409). Product details and price still come from the cart's events and can't be verified (no CanvasPop order API).
6. Redirect to `/orders` (`src/app/orders/page.tsx`), which lists the user's orders through the Admin SDK, plus sessions marked `continuedInTab` by `POST /api/firestore/continue-session` (the Safari "Open checkout in a new tab" fallback) as "Continued in CanvasPop". The `onOrderCreated` Firestore trigger only logs for now.

## Commands

```sh
yarn dev          # https://localhost:3000 (self-signed HTTPS, needed for Clerk/CanvasPop)
yarn build        # production build
yarn lint         # ESLint CLI (flat config: eslint.config.mjs)
yarn typecheck    # tsc --noEmit
yarn format       # prettier --write .

# Cloud Functions (separate npm package, NOT part of the Yarn project)
npm --prefix functions install
npm --prefix functions run build
npm --prefix functions run serve   # emulator; needs firebase-tools
```

Before calling a change done, run `yarn typecheck && yarn lint && yarn build`. There are no automated tests yet.

## Layout

- `src/app/`: routes. `api/` holds the two route handlers. Metadata routes: `opengraph-image.tsx`, `icon.tsx`, `sitemap.ts`, `robots.ts`.
- `src/proxy.ts`: plain Clerk `clerkMiddleware()` (Next 16's replacement for `middleware.ts`). It doesn't protect any routes (`createRouteMatcher` is deprecated); see the auth gotcha below.
- `src/components/ui/`: **shadcn-generated.** Update through the shadcn CLI (`npx shadcn@latest add <component>`); don't hand-edit. These files use shadcn's own formatting and are in `.prettierignore`. One local edit: `ui/sonner.tsx` imports `useTheme` from `@wrksz/themes/client` rather than `next-themes`, so re-apply that if the component is ever regenerated.
- `src/components/`: app components. `src/hooks/`: client hooks (screenshot selection, print pipeline). `src/assets/data/`: static content (nav links, homepage copy in `home.ts`, product slug maps, keywords, JSON-LD).
- `src/lib/firebase-admin.ts`: the only place the Admin SDK is initialised (`server-only`, modular `firebase-admin/app`, `/auth` and `/firestore` APIs). `src/firebase/config.ts` is the client SDK, and `src/firebase/sign-in.ts` signs it in to Firebase Auth.
- `functions/`: Firebase Cloud Functions (Node 24, firebase-functions v7, npm + `package-lock.json`). Deployed with the Firebase CLI, excluded from Vercel by `.vercelignore`, and excluded from the root tsconfig and ESLint.
- `storage.rules` / `firestore.rules`: Firebase security rules, deployed with the Firebase CLI. The Storage bucket has a 1-day retention policy and a lifecycle rule that deletes objects after 3 days: uploads are temporary and can't be deleted early.

## Conventions

- Prettier config is in `.prettierrc.json`: 4 spaces, no semicolons, single quotes (JSX too), no trailing commas, `bracketSameLine`.
- Import alias `@/*` → `src/*`.
- Tailwind classes are usually passed to `cn()` as arrays: `cn(['flex', 'gap-2'], condition && ['...'])`.
- Short `/** ... */` block comments above logical steps. Match the surrounding density.
- Tailwind v4 is configured CSS-first in `src/assets/styles/globals.css` (oklch theme tokens, `tw-animate-css`, Clerk's `@clerk/ui/themes/shadcn.css`). There is no `tailwind.config`.
- Use `react-firebase-hooks` for client-side Firebase interactions (deliberate choice; don't replace it with raw SDK calls).
- **Visual style** (from the Claude Design homepage handoff): near-black/white surfaces, hairline `border` lines between full-width sections, Geist for text and Geist Mono (`font-mono`) only for small labels, and the pink `primary` used sparingly as an accent. Use the theme tokens, not hex values. Shared pieces:
  - Utilities in `globals.css`: `wrapper` (1200px content width with 24px gutters; use it instead of `container`, which snaps to breakpoint widths), `eyebrow` (mono uppercase label), and `bg-grid` plus `mask-fade-top` / `mask-fade-bottom` (the faint grid backdrop).
  - Components: `Wordmark`, `Hero*` (grid, glow, pill, big heading; homepage and 404), `SectionHeader` (eyebrow, H2, sub), `PlatformTile` / `PlatformStrip` (hairline link tiles), `PageHeader` / `PageSection` / `Typography` (inner pages), and `ctaButtonVariants` in `cta-button.ts` (44px hero/CTA buttons). The shadcn `Button` is still used for smaller buttons.
  - The homepage upload button is `<UploadFile variant='button' />`. The create page uses the default dropzone variant.
- Theming uses `@wrksz/themes` (not `next-themes`). `ThemeProvider` from `@wrksz/themes/next` is used directly in the server `layout.tsx`, and `useTheme` comes from `@wrksz/themes/client`. It defaults to the system theme and stores the choice in localStorage under `theme`.
- Clerk v7: use `<Show when='signed-in' | 'signed-out'>` (`SignedIn`/`SignedOut` no longer exist). Theme comes from `@clerk/ui/themes`.

## Environment

- Copy `.env.example` → `.env.local`. `NEXT_PUBLIC_*` values reach the browser. The rest are server-only.
- Firestore collection names come from `FIREBASE_FIRESTORE_COLLECTION` / `FIREBASE_FIRESTORE_SUB_COLLECTION`. The `onOrderCreated` trigger path in `functions/src/index.ts` is hardcoded and must match them.
- The Admin SDK key is `FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY` (escaped `\n` newlines are unescaped in code).

## Gotchas

- **Clerk is the source of truth for users; Firebase Auth mirrors it.** `POST /api/firebase/token` mints a Firebase custom token whose uid is the Clerk user id. `firebase-auth-sync.tsx` (in the root layout) signs Firebase in and out to match Clerk, and `useCreatePrint` calls `ensureFirebaseUser()` before uploading. `storage.rules` only let a user create and read their own `{uuid}--{uid}--{name}` files, and `moderateImageUrl` rejects unauthenticated callers and other users' files. Every Clerk user who uploads gets a Firebase Auth user with the same id. The client Auth instance is created with `initializeAuth` and **no** popup/redirect resolver. Don't switch it to `getAuth()`: that loads `apis.google.com/js/api.js` plus a hidden auth iframe, which the production CSP blocks.
- **Deploy order depends on the change.** Local dev talks to the production Firebase project too.
  - Auth changes (8.3): the app (Vercel) *before* the stricter `storage.rules` and functions, because an app that isn't signed in to Firebase can't upload under the new rules.
  - Moderation tagging (8.4): functions (and rules) *before* the app. `push-image` refuses files without `moderation: passed`, and only the new `moderateImageUrl` writes it.
- **Every page, route handler and Server Function checks auth itself.** `proxy.ts` protects nothing. `@clerk/next/require-auth-protection` (in `eslint.config.mjs`) fails lint unless a resource under `src/app` starts with `await auth.protect()` or an early return on `auth()`. The exceptions are the static pages in its `public` list, so add any new content page there. `/create` and `/orders` call `auth.protect()`. `push-image` only accepts the caller's own `{uuid}--{userId}--{name}` files.
- **CanvasPop is a third-party service we don't control.** It has no order API or webhooks (only image push/pull and the cart loader). Its cart posts JSON strings (older versions prefixed them with `/*framebus*/`, which is still stripped). `userClickedCartContinue` args are `{ width, height, frame, edge, price }`: **no currency**, and switching currency in the cart just reloads it. So stored prices are in whichever currency the shopper chose, and `/orders` shows plain amounts (`formatPrice`). The only loader parameter is `reference_id`. **The embedded cart needs third-party cookies:** CanvasPop keeps its session in a non-partitioned `PHPSESSID` cookie, so in Safari, all iOS browsers, Brave and private windows the iframe lands on CanvasPop's "session expired" page. `canvaspop-cart.tsx` detects this (a working cart posts `appPageLoaded--cart` before the iframe's load event; the error page posts nothing) and after 3s shows an "Open checkout in a new tab" link. CanvasPop only posts events to `window.parent`, never to an opener, so orders placed in that new tab aren't recorded as orders; `/orders` shows the session as "Continued in CanvasPop" instead. The real fix is on CanvasPop's side (a `Partitioned` cookie or Storage Access API support). Product state in the listener is kept in a ref so the `message` listener attaches once. Always remove it with the same `capture` flag it was added with.
- **Keep pages static.** Every content page (home, about, faq, screenshots, legal, 404) is prerendered; only `/create`, `/orders` and the API routes are dynamic (they call `auth.protect()`). Anything in a server component that reads the request makes a page dynamic, and the header is on every page. That includes Clerk's `<Show>`, `auth()` and `currentUser()`: `<Show>` has a server version that calls `auth()`. So signed-in/out UI goes in client components (`header.tsx` is `'use client'`; `hero-upload-action.tsx` uses `useAuth`). `ClerkProvider` stays static as long as it isn't given `dynamic`. Check the `○`/`ƒ` markers in `yarn build` output after touching layout, header or auth UI. The sign-in/up catch-alls prerender their base path with `generateStaticParams`.
- **CSP** lives in `next.config.ts` (production only). Add any new third-party origin there, or it will work in dev and break in production.
- **Node 25+:** `buffer-equal-constant-time` (via firebase-admin → jsonwebtoken) is patched in `.yarn/patches/` because `SlowBuffer` was removed. Keep the patch until upstream is fixed.
- **`jwks-rsa` is pinned to 3.2.2** (root `resolutions`). `firebase-admin/auth` requires `jwks-rsa`, and 4.x pulls in ESM-only `jose` 6, which Vercel's function loader can't `require()` even on Node 24. `firebase-admin.ts` imports `/auth`, so every route using the Admin SDK then fails to load. It works locally, so test with `node --no-experimental-require-module -e "require('firebase-admin/auth')"`. Remove the pin only once that loads without it.
- **ESLint is pinned to 9.x:** `eslint-config-next` 16's Babel parser for JS files doesn't support ESLint 10 yet.
- **`@clerk/eslint-plugin` is pinned to an exact version:** its rule is experimental and may break in minor releases before v1.
- `next dev` maintains the `AGENTS.md` block. Leave it in place.

## Known outstanding work

- Later: Resend admin email in `onOrderCreated`.

Moderation only blocks `adult === 'VERY_LIKELY'` (stricter thresholds false-flag game screenshots). An empty or failed Vision result is shown as "couldn't check, try again", not as a flag.
