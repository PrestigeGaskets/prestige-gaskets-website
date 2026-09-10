# Business OS (C++ scaffold + GUI demo)

Standalone **Business OS** aimed at a slick desktop GUI `.exe`, rooted in the
`SMB-Operating-System.xlsx` domain verified by `_verify_aec5.py`.

## GUI preview (HTML twin of the C++ app)

Open the visual stand-in that mirrors `Application` / services:

```bash
# from this folder
python3 -m http.server 8765 --directory gui-demo
# → http://127.0.0.1:8765/
```

Or open `gui-demo/index.html` directly. The home hub follows an M1-style
**Purchasing Management** layout (Entry / Reports / Maintenance / Analysis).
Open **PO Entry** for order `70286` / supplier `CITY0002`.

Other views: Quotes, Products, Customers, Sales Orders, Relations, Fields.

Defaults: **GBP** currency (`en-GB`) and UK **postcode** on customers.
Edits are role-gated and write to a working copy only (master stays sealed).

The dashboard mirrors M1’s **Sales Order Management** chrome: **My Shortcuts**
rail, module tree with All/Sales/Production/Financial/My Folders filters, and
hub panels Entry Screens · Reports · Maintenance | M1 Business Analysis ·
Custom Reports · Close.
Sales can **add customers**; Finance can **add products/orders** and **define custom fields**.
See the Fields view for the full permission network.
Mobile layouts wrap field grids / entity cards / session chrome at ≤860px / ≤420px.

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
