# Forum API

Simple forum backend with threads, nested comments, votes, and admin moderation.

## Features

- Auth (signup/login with JWT)
- Threads CRUD (create, list, get, admin delete)
- Nested comments (reply)
- Voting on threads and comments (up/down, no double-vote)
- Admin moderation (list all threads, delete any comment)

## Project structure

- `config/` — database connection
- `controllers/` — auth, threads
- `middleware/` — auth, role check
- `models/` — `User`, `Thread` (with embedded comments)
- `routes/` — auth routes, thread routes

## Setup

1. Install deps

```powershell
npm install
```

2. Create `.env`

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/forum_api
JWT_SECRET=your_secret
```

3. Run

```powershell
npm run dev
```

## API

Base URL: `/api`

Auth
- POST `/auth/signup` — create user { name, email, password }
- POST `/auth/login` — login { email, password } → { token }

Threads
- POST `/threads` (auth)
- GET `/threads`
- GET `/threads/:id`
- DELETE `/threads/:id` (admin)
- POST `/threads/:id/comments` (auth)
- POST `/threads/comments/:id/reply` (auth)
- POST `/threads/:id/vote` (auth) body: { vote: 'up'|'down'|'clear' }
- POST `/comments/:id/vote` (auth) body: { vote: 'up'|'down'|'clear' }

Admin
- GET `/admin/threads` (admin)
- DELETE `/admin/comments/:id` (admin)

## Examples

Signup

Request
```http
POST /api/auth/signup
Content-Type: application/json

{ "name":"Ana", "email":"ana@example.com", "password":"pass" }
```

Response 201
```json
{ "token":"<jwt>", "id":"...", "name":"Ana", "email":"ana@example.com" }
```

Create thread

```http
POST /api/threads
Authorization: Bearer <jwt>
Content-Type: application/json

{ "title":"Hello", "body":"World" }
```

Vote thread

```http
POST /api/threads/[:id]/vote
Authorization: Bearer <jwt>
Content-Type: application/json

{ "vote":"up" }
```

Admin delete comment

```http
DELETE /api/threads/admin/comments/[:commentId]
Authorization: Bearer <admin_jwt>
```

## Notes

- Votes are tracked by user id. Upvoting removes a previous downvote and vice‑versa. `clear` removes your vote.
- Comments are embedded in a thread; replies reference parent by id.

## Testing

Run tests (if present):

```powershell
npm test
```

## License

MIT
