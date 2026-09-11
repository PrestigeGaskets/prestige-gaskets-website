# Workforce · Departments · Projects · Scrum

How people organise and pull work so **purchase-order agreements get fulfilled**.

## Intent (amended)

| Decision | Rule |
|----------|------|
| Who can act | **Employee role** decides capability. There is **no** skills / employee_skills matrix. |
| Who fills a role | Operators assign people to roles; the system does not match “skills”. |
| When work is claimed | On **shift start (clock-in)**, the employee **pulls from their department work-pool table**. |
| Why the work exists | Every job / pool entry / scrum action exists to **fulfil a purchase-order agreement** (customer order, linked quote → order → ship / PO → GRN → putaway). |
| How work is run | **Agile scrum**: daily scrums, pool pulls, WIP limits, blocked signals — not a separate product silo. |

Removed from the model: `skills`, `employee_skills`, job `requiredSkills`, scrum `pullRequiresSkills`.

---

## Roles (capability gate)

| Role | Typical work |
|------|----------------|
| `admin` | Full access; configure departments, projects, pools |
| `sales` | Quotes, accept quote → order, customer follow-up tied to order fulfilment |
| `warehouse` | GRN, putaway, pick, pack, ship against order / PO lines |
| `production` | Cut / make / assemble jobs that close order or PO demand |
| `purchasing` | Supplier POs that supply demand against customer agreements |
| `accounts` | Invoice / credit against fulfilled orders |
| `operator` | Generic floor pull within assigned department |

An employee’s **role** (and **department**) is enough to decide whether they may pull a given pool entry. Managers decide who holds which role; the OS does not score skills.

---

## Shift start → pool pull

```
Clock in (session)
    → load department work_pool (status = open)
    → employee pulls next eligible entry for their role
    → job moves to in_progress (active WIP)
    → clock out / complete returns capacity to the pool
```

Pull rules (no skill check):

1. Employee must be **clocked in**.
2. Pool entry’s **department** matches the employee’s department (or is explicitly shared).
3. Employee’s **role** is in the entry’s `allowedRoles` (or entry allows any role in that department).
4. Department / scrum **WIP limit** not exceeded.
5. Entry is not already claimed.

---

## Purchase-order agreement as the spine

Work is not free-floating tasks. Each job / pool entry should reference one of:

| Link | Fulfilment meaning |
|------|--------------------|
| `orderId` / `orderLineId` | Customer sales agreement — pick, pack, ship, invoice |
| `purchaseOrderId` / `poLineId` | Supplier agreement that supplies that demand |
| `quoteId` | Pre-agreement; converts to order before fulfilment WIP |
| `shipmentId` / `grnId` | Logistics steps that close the agreement |

Scrum boards and pool tables are **views over agreement fulfilment**, not a second backlog of unrelated chores.

---

## Departments

Operational homes (Sales, Purchasing, Stores, Production, Accounts, …).  
Each has a **work pool**. Employees belong to one primary department.

## Projects & milestones

Optional wrappers for larger fulfilment programmes (e.g. “Clear overdue SO backlog”).  
Milestones still point at jobs that close POs / orders.

## Jobs

Unit of fulfilment work: title, project, department, status, optional links to order / PO / shipment / GRN, assignee (after pull).

Statuses: `backlog` → `ready` → `in_progress` → `done` | `cancelled`  
(plus `blocked` when scrum flags a stopper)

## Work pool

Department queue of **ready** jobs waiting to be pulled at shift start / during shift.

## Time & attendance

Clock-in creates a session; clock-out closes it. Time cards roll sessions to a day.  
**Pull is only allowed while a session is open.**

## Daily scrum

Department stand-up: date, attendees, notes, WIP limit.  
Pull from pool during / after scrum still uses **role + department + clocked-in**, never skills.

---

## API sketch (demo)

| Method | Path | Notes |
|--------|------|--------|
| GET/POST | `/api/departments` | |
| GET/POST | `/api/employees` | includes `role`, `departmentId` — **no skills** |
| POST | `/api/sessions/clock-in` | opens shift; client may immediately GET pool |
| POST | `/api/sessions/clock-out` | |
| GET | `/api/projects`, `/api/jobs` | jobs carry order/PO links |
| GET | `/api/work-pool?departmentId=` | open entries for that dept |
| POST | `/api/work-pool/:id/pull` | requires clocked-in + role allow-list |
| GET/POST | `/api/scrums` | WIP limit only; no skill flags |

---

## Persistence (Spring) — workforce slice

| Table | Purpose |
|-------|---------|
| `departments` | Org units + optional WIP default |
| `employees` | `role`, `department_id`, active — **no skill FKs** |
| `employee_sessions` | Clock in/out |
| `time_cards` | Daily rollup |
| `projects` / `milestones` | Optional programme wrappers |
| `jobs` | Fulfilment work + `order_id` / `purchase_order_id` / … |
| `work_pool_entries` | Department pool; `allowed_roles` (text/json), no skills |
| `daily_scrums` | Stand-up + WIP limit |

**Do not create:** `skills`, `employee_skills`.
