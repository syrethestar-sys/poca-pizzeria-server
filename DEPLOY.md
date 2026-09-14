# Putting Poca online

Two repos, two Vercel projects, one MongoDB Atlas database. Free tier throughout.
Do them in this order — the web app needs the server's URL before it builds.

```
MongoDB Atlas ──> poca-pizzeria-server (Vercel) ──> poca-pizzeria (Vercel)
                        the API                        the site
```

---

## 1 · Push both repos

From `E:\Work\Poca pizzeria`, in two separate terminals:

```bash
cd poca-server
git init
git add -A
git commit -m "Poca Pizzeria API — bilingual menu, orders, admin"
git branch -M main
git remote add origin https://github.com/syrethestar-sys/poca-pizzeria-server.git
git push -u origin main
```

```bash
cd poca-web
git init
git add -A
git commit -m "Poca Pizzeria — wood-fired sourdough pizza, bilingual site and admin"
git branch -M main
git remote add origin https://github.com/syrethestar-sys/poca-pizzeria.git
git push -u origin main
```

Both `.gitignore` files already exclude `node_modules`, `.env` and `.next`, so no
credentials leave your machine. `.env.example` does go up — that is intentional,
it documents what the project needs.

---

## 2 · MongoDB Atlas

1. Atlas → your cluster → **Connect** → **Drivers** → copy the connection string.
2. **Network Access** → Add IP Address → `0.0.0.0/0`. Vercel's functions do not
   have fixed IPs, so an allowlist of specific addresses will not work.
3. Seed the live database **from your own machine**, once:

```bash
cd poca-server
# .env → MONGO_URI=mongodb+srv://…@…/poca?retryWrites=true&w=majority
#         SEED_ADMIN_EMAIL=admin@poca.mn
#         SEED_ADMIN_PASSWORD=<pick one>
npm run seed
```

You should see `categories: 9` then `menu items: 56` then `admin created`.

---

## 3 · Deploy the API

Vercel → **Add New → Project** → import `poca-pizzeria-server`.

| Setting | Value |
|---|---|
| Framework preset | **Other** |
| Root directory | `./` |
| Build command | leave empty |
| Environment variable | `MONGO_URI` = your Atlas string |

`vercel.json` already routes every path into `index.js`, and `index.js` skips
`app.listen` when `process.env.VERCEL` is set, so it runs as a function.

Deploy, then open `https://<your-api>.vercel.app/menu-item/get` — you should get
JSON with 56 items. **Do not continue until that works**; the site's build reads
this URL.

---

## 4 · Deploy the site

Vercel → **Add New → Project** → import `poca-pizzeria`.

| Setting | Value |
|---|---|
| Framework preset | Next.js (detected) |
| Root directory | `./` |
| `NEXT_PUBLIC_API_URL` | `https://<your-api>.vercel.app` — no trailing slash |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | your cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | your unsigned preset |

`NEXT_PUBLIC_*` values are **baked in at build time**. If you change one later you
must redeploy — editing it in the dashboard alone changes nothing.

---

## 5 · Check it

- `/` — the menu loads, opens on Pizza, EN ⇄ МН switches everything
- Add something → the cart sheet shows it with its photo and ingredients
- `/checkout` — the address block and both phone fields appear
- Log in with the seeded admin → `/admin/menu` lists all 56 items

---

## Before this is more than a demo

**The API has no authentication on its write routes.** `/menu-item/create`,
`/update`, `/delete` and `/menu-category/*` accept any request that reaches them.
The `/admin` pages are guarded in the browser only, which stops nobody with a
terminal. While the URL is unlisted and only your client has it the practical
risk is low, but this must be closed before the site is advertised anywhere.

Two other things in the same bucket:

- **Cloudinary uses an unsigned preset**, so the cloud name and preset are
  readable in the page source and anyone can upload to that account. Uploads
  should move to a signed route on the API.
- **Login returns a plain user object, not a token**, so there is no session to
  verify server-side. Closing the first item properly means fixing this one too.
