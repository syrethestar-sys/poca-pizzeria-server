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
| `User` | `email`, `password` (bcrypt), `role` (`user` \| `admin`) |

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/sign-up` | Create an account |
| POST | `/auth/login` | Returns the safe user object |
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

## Known gaps

Auth returns a plain user object, not a token — the same approach as the
reference project. Before this goes anywhere public, the admin write routes
need real session or JWT checks; right now they are open.
