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