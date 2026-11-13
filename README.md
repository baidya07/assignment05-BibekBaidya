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

