@AGENTS.md

# SoopaNova

Next.js app that turns gaming screenshots into physical prints (posters, canvas, framed prints). A learning side project: deployed on Vercel at soopanova.app, but not actively marketed.

**Stack:** Next.js 16 App Router (Turbopack) · React 19 · TypeScript 5.9 · Tailwind v4 + shadcn/ui · Clerk v7 (auth) · Firebase (client Storage + callable Functions, Admin SDK Firestore) · CanvasPop (print fulfilment, third-party) · Vercel Analytics/Speed Insights · Yarn 4.

## Print flow

1. `/create` → `src/components/upload-file.tsx`: signed-in user drops a JPG/PNG (checked for size and minimum dimensions in the browser).
2. Browser uploads to Firebase Storage as `{uuid}--{clerkUserId}--{filename}` (`react-firebase-hooks` `useUploadFile`).
3. Browser calls the `moderateImageUrl` callable (`functions/src/index.ts`, Cloud Vision SafeSearch) and blocks `adult === 'VERY_LIKELY'`.
4. Browser POSTs the download URL to `src/app/api/canvaspop/push-image/route.ts`, which pushes the image to CanvasPop and returns an `image_token`.
5. CanvasPop cart loads in an iframe (`canvaspop-cart.tsx`). `canvaspop-event-listener.tsx` tracks product choices from `postMessage` events, and on `appOrderComplete` POSTs to `src/app/api/firestore/create-order/route.ts`.
6. Redirect to `/orders` (`src/app/orders/page.tsx`), which lists the user's orders through the Admin SDK. The `onOrderCreated` Firestore trigger only logs for now.

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
- `src/proxy.ts`: Clerk `clerkMiddleware` (Next 16's replacement for `middleware.ts`). It protects `/create` and `/orders`.
- `src/components/ui/`: **shadcn-generated.** Update through the shadcn CLI (`npx shadcn@latest add <component>`); don't hand-edit. These files use shadcn's own formatting and are in `.prettierignore`. One local edit: `ui/sonner.tsx` imports `useTheme` from `@wrksz/themes/client` rather than `next-themes`, so re-apply that if the component is ever regenerated.
- `src/components/`: app components. `src/assets/data/`: static content (nav links, product slug maps, keywords, JSON-LD).
- `src/lib/firebase-admin.ts`: the only place the Admin SDK is initialised (`server-only`, modular `firebase-admin/app` + `firebase-admin/firestore` APIs). `src/firebase/config.ts` is the client SDK.
- `functions/`: Firebase Cloud Functions (Node 24, firebase-functions v7, npm + `package-lock.json`). Deployed with the Firebase CLI, excluded from Vercel by `.vercelignore`, and excluded from the root tsconfig and ESLint.
- `storage.rules` / `firestore.rules`: Firebase security rules, deployed with the Firebase CLI. The Storage bucket has a 1-day retention policy and a lifecycle rule that deletes objects after 3 days: uploads are temporary and can't be deleted early.

## Conventions

- Prettier config is in `.prettierrc.json`: 4 spaces, no semicolons, single quotes (JSX too), no trailing commas, `bracketSameLine`.
- Import alias `@/*` → `src/*`.
- Tailwind classes are usually passed to `cn()` as arrays: `cn(['flex', 'gap-2'], condition && ['...'])`.
- Short `/** ... */` block comments above logical steps. Match the surrounding density.
- Tailwind v4 is configured CSS-first in `src/assets/styles/globals.css` (oklch theme tokens, `tw-animate-css`, Clerk's `@clerk/ui/themes/shadcn.css`). There is no `tailwind.config`.
- Use `react-firebase-hooks` for client-side Firebase interactions (deliberate choice; don't replace it with raw SDK calls).
- Theming uses `@wrksz/themes` (not `next-themes`). `ThemeProvider` from `@wrksz/themes/next` is used directly in the server `layout.tsx`, and `useTheme` comes from `@wrksz/themes/client`. It defaults to the system theme and stores the choice in localStorage under `theme`.
- Clerk v7: use `<Show when='signed-in' | 'signed-out'>` (`SignedIn`/`SignedOut` no longer exist). Theme comes from `@clerk/ui/themes`.

## Environment

- Copy `.env.example` → `.env.local`. `NEXT_PUBLIC_*` values reach the browser. The rest are server-only.
- Firestore collection names come from `FIREBASE_FIRESTORE_COLLECTION` / `FIREBASE_FIRESTORE_SUB_COLLECTION`. The `onOrderCreated` trigger path in `functions/src/index.ts` is hardcoded and must match them.
- The Admin SDK key is `FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY` (escaped `\n` newlines are unescaped in code).

## Gotchas

- **Clerk users are not Firebase Auth users.** Client Storage uploads and the `moderateImageUrl` callable are unauthenticated from Firebase's side. `storage.rules` can only limit *what* is written (root-level JPEG/PNG under 32MB).
- **API routes must call `auth()` themselves.** `proxy.ts` only protects pages. `push-image` also only accepts download URLs from our own Storage bucket.
- **CanvasPop is a third-party service we don't control.** It has no order API or webhooks (only image push/pull and the cart loader). Its cart posts JSON strings (older versions prefixed them with `/*framebus*/`, which is still stripped). `userClickedCartContinue` args are `{ width, height, frame, edge, price }`: **no currency**, and switching currency in the cart just reloads it. So stored prices are in whichever currency the shopper chose, and `/orders` shows plain amounts (`formatPrice`). The only loader parameter is `reference_id`. Product state in the listener is kept in a ref so the `message` listener attaches once. Always remove it with the same `capture` flag it was added with.
- **CSP** lives in `next.config.ts` (production only). Add any new third-party origin there, or it will work in dev and break in production.
- **Node 25+:** `buffer-equal-constant-time` (via firebase-admin → jsonwebtoken) is patched in `.yarn/patches/` because `SlowBuffer` was removed. Keep the patch until upstream is fixed.
- **ESLint is pinned to 9.x:** `eslint-config-next` 16's Babel parser for JS files doesn't support ESLint 10 yet.
- `next dev` maintains the `AGENTS.md` block. Leave it in place.

## Known outstanding work (Phase 8)

- Clerk → Firebase auth bridge (Firebase custom token), so Storage rules and the callable can require `request.auth`.
- Server-side moderation gate: `push-image` should verify moderation itself rather than trusting the browser.
- Order integrity (CanvasPop has no order API): record each pushed image token against its user, make `create-order` require an unused token the user owns, and set a unique `reference_id` so CanvasPop orders can be matched to ours.
- Split `upload-file.tsx` (~650 lines) into a `useCreatePrint` hook and presentational parts.
- Later: Resend admin email in `onOrderCreated`.

Moderation only blocks `adult === 'VERY_LIKELY'` (stricter thresholds false-flag game screenshots). An empty or failed Vision result is shown as "couldn't check, try again", not as a flag.
