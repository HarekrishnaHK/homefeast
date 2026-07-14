# HomeFeast

A platform connecting customers with verified home cooks and tiffin providers
for daily, weekly, and monthly homemade meal subscriptions.

This repo is a **working starter scaffold**, not a finished 25-page product:
the architecture, database schema, authentication, and core flows (browse →
provider detail → order/subscribe, cook menu management, admin approvals) are
fully wired end-to-end and ready to run. Secondary dashboard pages (analytics
charts, settings forms, complaint threads, etc.) follow the same patterns
established here — see "Extending this scaffold" below.

---

## Folder structure

```
homefeast/
├── apps/
│   ├── web/                     # Next.js 15 frontend
│   │   └── src/
│   │       ├── app/
│   │       │   ├── page.tsx             # Home page
│   │       │   ├── browse/              # Provider search + filters
│   │       │   ├── provider/[slug]/     # Provider detail, menus, reviews
│   │       │   ├── login/ register/
│   │       │   ├── about/ pricing/
│   │       │   └── dashboard/
│   │       │       ├── customer/        # Customer dashboard
│   │       │       ├── cook/            # Cook dashboard
│   │       │       └── admin/           # Admin dashboard
│   │       ├── components/      # Navbar, Footer, ProviderCard, DashboardShell, TiffinStack
│   │       └── lib/api.ts       # Typed fetch wrapper for the API
│   │
│   └── api/                     # Express + TypeScript backend
│       └── src/
│           ├── server.ts        # App entrypoint, security middleware
│           ├── routes/          # authRoutes, cookRoutes, menuRoutes, orderRoutes,
│           │                    # subscriptionRoutes, reviewRoutes, adminRoutes, userRoutes
│           ├── controllers/     # Business logic per resource
│           ├── middleware/      # requireAuth, requireRole, errorHandler
│           └── lib/              # prisma client, jwt helpers
│
├── prisma/
│   ├── schema.prisma            # Full data model (12 tables, see below)
│   └── seed.ts                  # Seeds base cuisines & categories
│
├── docs/                        # (add API reference / ERD exports here)
└── package.json                 # npm workspaces root
```

---

## Tech stack

| Layer          | Choice                                              |
|-----------------|-----------------------------------------------------|
| Frontend         | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion |
| Backend          | Node.js, Express, TypeScript                        |
| Database         | PostgreSQL + Prisma ORM                              |
| Auth             | JWT (short-lived access token + rotating refresh token in an httpOnly cookie), bcrypt password hashing, RBAC |
| Deployment target| Vercel (web) + Render/Railway (api) + managed Postgres |

---

## Database schema (Prisma)

Twelve core models: `User`, `RefreshToken`, `Address`, `HomeCook`, `Payout`,
`Category`, `Cuisine`, `Menu`, `MenuItem`, `Order`, `OrderItem`,
`Subscription`, `Payment`, `Review`, `Favorite`, `Complaint`, `Notification`.

Highlights:
- `User.role` (`CUSTOMER` / `COOK` / `ADMIN`) drives RBAC throughout the API.
- `HomeCook.status` (`PENDING` / `APPROVED` / `REJECTED` / `SUSPENDED`) implements
  the admin approval workflow — cooks can't appear in `GET /api/cooks` until approved.
- `Menu.planType` (`DAILY` / `WEEKLY` / `MONTHLY`) is shared by menus, orders (via
  `OrderItem` → `Menu`), and subscriptions, so pricing and cadence stay consistent.
- Indexes are set on every foreign key plus the fields used for filtering
  (`role`, `city`, `status`, `slug`, `planType`, `deliveryDate`).

Run `npx prisma studio` (see setup below) to browse the schema visually once
migrated.

---

## Local setup

### Prerequisites
- Node.js 20+
- A PostgreSQL database (local, Docker, or a hosted instance like Neon/Supabase)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```
Edit `apps/api/.env` with your `DATABASE_URL` and generate two JWT secrets:
```bash
openssl rand -base64 48   # run twice, for JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
```

### 3. Set up the database
```bash
npm run prisma:generate
npm run prisma:migrate      # creates tables from prisma/schema.prisma
npm run prisma:seed         # seeds cuisines & categories
```

### 4. Run both apps
```bash
npm run dev:api    # http://localhost:4000
npm run dev:web    # http://localhost:3000
```

### 5. Create your first admin
The API has no public "become admin" endpoint by design. After registering a
normal account, promote it directly in the database:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'you@example.com';
```

