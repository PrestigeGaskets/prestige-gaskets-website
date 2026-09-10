# Daily action repository (backend lookup)

Operational stage actions (`accept-quote`, `receive-po`, `post-shipment`,
`unpost-shipment`) and
field edits stay on the **working copy** until toolbar / CLI **Post**.

Post finalizes baked-in intake logic and appends rows to an in-memory **daily
action repository** keyed by **Role (actor)** and **business day**. There is
**no Activity / “My day” GUI** — the store is for backend processing and report
lookups only.

## GUI twin

| Storage key | Purpose |
|---|---|
| `rushmore-pending-v1` | Staged actions awaiting Post |
| `rushmore-action-repo-v1` | Posted action ledger (backend-shaped) |
| `rushmore-posted-v2` | Working-copy journal snapshot after Post |

## Entry shape (`ActionEntry`)

| Field | Use |
|---|---|
| `id` | Action id (`ACT-…`) |
| `day` | `YYYY-MM-DD` business day |
| `actor` | Active **Role** (Sales, Purchasing, Shipping, …) |
| `type` | `accept-quote` \| `receive-po` \| `post-shipment` \| `unpost-shipment` \| `working-copy-edits` |
| `status` | `staged` \| `posted` \| `failed` |
| `stagedAt` / `postedAt` | ISO-8601 |
| `quoteNo` | Lookup → Quote |
| `orderNo` | Lookup → Sales Order |
| `poNo` | Lookup → Purchase Order |
| `grnNo` | Lookup → Goods Receipt |
| `shipmentId` | Lookup → Shipment |
| `customerId` | Lookup → Customer |
| `detail` | Short summary for logs/reports |

## Flow

1. **Edit** tables as Role work (working copy).
2. **Stage**: Accept quote / Receive PO / Ship detail **Post** → pending only.
3. **Toolbar / CLI `post`**: run intake (SO / GRN / OH), write action repo for
   `actor` + `day`, clear pending, snapshot journal.

## CLI

```
edit
accept-quote Q-101
receive-po 70286
post-shipment 275525
unpost-shipment 275525
post
actions          # pending + today's posted for active role (debug; not a GUI)
```

C++: `IDailyActionRepository` / `DailyActionRepository` owned by Application
behind `unique_ptr<I…>`; staging + commit via polymorphic `IPostCommitService`
(`PostCommitService`) depending only on `IDailyActionRepository`, `IIntakeService`,
and `IWorkspaceSession`. Lookups: `lookupByOrderNo` / `lookupByQuoteNo` /
`lookupByPoNo` / `lookupByGrnNo` / `forActorDay`.

Intake mutators go through `IWorkingCopyMutations` (implemented by
`WorkingCopyStore`) so `IntakeService` never depends on a concrete store type.
