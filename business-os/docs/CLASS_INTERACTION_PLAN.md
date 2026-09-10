# SMB Business OS — C++ `.h` / `.cpp` Solution Plan

Target: **standalone Windows GUI `.exe`** (`BusinessOS.exe`) that mirrors the
`SMB-Operating-System.xlsx` workbook verified by `_verify_aec5.py`.

**GUI look-and-feel preview (for now):** `gui-demo/index.html` — same seed data,
same views (`dashboard` / `quotes` / `products` / `customers` / `orders`), same
service math as the C++ scaffold. The native app should track this visual
language (Rushmore brand, teal ink, blueprint atmosphere, Syne/Outfit).

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
       └─ GUI shell (HTML demo now; native window later)
            ├─ DashboardService::build()
            ├─ QuoteService::totalsByQuote()
            ├─ InventoryService::refreshReorderFlags()
            └─ CustomerRepository / OrderRepository queries
```

`BusinessOS.sln` → `BusinessOS.vcxproj` → **Release|x64** → `BusinessOS.exe`.

HTML stand-in: open `gui-demo/index.html` (or serve the folder) to demo the
associated UI that the `.exe` should eventually present.

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
5. **Application** is the only UI / process entry; services stay UI-free.
   Today: console CLI + `gui-demo` HTML twin. Next: native GUI (WinUI / Qt)
   matching the HTML chrome, rail nav, and view panels.
6. **IDataStore** isolates persistence. Scaffold uses `InMemoryStore`
   seeded with workbook-shaped demo rows (`C004`, `P1002`, sample quotes).

## Suggested build / next increments

1. **Now:** C++ class scaffold + console smoke path + **HTML GUI demo**
   (`gui-demo/`) that mimics Application views.
2. **Next:** native GUI shell in the `.exe` tracking the HTML look.
3. **Then:** real Excel loader (`ExcelStore`).
4. **Then:** mutate quotes/orders, write-back, Lists DV.

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
