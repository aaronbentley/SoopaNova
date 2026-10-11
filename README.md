# SoopaNova

Here's hoping I make something fun, cool and preferably, profitable.

## Todosies

### Ideas
- [ ] A one-page doc of the business, product offerings and sales margins, annual running costs - with examples of sales required to cover them
- [ ] A weekly or monthly sales report
- [ ] A sheet detailing costs, sales and profits


### Build

- [x] Add "admin" group (above orders & my account) to user dropdown menu with link to "catalogue"
- [x] Verify / exclude the region-specific "brown" frame colour from the catalogue changes
- [x] Offer brown framed canvas option - but add some UI to convey this to the user - remove exception code
- [x] admin/catalogue should have a refresh button, and clear the table upon approval
- [x] Add env.ts to verify env vars (a la SLinkyPixels & NOSY): `src/config/env.ts` with `next-env-safe`
- [x] Order cancellation: Prodigi's 2-hour order edit window, and customers cancel (with a full refund) from `/orders` for 90 minutes
- [x] Resend order emails to the customer: confirmed, shipped (with tracking), cancelled and refunded
- [x] Admin emails via Resend: new orders, and "Needs attention" for orders Prodigi refused or flagged and refunds that failed after a customer cancelled
- [x] Admin alert for margin-guard refusals (only logged today, and tracked as a `Checkout failed` event with `reason: margin`)
- [x] Contact/support form: `/support/`, with a BotID-protected Server Action in `src/actions/public/`
- [x] Remove the `onOrderCreated` Firebase trigger: it only logs, and the app sends the order emails

### Content

- [ ] Redo product images (placeholder for now; set it in `src/assets/data/product-images.ts`)
- [ ] Art print photo showing an unframed print (the current one, also the hero, is framed)
- [ ] Framed print photo without a mount (ours have none)
- [ ] Later: swap the game art in our own photos (Red Dead Redemption 2, Halo) for art we own the rights to

### Legal and business

- [ ] Decide the business structure (sole trader or limited company). Blocks Stripe live activation and the seller details
- [ ] Add the seller's trading name, geographic address and support email to the Terms and Privacy
- [ ] Add the governing law to the Terms
- [x] Copyright complaints process: the support form's copyright topic, referenced from the Terms
- [ ] Terms: say "no resale" outright
- [ ] VAT and sales tax with an accountant (then the price wording and Stripe Tax)
- [ ] Get the Terms and the copyright position checked once (IP solicitor or a free IP clinic)

### Before launch

- [ ] Prodigi live account: add a payment method and set the order edit window to 2 hours (Settings → Preferences; customer cancel relies on it). `catalogue_live` was filled from the live API on 2026-10-11 (`yarn catalogue`); the weekly cron keeps it fresh once production has the live key
- [ ] Email Prodigi support: billing model, callback retries and signing, the cancel cut-off, maximum asset size, whether Prodigi Pro is worth it, and whether the sandbox can pause orders (it has no edit window, so a sandbox order can be in production within seconds and refuse the cancel)
- [ ] Test a customer cancel on live once the edit window is set: a real order, cancelled from `/orders` within 90 minutes (cancel + refund already worked end to end in the sandbox on 2026-10-04)
- [ ] Stripe live: business name, support email (`support@soopanova.app`, not aaronbentley@me.com), statement descriptor, Terms and Privacy URLs, branding; cards, Apple Pay and Google Pay only (no Amazon Pay, Link or bank debits); Stripe's own receipt and refund emails **off** (Settings → Customer emails), as in the sandbox, because the Resend emails replace them
- [ ] Stripe live webhook `https://soopanova.app/api/webhooks/stripe/` (the same four events, including `charge.refunded`) and its `STRIPE_WEBHOOK_SECRET`
- [x] Vercel env vars: `RESEND_API_KEY` and `ADMIN_EMAIL` in Production and Preview, and `CRON_SECRET` in Production (the weekly catalogue refresh)
- [x] Vercel Global Config store `soopanova` connected (`GLOBAL_CONFIG` in every environment) and `VERCEL_TEAM_ID` in Production and Preview
- [x] Vercel env var `ADMIN_USER_ID` in Production (aaronbentley@me.com on the prod Clerk instance)
- [ ] Vercel env var `VERCEL_API_TOKEN` (an access token scoped to the SlinkyPixels team, for catalogue writes) in Production and Preview
- [ ] Vercel env vars in Production: the live Stripe and Prodigi keys, `STRIPE_WEBHOOK_SECRET`, `PRODIGI_CALLBACK_SECRET` and the image limits (and their `NEXT_PUBLIC_` copies)
- [ ] A full test purchase on the Preview (`PRODIGI_CALLBACK_SECRET` is set there): upload → options → Stripe test card → order → Prodigi sandbox order → callbacks update `/orders`, emails arrive, analytics events show up in Vercel
- [ ] Test the customer-cancel emails end to end (needs an order less than 90 minutes old)
- [ ] Click through the signed-in flows since the Base UI migration (print options sheet including a flagged screenshot, user menu, `/account`), and test on Safari and iOS
- [ ] Merge `replatform-prodigi` into `main`, then review env vars: set `MIN_IMAGE_WIDTH` / `MIN_IMAGE_HEIGHT` and their `NEXT_PUBLIC_` copies to 1920 × 1080 in Preview and Production (still 1280 × 720 there; the upload check and the Screenshots page's tips use them, and the `NEXT_PUBLIC_` ones need a redeploy), and delete the `CANVASPOP_*` env vars

### Later

- [ ] Promo codes: turn on `allow_promotion_codes` in checkout (orders already store the code)
- [ ] Zero-budget marketing (promo codes, affiliates), keeping the guardrails: no hosted gallery of customers' screenshots, ads labelled as ads
- [ ] More products? A mid-size canvas (only 14×24 and 28×48 today), desk mats or mousemats
