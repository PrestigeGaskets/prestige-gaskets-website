# SMB Business OS — C++ `.h` / `.cpp` Solution Plan

Target: **Windows console `.exe`** (`BusinessOS.exe`) that mirrors the
`SMB-Operating-System.xlsx` workbook verified by `_verify_aec5.py`.

## Workbook → class map

| Excel sheet / table | C++ type | Role |
|---|---|---|
| `Customers` | `Customer` + `CustomerRepository` | Customer master data |
| `Products` | `Product` + `ProductCatalog` | SKU, cost/sell, OH / ROP / lead |
| `Quotes` | `Quote` + `QuoteRepository` | Quote header (customer, value) |
| `QuoteLines` | `QuoteLine` + `QuoteService` | Line qty × price → quote totals |
| `Orders` / `tblOrders` | `Order` + `OrderRepository` | Confirmed orders |
| `Dashboard` | `DashboardSnapshot` + `DashboardService` | KPI roll-up (A/B cells) |
| `Lists` (hidden) | `ListCatalog` | Lookup / validation lists |
| Workbook file | `IDataStore` / `InMemoryStore` | Persistence boundary (Excel later) |

## Launch path (exe)

```
main()
  └─ Application::run()
       ├─ InMemoryStore::seedDemoData()     // mirrors verify script samples
       ├─ wire repositories + services
       └─ command loop
            ├─ DashboardService::build()
            ├─ QuoteService::printQuoteTotals()
            ├─ ProductCatalog::printInventory()
            └─ CustomerRepository / OrderRepository queries
```

`BusinessOS.sln` → `BusinessOS.vcxproj` → **Release|x64** → `BusinessOS.exe`.

## Class interactions

```
                    ┌─────────────┐
                    │    main     │
                    └──────┬──────┘
                           │ owns
                    ┌──────▼──────┐
                    │ Application │  (exe orchestrator / CLI)
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           │               │               │
   ┌───────▼──────┐ ┌──────▼──────┐ ┌──────▼────────┐
   │DashboardSvc  │ │ QuoteService│ │InventorySvc   │
   └───────┬──────┘ └──────┬──────┘ └──────┬────────┘
           │               │               │
     reads │         uses  │         uses  │
           │        ┌──────▼──────┐        │
           │        │QuoteRepo    │        │
           │        │QuoteLine[]  │        │
           │        └─────────────┘        │
           │                               │
   ┌───────▼──────────┐            ┌───────▼──────────┐
   │CustomerRepo      │            │ProductCatalog    │
   │OrderRepo         │            │ (OH/ROP/lead)    │
   └────────┬─────────┘            └────────┬─────────┘
            │                               │
            └──────────────┬────────────────┘
                           │ backed by
                    ┌──────▼──────┐
                    │ IDataStore  │
                    │InMemoryStore│  ← scaffold now
                    │(ExcelStore) │  ← later: openpyxl parity
                    └─────────────┘
```

### Collaboration rules

1. **Repositories** own CRUD and identity lookup. No business math.
2. **QuoteService** owns `qty * price` line totals and quote/grand totals
   (same logic as the verify script’s `QUOTE TOTALS`).
3. **InventoryService** owns reorder flags (`OH` vs `ROP`, lead time) —
   equivalent of Products column `Z` flag formulas.
4. **DashboardService** only aggregates; it never mutates master data.
5. **Application** is the only UI / process entry; services stay UI-free
   so a Win32 / ImGui front-end can replace the console later.
6. **IDataStore** isolates persistence. Scaffold uses `InMemoryStore`
   seeded with workbook-shaped demo rows (`C004`, `P1002`, sample quotes).

## Suggested build / next increments

1. **Now (this PR):** headers + stub `.cpp`, `main` prints dashboard /
   quote totals / product OH-ROP from seed data → proves exe path.
2. **Next:** real Excel loader (`ExcelStore` via libxlsx / COM / export CSV).
3. **Then:** mutate quotes/orders, write-back, replace hidden `Lists` DV.
4. **UI:** keep services; swap `Application` console for GUI.

## Solution layout

```
business-os/
  BusinessOS.sln
  BusinessOS/
    BusinessOS.vcxproj
    main.cpp
  include/          // public headers
  src/              // implementations
  docs/CLASS_INTERACTION_PLAN.md
  CMakeLists.txt    // optional cross-check build
```
