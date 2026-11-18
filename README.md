# AutoCARe frontend

React (Vite) mobile web app built from the AutoCARe wireframe. It has nine screens:
splash, login, create account, dashboard, vehicle, service booklet, book appointment,
booking confirmed and profile.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

With no configuration it runs on built-in sample data that is saved in the browser, so you
can click through everything without a backend. Sample logins:

| Who | Username | Password | Where you land |
| --- | --- | --- | --- |
| Customer | `demo` | `demo1234` | the customer app (`/home`) |
| Staff | `staff` | `staff1234` | the staff portal (`/staff`) |

You can also create a new customer account. Which area you see depends on the `role` the
backend returns for the user: `customer` gets the customer app, and `staff`, `advisor`,
`technician`, `manager` or `admin` get the staff portal (see `STAFF_ROLES` in
`src/lib/constants.js`). Each role is blocked from the other area.

## Connect your backend

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_URL` to your API base URL, for example `http://localhost:4000/api`.
3. Restart `npm run dev`.

The app then calls `src/api/http.js` instead of the sample data. All data access goes
through `src/api/`, so no screen needs to change when the backend does.

## API contract

Send the token from `login` / `register` back as `Authorization: Bearer <token>`.
Errors should return a non-2xx status and JSON like `{ "message": "Incorrect username or password." }`.

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| POST | `/auth/login` | `{ username, password }` | `{ token, user }` |
| POST | `/auth/register` | `{ email, username, password, phone }` | `{ token, user }` |
| PUT | `/me` | `{ username, email, phone }` | `user` |
| GET | `/vehicle` | | `vehicle` or `null` |
| PUT | `/vehicle` | `{ plateNumber, model, year, mileage, ownership }` | `vehicle` |
| GET | `/vehicle/health` | | `{ score }` (0 to 100, `null` if no vehicle) |
| GET | `/appointments` | | `appointment[]` |
| POST | `/appointments` | `{ serviceType, date, time, remarks }` | `appointment` |
| GET | `/service-records` | | `record[]` |
| GET | `/notifications` | | `notification[]` |
| PATCH | `/notifications/:id/read` | | `notification` |
| GET | `/staff/dashboard` | | staff dashboard object (below), staff roles only |

Shapes:

```js
user         { id, username, email, phone }
vehicle      { id, plateNumber, model, year, mileage, ownership }
appointment  { id, serviceType: 'general'|'repair'|'tyre'|'other', date: 'YYYY-MM-DD',
               time: 'HH:MM', remarks, status: 'pending'|'approved'|'confirmed'|'rescheduled'|'completed'|'cancelled' }
record       { id, title, date: 'YYYY-MM-DD', mileage, parts: ['Engine Oil', ...], totalCost }
notification { id, title, message, read, createdAt }
```

The staff dashboard keeps the exact format used by the earlier staff web page and Flutter
app, so one endpoint can serve all three. Field names are in snake_case:

```js
{
  counts:       { totalAppointments, pendingAppointments, completedServices, ongoingServices },
  appointments: [{ id, customer, registration_no, appointment_date, service_type, status }],
  customers:    [{ id, name, email, phone }],
  vehicles:     [{ registration_no, owner, make, model, year }],
  services:     [{ id, registration_no, service_type, service_date, cost, status }],
  reminders:    [{ registration_no, reminder, due_date, status }]
}
```

The backend must return 401 or 403 for non-staff users. The login response must include
`user.role`. Use `dateStrings: true` in the `mysql2` connection options so DATE columns come
back as `YYYY-MM-DD` text, because otherwise JSON can shift a date by a day.

The health score should be calculated by the backend from the maintenance rules. The app
only displays it: 80 and above is Great, 60 to 79 is Fair, below 60 needs attention
(`healthLabel` in `src/lib/format.js`).

If your database column names differ (for example `plate_number`, `current_mileage`,
`scheduled_datetime`), convert them inside `src/api/http.js`.

## Things to decide

- **Login by username.** The wireframe logs in with a username, but your tables store
  `full_name` and `email`. Either add a `username` column or change the login and profile
  screens to use email. The sample data mode also accepts an email at login.
- **Appointment status values.** The app accepts both `approved` and `confirmed`, so it works
  with either schema.
- **Passwords** must be hashed (bcrypt or argon2) by the backend. This app never stores them
  beyond sending them to the login and register endpoints. The sample data mode keeps
  demo passwords in plain text in browser storage and is for demos only.

## Structure

```
src/
  api/          index.js picks sample data or real backend; mock.js, http.js
  components/   AppShell (bottom nav), AuthLayout, Field, Icons, RequireAuth, PageState
  context/      AuthContext (login state, saved in browser storage)
  hooks/        useApi (load data with loading and error state)
  lib/          format.js (dates, money, health wording), constants.js (service types, time slots)
  pages/        one file per customer screen
  pages/staff/  StaffShell (sidebar, loads data once) and StaffPages (dashboard and five tables)
  staff.css     styles for the staff area only
  styles.css    all styling, colours as variables at the top
```

## Wireframe notes

- The "Date / Parts" box on the service booklet is built as the **Filter by** dropdown.
  Choosing Date shows a month picker; choosing Parts shows a list of parts.
- The wireframe has no confirm button on Book Appointment, so one was added below the form.
- The bell on the dashboard opens a short notification list.
- "Contact Support" opens an email to `SUPPORT_EMAIL` in `src/lib/constants.js`. Change it to
  your real address.
- The workshop is treated as closed on Sundays, and time slots that are already booked are
  disabled.
