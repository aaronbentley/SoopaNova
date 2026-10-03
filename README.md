# SoopaNova

Here's hoping I make something fun, cool and preferably, profitable.

## Todosies

### Build

- [ ] footer
- [ ] Resend - order status email notifications: order confirmation and dispatch (with tracking) to the customer
- [ ] Admin email notification on new order, route handler to send email on new order via Resend. Also alert on orders that are on hold, created with issues or failed, and on margin-guard refusals (only logged today)
- [ ] Admin action to cancel an order (`cancelOrder` already exists in `src/lib/prodigi.ts`)

### Content

- [ ] Framed canvas photo (placeholder for now; set it in `src/assets/data/product-images.ts`)
- [ ] Art print photo showing an unframed print (the current one, also the hero, is framed)
- [ ] Framed print photo without a mount (ours have none)
- [ ] Later: swap the game art in our own photos (Red Dead Redemption 2, Halo) for art we own the rights to

### Legal and business

- [ ] Decide the business structure (sole trader or limited company). Blocks Stripe live activation and the seller details
- [ ] Add the seller's trading name, geographic address and support email to the Terms and Privacy
- [ ] Add the governing law to the Terms
- [ ] Terms: say "no resale" outright, and add a copyright complaints process using the support email
- [ ] VAT and sales tax with an accountant (then the price wording and Stripe Tax)
- [ ] Get the Terms and the copyright position checked once (IP solicitor or a free IP clinic)

### Testing

- [ ] Set `PRODIGI_CALLBACK_SECRET` on Preview, then a test purchase there: payment → order → Prodigi order → status and tracking on `/orders`
- [ ] Click through the signed-in flows since the Base UI migration: print options sheet (including a flagged screenshot), user menu, `/account`
- [ ] Safari and iOS

### Before launch

- [ ] Prodigi live account: add a payment method and a 1–2 hour pause window (so orders can still be cancelled), then re-run `yarn catalogue` against the live API
- [ ] Email Prodigi support: billing model, callback retries and signing, the cancel cut-off, maximum asset size, whether Prodigi Pro is worth it
- [ ] Stripe live: business name, support email, statement descriptor, Terms and Privacy URLs, branding; cards, Apple Pay, Google Pay and Link (no bank debits); payment receipts on
- [ ] Stripe live webhook `https://soopanova.app/api/webhooks/stripe/` (same three events) and its `STRIPE_WEBHOOK_SECRET`
- [ ] Vercel production env vars: live Stripe and Prodigi keys, `STRIPE_WEBHOOK_SECRET`, `PRODIGI_CALLBACK_SECRET`, image limits (and their `NEXT_PUBLIC_` copies)
- [ ] Decide what the `onOrderCreated` Firebase trigger does (the admin email?) before real orders arrive
- [ ] Merge `replatform-prodigi` into `main`, then delete the `CANVASPOP_*` env vars

### Later

- [ ] Promo codes: turn on `allow_promotion_codes` in checkout (orders already store the code)
- [ ] Zero-budget marketing (promo codes, affiliates), keeping the guardrails: no hosted gallery of customers' screenshots, ads labelled as ads
- [ ] More products? A mid-size canvas for the EU and US, desk mats or mousemats; check Stripe fees by card region
