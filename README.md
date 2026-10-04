# SoopaNova

Here's hoping I make something fun, cool and preferably, profitable.

## Todosies

### Ideas
- [ ] A one-page doc of the business, product offerings and sales margins, annual running costs - with examples of sales required to cover them
- [ ] A weekly or monthly sales report
- [ ] A sheet detailing costs, sales and profits


### Build

- [x] Order cancellation: Prodigi's 2-hour order edit window, and customers cancel (with a full refund) from `/orders` for 90 minutes
- [ ] Resend - order status email notifications: order confirmation and dispatch (with tracking) to the customer
- [ ] Admin alerts via Resend: orders created with issues or failed, refunds that failed after a customer cancelled, and margin-guard refusals (only logged today). Prodigi's own order notification emails already cover new orders
- [ ] Contact/support form as a Server Action in `src/actions/` (checkout already uses one)

### Content

- [ ] Redo product images (placeholder for now; set it in `src/assets/data/product-images.ts`)
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

### Before launch

- [ ] Prodigi live account: add a payment method and set the order edit window to 2 hours (Settings → Preferences; customer cancel relies on it), then re-run `yarn catalogue` against the live API
- [ ] Email Prodigi support: billing model, callback retries and signing, the cancel cut-off, maximum asset size, whether Prodigi Pro is worth it, and whether the sandbox can pause orders (it has no edit window, so a sandbox order can be in production within seconds and refuse the cancel)
- [ ] Test a customer cancel on live once the edit window is set: a real order, cancelled from `/orders` within 90 minutes (cancel + refund already worked end to end in the sandbox on 2026-10-04)
- [ ] Stripe live: business name, support email, statement descriptor, Terms and Privacy URLs, branding; cards, Apple Pay and Google Pay only (no Amazon Pay, Link or bank debits); payment receipts on
- [ ] Stripe live webhook `https://soopanova.app/api/webhooks/stripe/` (the same four events, including `charge.refunded`) and its `STRIPE_WEBHOOK_SECRET`
- [ ] Vercel production env vars: live Stripe and Prodigi keys, `STRIPE_WEBHOOK_SECRET`, `PRODIGI_CALLBACK_SECRET`, image limits (and their `NEXT_PUBLIC_` copies)
- [ ] Decide what the `onOrderCreated` Firebase trigger does (the admin email?) before real orders arrive
- [ ] Merge `replatform-prodigi` into `main`, then review env vars and delete the `CANVASPOP_*` env vars

### Later

- [ ] Promo codes: turn on `allow_promotion_codes` in checkout (orders already store the code)
- [ ] Zero-budget marketing (promo codes, affiliates), keeping the guardrails: no hosted gallery of customers' screenshots, ads labelled as ads
- [ ] More products? A mid-size canvas for the EU and US, desk mats or mousemats; check Stripe fees by card region
