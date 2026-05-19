# JP CAR RENTAL (Next.js)

High-end, dark-themed car rental website with WhatsApp booking, payments, and a private admin dashboard.

## Setup

1) Install dependencies

```bash
npm install
```

2) Create `.env.local`

```bash
copy .env.example .env.local
```

Edit `.env.local` values:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: your WhatsApp number in international format (digits only)
- `ADMIN_PASSWORD`: password to access `/admin`
- `ADMIN_SECRET`: long random string (used to sign the admin session cookie)
- `CUSTOMER_AUTH_SECRET`: long random string (used to sign client login sessions)
- (optional) `STRIPE_SECRET_KEY`: enable card payments (Stripe Checkout)
- (optional) `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: enable PayPal payments
- (recommended) `NEXT_PUBLIC_SITE_URL`: site URL for correct payment return URLs
- `DATABASE_URL` (for SQLite/Prisma): `file:./data/dev.db`

3) Run

```bash
npm run dev
```

Open `http://localhost:3000`.

### Database (SQLite + Prisma)

- Existing JSON data (`data/cars.json`, `data/reviews.json`) is migrated/seeded into SQLite.
- If you need to recreate the DB:

```bash
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

To seed a test customer (in case `data/customers.json` does not exist), set these env vars before running the seed:
- `SEED_CUSTOMER_FULL_NAME`
- `SEED_CUSTOMER_EMAIL`
- `SEED_CUSTOMER_PASSWORD`

## Admin

- Visit `/admin`
- You’ll be redirected to `/admin/login`
- Add/edit/delete cars; changes are saved to the SQLite database (`data/dev.db`)

## Payments

Customers can pay from the **Pay** button on each car card:

- **Card**: Stripe Checkout (requires `STRIPE_SECRET_KEY`)
- **PayPal**: PayPal Buttons (requires PayPal env vars)

## Client accounts

- Clients must create an account and log in before opening booking/checkout pages.
- Account data is stored in the SQLite database (`Customer` table).

