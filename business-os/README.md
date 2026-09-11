# Business OS (C++ + GUI demo)

Standalone **Business OS** aimed at a slick desktop GUI `.exe`, rooted in the
`SMB-Operating-System.xlsx` domain verified by `_verify_aec5.py`.

## GUI preview (HTML twin of the C++ app)

Open the visual stand-in that mirrors `Application` / services:

```bash
# from this folder
python3 -m http.server 8765 --directory gui-demo
# → http://127.0.0.1:8765/
```

Or open `gui-demo/index.html` directly. The home hub is a **role-aware tile dashboard** (master tables + “Your role” actions + classic M1 panels). Badges reflect the role matrix (view / edit / add). Orders, Despatch, PO and other workspace views share the same dark stage theme; **More** (My Shortcuts) stays on the light rail. The classic M1-style
**Sales Order / Purchasing Management** layout (Entry / Reports / Maintenance /
M1 Business Analysis / Custom Reports). Hub and module-tree links are **live only**
(no toast placeholders).

**Contact Management** (Sales-owned customers) links quotes, orders, shipments, and
AR invoices. Follow-ups / calls open on **Shipment Entry**. Choosing a shipment
customer fills AR/shipping contact from the customer email.

**Sales** has Finance-equivalent cost/order fields plus PO accuracy/lookups.
**Confirm** a live quote (14-day window) → Accept → Post creates a ready-to-print
SO with collect / ship **via** white-label providers. **Shipping** can Issue DN,
Post (OH out), and **Unpost DN** (OH restore).

Open **Shipment Entry** (`275525` draft / `275526` with lines from `O-500`) —
ribbon actions, Requirements pane, **Add From Order** (despatch lookup by sales
acknowledgement No → order stats + role-gated editable fields), and detail **Post**
(stages until toolbar **Post** issues OH).

Open **PO Entry** for order `70286` / supplier `CITY0002`.

**End-to-end intake** (see [docs/INTAKE_FLOW.md](docs/INTAKE_FLOW.md) and
[docs/ACTION_REPOSITORY.md](docs/ACTION_REPOSITORY.md)):

- **Accept quote** / **Receive PO** / ship detail **Post** / **Unpost DN** **stage**
  until toolbar **Post**.
- Toolbar **Post** runs through polymorphic `PostCommitService` (SO / GRN / OH /
  unpost) and writes a **daily action repository** for the active Role
  (backend/report lookup — no Activity UI).
- Turn **Edit** on; role-gated fields update the working copy (master stays sealed).

Other views: Quotes, Products, Contact Management, AR Invoices, Sales Orders,
Receipt Entry, Intake Map, Relations, Fields.

Defaults: **GBP** currency (`en-GB`) and UK **postcode** on customers.
Edits are role-gated and write to a working copy only (master stays sealed).

The dashboard mirrors M1 chrome: **My Shortcuts** rail, module tree with
All/Sales/Production/Financial filters, and hub panels
Entry Screens · Reports · Maintenance | M1 Business Analysis · Custom Reports.

**Workforce / projects (server-backed):** session identity, My Workload (assigned
jobs + department pool pull by **role** after clock-in), time cards, and
Projects & Daily Scrum — all aimed at **PO / sales-order fulfilment**. No skills
matrix. Spring Boot API lives in [`server/`](server/) — see [docs/API.md](docs/API.md),
[docs/WORKFORCE_PROJECTS.md](docs/WORKFORCE_PROJECTS.md) and
[docs/DATA_MODEL.md](docs/DATA_MODEL.md).

**Mobile (≤960px):** same M1 content in drawers — Modules (☰) and My Shortcuts (⚡) —
plus a bottom dock (Hub / Orders / **Despatch** / PO / More). On Despatch, phone
layout collapses the ribbon/toolbar button walls, shows shipment lines as cards,
keeps **Add From Order** + **Post DN** in a sticky bar, and opens Add From Order
as a full-screen sheet. Desktop layout unchanged.
**Sales** (with **Edit** on) has Finance-equivalent product cost/sell rights, PO
accuracy/lookup fields, quote confirm (14-day live window) → SO ready-to-print, and
collect/ship **via** white-label procurement providers. **Shipping** issues delivery
notes with Post / Unpost DN (OH out / restore). See the Fields view for the full
permission network.

## Build the `.exe` (Visual Studio)

1. Open `BusinessOS.sln`
2. Select **Release | x64**
3. Build → output: `bin/Release/BusinessOS.exe`

## Build (CMake, optional)

```bash
cmake -S . -B build
cmake --build build
printf 'quit\n' | ./build/BusinessOS
```

## Class plan

See [docs/CLASS_INTERACTION_PLAN.md](docs/CLASS_INTERACTION_PLAN.md).

Abstract ports (`IDataStore`, `I*Repository`, `I*Service`, `IRolePolicy`,
`IWorkspaceSession`, `ICommand`, `IUserInterface`) sit behind concrete
implementations. `Application` is the composition root — swap `ConsoleUi` or
the store without rewriting services.
