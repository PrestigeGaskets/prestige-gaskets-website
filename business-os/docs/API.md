# Rushmore Spring Boot API

Authoritative server for the Business OS HTML twin (and later the C++ `.exe`).

## Run locally (H2)

```bash
cd business-os/server
# Ensure GUI assets are in src/main/resources/static/ (copied from ../gui-demo)
mvn spring-boot:run
```

- Health: http://localhost:8080/api/health
- GUI: http://localhost:8080/
- Force in-browser mock: http://localhost:8080/?mock=1

## Run with Postgres (Docker Compose)

```bash
cd business-os/server
docker compose up --build
```

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Liveness |
| GET | `/api/master` | Full ERP lists for toolbar **Update** |
| POST | `/api/session/login` | `{ "employeeId" }` → session + cookie |
| GET | `/api/session` | Current operator session |
| GET | `/api/employees` | Employees + departments |
| GET | `/api/workload` | Assigned + department pool |
| POST | `/api/workload/clock` | `{ action, jobId?, hours?, note? }` (`in` / `out` / `book`) |
| POST | `/api/workload/pull` | `{ workPoolId }` |
| GET | `/api/projects` | Projects / scrum |
| POST | `/api/projects/{id}/approach` | `{ approach: "pull" \| "assign" }` |
| POST | `/api/post` | `{ actor, pending[], workingCopy }` → intake + ledger + snapshot |
| POST | `/api/reverse` | `{ actor? }` → restore last posted snapshot |
| GET | `/api/actions` | Query ledger (`actor`, `day`, `orderNo`, `quoteNo`, `poNo`, `grnNo`, `shipmentId`) |

Operator identity: cookie `rushmore_employee` or header `X-Employee-Id`.

## GUI adapter

[`gui-demo/api-client.js`](../gui-demo/api-client.js) probes `/api/health` and, when live, replaces `window.RushmoreServer` with `fetch` calls that keep the `{ ok, status, data }` shape. Offline / `?mock=1` keeps `workforce-server.js`.

Related: [ACTION_REPOSITORY.md](ACTION_REPOSITORY.md), [DATA_MODEL.md](DATA_MODEL.md), [WORKFORCE_PROJECTS.md](WORKFORCE_PROJECTS.md).
