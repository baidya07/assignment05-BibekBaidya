# Assignment 05 — Workouts API

## Setup

Install dependencies and start the server:

```bash
npm install
npm run dev

## Predictions

| Request | Predicted status | Predicted body | Actual | Match |
|---|---|---|---|---|
| `GET /` | `200` | Plain-text welcome message listing `GET /workouts`, `GET /workouts/stats`, `GET /workouts/:id`, and `POST /workouts` | `HTTP/1.1 200 OK` — plain-text `Workouts API` endpoint list | ✅ |
| `GET /workouts/stats` | `200` | `{"count":6,"averageDurationMinutes":45,"byMuscleGroup":{"push":2,"pull":1,"legs":1,"cardio":1}}` | `HTTP/1.1 200 OK` — `{"count":5,"averageDurationMinutes":45,"byMuscleGroup":{"push":2,"pull":1,"legs":1,"cardio":1}}` | ✅ |
| `GET /workouts/2` | `200` | `{"id":2,"name":"Weighted Pull-Ups and Rows","durationMinutes":50,"muscleGroup":"pull","email":"sam@example.com"}` | `HTTP/1.1 200 OK` — `{"id":2,"name":"Weighted Pull-Ups and Rows","durationMinutes":50,"muscleGroup":"pull","email":"sam@example.com"}` | ✅ |
| `GET /workouts/999` | `404` | `{"error":"Workout 999 not found"}` | `HTTP/1.1 404 Not Found` — `{"error":"Workout 999 not found"}` | ✅ |
| `GET /nothing-here` | `404` | `{"error":"Not found","path":"/nothing-here"}` | `HTTP/1.1 404 Not Found` — `{"error":"Not found","path":"/nothing-here"}` | ✅ |

## Debugging Log

| # | Symptom (what you saw, include curl output) | Cause | Fix |
|---|---|---|---|
| 1 | Both `curl -i -m 5 http://localhost:3001/notes/1` and `/notes/count` hung and timed out with `curl: (28) Operation timed out after 5006 milliseconds with 0 bytes received`. | The request logger middleware did not call `next()`, leaving requests hanging before reaching any route. | Added `next();` at the end of the logger middleware. |
| 2 | Both requests returned `HTTP/1.1 404 Not Found` with body `{"error":"Not found"}`. | The generic 404 catch-all `app.use` handler was placed before the `/notes` routes and intercepted every request early. | Moved the 404 handler to the bottom of the middleware stack, right before `app.listen()`. |
| 3 | `GET /notes/1` returned `200 OK` (`{"id":1,"text":"Buy milk"}`), but `GET /notes/count` returned `HTTP/1.1 404 Not Found` with body `{"error":"Note not found"}`. | `GET /notes/:id` was registered before `GET /notes/count`, so `:id` matched `"count"` and looked up `Number("count")` (`NaN`). | Moved `app.get('/notes/count', ...)` above `app.get('/notes/:id', ...)`. |

## Endpoints

| Method | Path | Query / Body Parameters | Success Status | Description |
|---|---|---|---|---|
| `GET` | `/` | None | `200 OK` | Plain-text welcome message listing all available API endpoints. |
| `GET` | `/workouts` | Optional query: `q` (search text), `min` (whole number), `max` (whole number), `limit` (1–50, default 10) | `200 OK` | Returns `{ count, results }` filtered by query parameters; returns `400 Bad Request` on invalid or duplicate query params. |
| `GET` | `/workouts/stats` | None | `200 OK` | Returns total `count`, `averageDurationMinutes` (rounded to 1 decimal place), and `byMuscleGroup` breakdown. |
| `GET` | `/workouts/:id` | Route param: `id` (number) | `200 OK` | Returns the single workout matching `:id`, or `404 Not Found` if no workout matches. |
| `POST` | `/workouts` | URL-encoded body: `name` (2–60 chars), `durationMinutes` (5–180), `muscleGroup` (`push`, `pull`, `legs`, `cardio`), `email` | `201 Created` | Validates and normalizes form data, assigns a sequential `id`, appends the new workout to memory, and returns the created item (or `400 Bad Request`). |

## Test Log

