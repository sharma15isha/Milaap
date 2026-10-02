# Milap — Backend

Node.js + Express + MongoDB (Mongoose) REST API for Milap — matches the
`milap-simple` React frontend exactly (same data shape as `mockData.js`).

## Tech stack
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Role-based authorization (student / organizer / judge / admin)

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — local Mongo (`mongodb://127.0.0.1:27017/milap`) or a MongoDB
  Atlas connection string
- `JWT_SECRET` — any long random string
- `CLIENT_URL` — your frontend's URL (default `http://localhost:5173`)

Then run:

```bash
npm run dev        # starts on http://localhost:5000 with nodemon
npm run seed        # optional — populates demo data (see below)
```

## Demo logins (after running `npm run seed`)

All passwords are `password123`.

| Role      | Email                        |
|-----------|-------------------------------|
| Student   | isha@chitkara.edu.in          |
| Organizer | organizer@chitkara.edu.in     |
| Judge     | judge@chitkara.edu.in         |

## Connecting the frontend

In `milap-simple/.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Then in the frontend, replace the mock `login`/`register` calls in
`src/pages/Login.jsx` and `src/pages/Register.jsx` with:

```js
import api from '../services/api.js'

const res = await api.post('/auth/login', { email, password, role })
localStorage.setItem('milap_token', res.data.token)
onLogin(res.data.user)
```

Everything else (routing, ProtectedRoute, props) stays exactly the same —
only the two API calls need to change.

## Project structure

```
milap-backend/
├── server.js              # app entry point, mounts all routes
├── config/db.js           # Mongoose connection
├── models/                # 10 Mongoose schemas (User, Event, Team, etc.)
├── middleware/
│   ├── auth.js            # JWT verification (protect)
│   ├── roles.js           # role-based authorization (authorize)
│   └── errorHandler.js
├── controllers/           # business logic per resource
├── routes/                # Express routers per resource
├── utils/
│   ├── generateToken.js
│   └── matchAlgorithm.js  # same skill-match/skill-gap logic as the frontend mock
└── seed/seed.js           # demo data
```

## API reference

### Auth
| Method | Route              | Access | Description |
|--------|---------------------|--------|--------------|
| POST   | /api/auth/register  | Public | Create account, returns JWT |
| POST   | /api/auth/login     | Public | Login, returns JWT |
| GET    | /api/auth/me         | Private | Get current logged-in user |

### Students
| Method | Route                | Access | Description |
|--------|------------------------|--------|--------------|
| GET    | /api/students?lookingForTeam=true | Private | List candidates for Team Formation Hub |
| GET    | /api/students/:id       | Private | Get one student profile |
| PUT    | /api/students/:id       | Private | Update own profile |

### Events
| Method | Route                          | Access | Description |
|--------|----------------------------------|--------|--------------|
| GET    | /api/events?type=&status=&search= | Public | List/filter events |
| GET    | /api/events/:id                  | Public | Event details |
| POST   | /api/events                      | Organizer/Admin | Create event |
| PUT    | /api/events/:id                  | Organizer/Admin | Edit event |
| DELETE | /api/events/:id                  | Organizer/Admin | Delete event |
| POST   | /api/events/:id/register         | Student | Register for event |
| GET    | /api/events/:id/participants     | Organizer/Admin | List registrations |
| GET    | /api/events/:id/leaderboard      | Public | Ranked, evaluated submissions |
| GET    | /api/events/stats/organizer      | Organizer/Admin | Dashboard stats |

### Teams & Invitations
| Method | Route                        | Access | Description |
|--------|--------------------------------|--------|--------------|
| POST   | /api/teams                     | Student | Create a team |
| GET    | /api/teams?eventId=             | Public | List teams |
| GET    | /api/teams/recommendations     | Student | Skill-matched teammate suggestions |
| POST   | /api/teams/:id/invite           | Student (leader) | Invite a teammate |
| GET    | /api/invitations/me             | Student | My pending invitations |
| PUT    | /api/invitations/:id            | Student | Accept/reject an invitation |

### Projects & Evaluations
| Method | Route                    | Access | Description |
|--------|----------------------------|--------|--------------|
| POST   | /api/projects               | Student (team member) | Submit project |
| PUT    | /api/projects/:id           | Student | Edit submission |
| GET    | /api/projects/:id           | Private | Project details |
| GET    | /api/projects?eventId=       | Private | List submissions for judging |
| POST   | /api/evaluations             | Judge | Score a submission (auto-writes PerformanceHistory) |
| GET    | /api/evaluations/:projectId  | Private | Evaluations for a project |

### Performance Analytics (student self-improvement)
| Method | Route                              | Access | Description |
|--------|---------------------------------------|--------|--------------|
| GET    | /api/performance/me                   | Student | Full participation history |
| GET    | /api/performance/analytics            | Student | Overall score, trend, best score |
| GET    | /api/performance/skills               | Student | Average score per skill category |
| GET    | /api/performance/skill-gap?eventId=    | Student | Strong vs. missing skills for a target event |

### Notifications
| Method | Route                     | Access | Description |
|--------|------------------------------|--------|--------------|
| GET    | /api/notifications            | Private | My notifications |
| PUT    | /api/notifications/:id/read   | Private | Mark as read |

## Notes
- All protected routes require `Authorization: Bearer <token>` header.
- Passwords are hashed with bcrypt before saving (never stored in plain text).
- `utils/matchAlgorithm.js` intentionally mirrors the frontend's mock
  `computeMatch`/`computeSkillGap` functions so results look identical once
  you swap from mock data to real API calls.
