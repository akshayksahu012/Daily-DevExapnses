# DevExpense: Smart Personal Expense & Budget Tracker (MERN)

Stack: Node, Express, MongoDB (Mongoose), React (hooks + Context), JWT + bcrypt, vanilla CSS only.

## Run it

Requirements: Node 18+, and MongoDB running locally (or an Atlas connection string in `server/.env`).

```bash
# Terminal 1: API
cd server
npm install
npm run dev          # http://localhost:5000

# Terminal 2: React app
cd client
npm install
npm run dev          # http://localhost:5173
```

`server/.env` is pre-filled with dev defaults. Change `JWT_SECRET` before deploying anywhere.
`client/.env` is optional (see `client/.env.example`).

## API

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/signup | no | Create account, returns JWT |
| POST | /api/auth/login | no | Log in, returns JWT |
| GET | /api/auth/me | yes | Restore session |
| PUT | /api/auth/budget | yes | Update monthly budget |
| GET | /api/expenses?month=YYYY-MM&category=Food | yes | List (filtered) |
| POST | /api/expenses | yes | Create |
| PUT | /api/expenses/:id | yes | Update |
| DELETE | /api/expenses/:id | yes | Delete |
| GET | /api/expenses/summary?month=YYYY-MM | yes | Totals, % used, alert level, category breakdown |

## Request flow
React component -> Context -> service (fetch) -> Express route -> auth middleware -> controller -> Mongoose model -> MongoDB

## Elevator pitch (about 2 minutes)

DevExpense is a full-stack expense and budget tracker I built with the MERN stack. Users sign up, set a monthly budget, and log expenses by category. The dashboard shows how much they have spent, what is left, and a progress bar that turns amber at 80% and red with a pulsing alert when they go over budget.

On the backend I used Express with a layered structure: routes, controllers, models and middleware. Authentication uses JWTs with bcrypt-hashed passwords. A middleware verifies the token on every expense route and attaches the user to the request. Every database query is scoped to that user ID, so one user can never read or modify another user's data.

The most interesting part is the summary endpoint. Instead of sending every expense to the browser and adding them up in JavaScript, I use a MongoDB aggregation pipeline that filters by user and month, then groups by category to get totals. The server also computes percent used and the alert level, so the business rules live in one trusted place.

On the frontend I used React hooks and two Contexts: one for auth, which persists the token and restores the session on refresh, and one for expenses, which handles filters and refetches after each change. All styling is vanilla CSS, one stylesheet per component, with keyframe animations for card entrances, the progress fill and the alert pulse, and no UI libraries.

If I had more time I would add pagination, refresh tokens with httpOnly cookies, and automated tests for the summary logic.

## Interview Q&A

**1. How do you calculate summary data securely?**
The calculation happens on the server in a MongoDB aggregation. The client only sends a month; the user ID comes from the verified JWT, never from the request body or URL. The pipeline matches that user's expenses in the date range, groups by category and sums amounts. A user cannot tamper with totals or request someone else's summary, and the database does the heavy work. Detail: aggregate() does not auto-cast IDs like find() does, so I match on req.user._id, which is already an ObjectId.

**2. Why store the JWT in localStorage, and what are the trade-offs versus cookies?**
It is simple and works cleanly with a separate frontend and API: the token goes in an Authorization: Bearer header. The trade-off is that any JavaScript on the page can read localStorage, so an XSS bug could steal the token. React escapes output by default, which reduces the risk but does not remove it. An httpOnly, Secure, SameSite cookie cannot be read by JavaScript, which protects against XSS, but then you need CSRF protection and CORS credentials setup. For production I would use short-lived access tokens plus a refresh token in an httpOnly cookie.

**3. How is data isolated per user in MongoDB?**
Every expense has a user field referencing its owner. The auth middleware decodes the token and loads the user into req.user. Every controller query includes user: req.user._id. For update and delete I filter by both _id and user, so guessing another expense's ID returns 404. I whitelist the fields accepted from the body so a client cannot set or change the user field. An index on { user, date } keeps these queries fast.

**4. How does your authentication flow work end to end?**
On signup, a Mongoose pre-save hook hashes the password with bcrypt, so plain text is never stored. On login I fetch the user with the password field explicitly selected, compare with bcrypt, and return a signed JWT containing only the user ID. The frontend stores the token and puts the user in AuthContext. On refresh, AuthContext calls /auth/me with the saved token to restore the session. ProtectedRoute redirects to login if there is no user. Logout deletes the token client-side because JWTs are stateless; the trade-off is that a stolen token stays valid until it expires, which is why short expiry matters.

### Follow-ups to be ready for
- Why Context instead of Redux? The state is small and shared by few components; Context is built in and enough here.
- Why rounding? Floating point can give 0.1 + 0.2 = 0.30000000000000004, so amounts are rounded to 2 decimals. A production finance app would store integer cents.
- What next? Pagination, login rate limiting, tests (Jest/Supertest), recurring expenses.
