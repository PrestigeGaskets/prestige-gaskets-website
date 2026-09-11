# Persistence data model (amended)

Authoritative tables for a Spring (or similar) backend.  
Workforce slice: **role decides capability**; **no** `skills` / `employee_skills`.

## ERP master (working copy until Post)

| Table | Notes |
|-------|--------|
| `customers` | |
| `accounts` | |
| `products` | |
| `suppliers` | |
| `quotes` / `quote_lines` | |
| `orders` / `order_lines` | Customer sales agreements |
| `invoices` / `invoice_lines` | |
| `purchase_orders` / `po_lines` | Supplier agreements that supply demand |
| `grns` / `grn_lines` | |
| `shipments` / `shipment_lines` | |

## Post / action ledger

| Table | Notes |
|-------|--------|
| `action_entries` | Posted daily actions by actor (role) + business day |
| `pending_actions` | Staged until toolbar Post |
| `posted_snapshots` | Working-copy journal after Post |

## Workforce · pool · scrum (PO fulfilment)

| Table | Notes |
|-------|--------|
| `departments` | Org units; optional default WIP |
| `employees` | `role`, `department_id`, active — **capability = role** |
| `employee_sessions` | Clock in / out (shift) |
| `time_cards` / `time_card_entries` | Daily rollup + booked hours |
| `projects` / `milestones` | Optional fulfilment programmes |
| `jobs` | Fulfilment unit; FK to order / PO / quote / shipment / GRN; `allowed_roles` |
| `work_pool_entries` | Department pool; pulled on shift start when role matches |
| `daily_scrums` | Stand-up + WIP limit |

### Explicitly removed

- `skills`
- `employee_skills`
- Job `required_skills`
- Scrum `pull_requires_skills`

## Pull contract

On clock-in, employee loads `work_pool_entries` for their department where status is open and `allowed_roles` contains their role (or list is empty). All jobs exist to **fulfil purchase-order / sales agreements** via agile scrum, not a free-floating task list.