---

## API reference (summary)

| Resource       | Endpoints |
|----------------|-----------|
| Auth           | `POST /api/auth/register`, `/login`, `/refresh`, `/logout` |
| Users          | `GET/PUT /api/users/me`, `GET/POST/DELETE /api/users/me/favorites/:cookId` |
| Cooks (public) | `GET /api/cooks` (filters: city, cuisine, foodType, planType, minPrice, maxPrice, q), `GET /api/cooks/:slug` |
| Cooks (self)   | `GET/PUT /api/cooks/me` |
| Menus          | `GET/POST /api/menus`, `PUT/DELETE /api/menus/:id`, `POST/PUT/DELETE /api/menus/:id/items/:itemId` — cook-only |
| Orders         | `GET/POST /api/orders`, `PATCH /api/orders/:id/status` (cook), `PATCH /api/orders/:id/cancel` (customer) |
| Subscriptions  | `GET/POST /api/subscriptions`, `PATCH /api/subscriptions/:id/renew`, `/cancel` |
| Reviews        | `POST /api/reviews`, `PUT /api/reviews/:id` |
| Admin          | `GET /api/admin/stats`, `GET/PATCH /api/admin/cooks/:id/approve|reject`, `GET/PATCH /api/admin/users`, `POST /api/admin/categories`, `/cuisines`, `GET/PATCH /api/admin/complaints` |

All authenticated routes expect `Authorization: Bearer <accessToken>`. The
refresh token travels as an httpOnly cookie, so `credentials: "include"` is
required on the frontend (already set in `lib/api.ts`).

---

## Security checklist (implemented)

- [x] JWT auth with short-lived access tokens + rotating refresh tokens
- [x] bcrypt password hashing (cost factor 12)
- [x] Role-based authorization middleware (`requireRole`)
- [x] Zod input validation on every mutating endpoint
- [x] Rate limiting (global + stricter limiter on `/api/auth`)
- [x] `helmet()` secure HTTP headers, CORS locked to `CLIENT_URL`
- [x] Centralized error handler that never leaks stack traces to clients
- [x] Parameterized queries throughout (Prisma prevents SQL injection by construction)

Still to add before production: CSRF token handling for cookie-based refresh
(or move refresh to a mobile-safe rotating-token scheme), file upload
validation/limits once image upload is wired to real storage (S3/Cloudinary),
and audit logging on admin actions.

---

## Deployment guide

**Database:** provision a managed Postgres instance (Neon, Supabase, or
Render Postgres). Copy its connection string into `DATABASE_URL`.

**API (Render or Railway):**
1. New Web Service → point at `apps/api`, build command `npm install && npm run build`, start command `npm start`.
2. Set env vars: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL` (your Vercel URL), `NODE_ENV=production`.
3. Run `npx prisma migrate deploy` as a one-off/release command against the production database.

**Frontend (Vercel):**
1. Import the repo, set the root directory to `apps/web`.
2. Set env var `NEXT_PUBLIC_API_URL` to your deployed API URL.
3. Deploy — Vercel auto-detects Next.js.

**Post-deploy:** update the API's `CLIENT_URL` to the final Vercel domain so CORS and the refresh-token cookie work correctly.

---

## Extending this scaffold

The three dashboards each follow the same shape: `DashboardShell` (sidebar +
header) wrapping a page that calls `apiFetch()`. To add a new dashboard page
(e.g. cook analytics with charts):
1. Add the route folder under `apps/web/src/app/dashboard/<role>/<page>/page.tsx`.
2. Reuse `DashboardShell` and `StatCard` from `components/DashboardShell.tsx`.
3. Call the matching API endpoint via `apiFetch<T>("/api/...", { accessToken })`.
4. If no endpoint exists yet, add a controller function in `apps/api/src/controllers/` and wire it into the matching route file — the auth/RBAC/validation/error-handling pattern is already established in every existing controller.

Public pages not yet built (FAQ, Contact, Terms, Privacy) are simple content
pages — copy the structure of `apps/web/src/app/about/page.tsx`.