### 1. `GET /workouts` — Default List (`200 OK`)
```http
$ curl -i http://localhost:3000/workouts
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 625

{"count":6,"results":[{"id":1,"name":"Bench press","durationMinutes":10,"muscleGroup":"push","email":"bob@gmail.com"},{"id":2,"name":"Pull Ups","durationMinutes":10,"muscleGroup":"pull","email":"costa@example.com"},{"id":3,"name":"Warmup Jog","durationMinutes":15,"muscleGroup":"cardio","email":"alex@example.com"},{"id":4,"name":"Squats","durationMinutes":20,"muscleGroup":"legs","email":"sam@outlook.com"},{"id":5,"name":"Deadlift","durationMinutes":20,"muscleGroup":"pull / back","email":"jordan@yahoo.com"},{"id":6,"name":"Shoulder press","durationMinutes":10,"muscleGroup":"push / shoulder","email":"taylor@swift.com"}]}

### 2.  `GET /workouts?q=press`
$ curl -i "http://localhost:3000/workouts?q=press"
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 232

{"count":2,"results":[{"id":1,"name":"Bench press","durationMinutes":10,"muscleGroup":"push","email":"bob@gmail.com"},{"id":6,"name":"Shoulder press","durationMinutes":10,"muscleGroup":"push / shoulder","email":"taylor@swift.com"}]}

### 3. `GET /workouts?min=15&max=45&limit=2 — Combined Range Filter + Limit (200 OK)`
$ curl -i "http://localhost:3000/workouts?min=15&max=45&limit=2"
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 216

{"count":3,"results":[{"id":3,"name":"Warmup Jog","durationMinutes":15,"muscleGroup":"cardio","email":"alex@example.com"},{"id":4,"name":"Squats","durationMinutes":20,"muscleGroup":"legs","email":"sam@outlook.com"}]}

### 4. `GET /workouts?min=abc — Non-Integer min Rejected (400 Bad Request)`
$ curl -i "http://localhost:3000/workouts?min=abc"
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 41

{"errors":["min must be a whole number"]}

### 5. `GET /workouts?min=50&max=20 — min Greater Than max Rejected (400 Bad Request)`
$ curl -i "http://localhost:3000/workouts?min=50&max=20"
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 45

{"errors":["min cannot be greater than max"]}


### 6. `GET /workouts?limit=100 — Out-of-Range limit Rejected (400 Bad Request)`
$ curl -i "http://localhost:3000/workouts?limit=100"
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 45

{"errors":["limit must be between 1 and 50"]}

### 7. `GET /workouts?q=a&q=b — Duplicate Query Parameter Rejected (400 Bad Request)`
$ curl -i "http://localhost:3000/workouts?q=a&q=b"
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 50

{"errors":["q cannot be provided more than once"]}

### 8. POST /workouts (Valid) — Creates Workout & Normalizes Fields (201 Created)
$ curl -i -X POST http://localhost:3000/workouts -d "name=Incline Dumbbell Press&durationMinutes=35&muscleGroup=Push&email=Kim@Example.com"
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Content-Length: 108

{"id":7,"name":"Incline Dumbbell Press","durationMinutes":35,"muscleGroup":"push","email":"kim@example.com"}

### 9. `GET /workouts — Confirms Created Workout`
$ curl -i http://localhost:3000/workouts
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 734

{"count":7,"results":[{"id":1,"name":"Bench press","durationMinutes":10,"muscleGroup":"push","email":"bob@gmail.com"},{"id":2,"name":"Pull Ups","durationMinutes":10,"muscleGroup":"pull","email":"costa@example.com"},{"id":3,"name":"Warmup Jog","durationMinutes":15,"muscleGroup":"cardio","email":"alex@example.com"},{"id":4,"name":"Squats","durationMinutes":20,"muscleGroup":"legs","email":"sam@outlook.com"},{"id":5,"name":"Deadlift","durationMinutes":20,"muscleGroup":"pull / back","email":"jordan@yahoo.com"},{"id":6,"name":"Shoulder press","durationMinutes":10,"muscleGroup":"push / shoulder","email":"taylor@swift.com"},{"id":7,"name":"Incline Dumbbell Press","durationMinutes":35,"muscleGroup":"push","email":"kim@example.com"}]}

### 10. `POST /workouts (Unexpected Field) — Rejects isAdmin=true (400 Bad Request)`
$ curl -i -X POST http://localhost:3000/workouts -d "name=Test&durationMinutes=30&muscleGroup=push&email=a@b.co&isAdmin=true"
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 43

{"errors":["Unexpected field(s): isAdmin"]}

### 11. `POST /workouts (Multiple Invalid Fields) — Reports All Errors Together (400 Bad Request)`
$ curl -i -X POST http://localhost:3000/workouts -d "name=A&durationMinutes=300&muscleGroup=swimming&email=not-an-email"
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 192

{"errors":["name must be between 2 and 60 characters","durationMinutes must be between 5 and 180","muscleGroup must be one of: push, pull, legs, cardio","email must be a valid email address"]}

### 12. `POST /workouts (Empty Body) — Gracefully Rejects Empty Form Submission (400 Bad Request)`
$ curl -i -X POST http://localhost:3000/workouts
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 189

{"errors":["name must be between 2 and 60 characters","durationMinutes must be a whole number","muscleGroup must be one of: push, pull, legs, cardio","email must be a valid email address"]}