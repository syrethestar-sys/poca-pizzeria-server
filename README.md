# Poca Pizzeria — API

Bilingual menu, orders and admin for [poca-pizzeria](https://github.com/syrethestar-sys/poca-pizzeria).
Express 5 (ESM) + Mongoose.

**Deploying:** see [DEPLOY.md](./DEPLOY.md)

## Run it

```bash
npm install
cp .env.example .env      # then fill in MONGO_URI
npm run seed              # loads the printed menu + creates the admin user
npm run dev               # http://localhost:1000
```

`npm run seed -- --fresh` wipes the menu collections before loading.

## Shape of the data

Every customer-facing string is `{ en, mn }`. The client falls back to `en`
when `mn` is empty, so a half-translated menu still renders.

| Model | Notes |
|---|---|
| `MenuCategory` | `name`, `kind` (`food` \| `drink`), `order` |
| `MenuItem` | `name`, `description`, `price` **or** `variants[]` (wine: glass/bottle), `tags` (`spicy`, `extra-spicy`, `vegetarian`, `white`), `category`, `available`, `image` |
| `Order` | `lines[]` frozen at checkout, `total`, `type` (`delivery` \| `pickup`), `customer`, `status` |
| `User` | `email`, `clerkId` (the Clerk account behind it), `name`, `phone`, `role` (`user` \| `admin`) — no password; Clerk holds the credentials |

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/auth/me` | The signed-in account as this database sees it, role included. Sign-in, sign-up and password reset are Clerk's, not ours |
| GET | `/menu-category/get` | All categories, `?kind=food\|drink` |
| POST | `/menu-category/create` | Admin |
| PUT | `/menu-category/update` | Admin |
| DELETE | `/menu-category/delete` | Refuses while the category still holds items |
| GET | `/menu-item/get` | All items, `?category=<id>&available=true` |
| GET | `/menu-item/get/:id` | One item |
| POST | `/menu-item/create` | Admin |
| PUT | `/menu-item/update` | Admin |
| DELETE | `/menu-item/delete` | Admin |
| POST | `/order/create` | Prices are re-read server-side, never trusted from the cart |
| GET | `/order/get` | `?user=<id>&status=<status>` |
| PUT | `/order/status` | Admin — move an order through the queue |

## Auth

Clerk handles sign-in, sign-up and password reset. This API only verifies the
session and decides what it is allowed to do.

`clerkMiddleware()` reads the session off each request; `requireAuth` and
`requireAdmin` in `middleware/auth.js` then resolve it to a `User` by
`clerkId`. A session that has no record yet gets one created on the spot — an
account needs a row here before it can be authorised, because orders join on
`_id` and the role is read from this collection.

The role is deliberately read from the record on every request rather than
taken from the session token. A token can be cached for its whole lifetime and
would not notice that someone was demoted an hour ago.

`CLERK_SECRET_KEY` is required. Without it the API still boots, but every
Clerk session is rejected — it logs a warning at startup saying so.
