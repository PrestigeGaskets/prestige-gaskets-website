# SMB Business OS — C++ `.h` / `.cpp` Solution Plan

Target: **standalone Windows GUI `.exe`** (`BusinessOS.exe`) that mirrors the
`SMB-Operating-System.xlsx` workbook verified by `_verify_aec5.py`.

**GUI look-and-feel preview (for now):** `gui-demo/index.html` — same seed data,
same views (`dashboard` / `quotes` / `products` / `customers` / `orders`), same
service math as the C++ scaffold. The native app should track this visual
language (Rushmore brand, teal ink, blueprint atmosphere, Syne/Outfit).

## Why interfaces were thin at first (and what changed)

Early scaffold work prioritized a **runnable demo** (console + HTML twin) and
workbook parity. Only `IDataStore` was abstract so Excel could swap in later.
Repositories, services, roles, UI, and commands were concrete types wired
directly inside `Application` — fast to ship, but weak on encapsulation and
polymorphism.

That is now corrected. Abstract contracts live under `include/I*.h`. Concrete
classes **inherit** those interfaces; `Application` is a composition root that
owns concretes behind `std::unique_ptr<I…>` and never lets services depend on
sibling concretes.

| Abstract contract | Concrete implementation(s) |
|---|---|
| `IDataStore` | `InMemoryStore`, `MasterStore`, `WorkingCopyStore`, `ExcelStore` (stub) |
| `ICustomerRepository` / `IProductCatalog` / `IQuoteRepository` / `IOrderRepository` | `CustomerRepository`, `ProductCatalog`, `QuoteRepository`, `OrderRepository` |
| `IQuoteService` / `IInventoryService` / `IDashboardService` | `QuoteService`, `InventoryService`, `DashboardService` |
| `IRolePolicy` | `RoleHierarchy` |
| `IWorkspaceSession` | `WorkspaceSession` (owns sealed master + working copy) |
| `ICommand` / `ICommandInvoker` | `SnapshotCommand` / `CommandInvoker` |
| `IUserInterface` | `ConsoleUi` (future: Win32/Qt shell) |

**Encapsulation:** master data is sealed inside `MasterStore`; user mutations go
only through `WorkingCopyStore` mutators invoked via `IWorkspaceSession::runMutation`
(Command pattern with undo/redo). Role checks go through `IRolePolicy`, not
scattered `if (role == …)` in UI code.

**Polymorphism:** swap `ConsoleUi` → native GUI without touching services; swap
`InMemoryStore` / working session → `ExcelStore` without touching repositories.

## Workbook → class map

| Excel sheet / table | C++ type | Role |
|---|---|---|
| `Customers` | `Customer` + `ICustomerRepository` | Customer master data |
| `Products` | `Product` + `IProductCatalog` | SKU, cost/sell, OH / ROP / lead |
| `Quotes` | `Quote` + `IQuoteRepository` | Quote header (customer, value) |
| `QuoteLines` | `QuoteLine` + `IQuoteService` | Line qty × price → quote totals |
| `Orders` / `tblOrders` | `Order` + `IOrderRepository` | Confirmed orders |
| `Dashboard` | `DashboardSnapshot` + `IDashboardService` | KPI roll-up (A/B cells) |
| `Lists` (hidden) | `ListCatalog` | Lookup / validation lists |
| Workbook file | `IDataStore` | Persistence boundary |

## Launch path (exe)

```
main()
  └─ Application::run()          // composition root
       ├─ WorkspaceSession       // : IWorkspaceSession (Master + WorkingCopy)
       ├─ RoleHierarchy          // : IRolePolicy
       ├─ *Repository / Catalog  // : I*Repository
       ├─ *Service               // : I*Service  (depend on I*Repository only)
       └─ ConsoleUi              // : IUserInterface
            └─ polymorphic view calls → services
```

`BusinessOS.sln` → `BusinessOS.vcxproj` → **Release|x64** → `BusinessOS.exe`.

## Class interactions

```
                         ┌─────────────┐
                         │    main     │
                         └──────┬──────┘
                                │ owns
                         ┌──────▼──────┐
                         │ Application │  composition root
                         └──┬───┬───┬──┘
           unique_ptr<I…>   │   │   │
     ┌──────────────────────┘   │   └──────────────────────┐
     ▼                          ▼                          ▼
┌─────────────┐          ┌─────────────┐            ┌─────────────┐
│IUserInterface│         │IRolePolicy  │            │IWorkspace   │
│ ConsoleUi   │          │RoleHierarchy│            │  Session    │
└──────┬──────┘          └─────────────┘            └──────┬──────┘
       │ uses I*Service                                     │
       ▼                                                    ▼
┌──────────────┐  uses   ┌────────────────┐         ┌──────────────┐
│IDashboardSvc │────────▶│ICustomerRepo   │         │ MasterStore  │
│IQuoteService │         │IProductCatalog │         │WorkingCopy   │
│IInventorySvc │         │IQuoteRepo      │         │ : IDataStore │
└──────────────┘         │IOrderRepo      │         └──────────────┘
                         └───────┬────────┘
                                 │ : IDataStore
                         ┌───────▼────────┐
                         │ ICommand /     │
                         │ SnapshotCommand│
                         └────────────────┘
```

### Collaboration rules

1. **Repositories** own CRUD and identity lookup. No business math.
2. **QuoteService** owns `qty * price` line totals and quote/grand totals.
3. **InventoryService** owns reorder flags (`OH` vs `ROP`).
4. **DashboardService** only aggregates; it never mutates master data.
5. **Application** is the only composition root; services stay UI-free and
   depend on **interfaces**, not concrete siblings.
6. **IDataStore** isolates persistence; **IWorkspaceSession** isolates
   master/working-copy + edit/post/undo.
7. **ICommand** units every working-copy mutation for undo/redo.

## Master table relationships

| Cardinality | From → To | Via |
|---|---|---|
| **1:1** | Customer ↔ CustomerAccount | `CustomerAccount.customerId` (unique) |
| **1:1** | Order ↔ Invoice | `Invoice.orderNo` (unique) |
| **1:1** | Quote ↔ Order (optional) | `Order.quoteNo` unique when set |
| **1:N** | Customer → Quote / Order | `customerId` |
| **1:N** | Quote → QuoteLine | `Quote.lines` |
| **1:N** | Order → OrderLine | `Order.lines` |
| **1:N** | Supplier → PurchaseOrder | `PurchaseOrder.supplierId` |
| **1:N** | PurchaseOrder → PoLine / Memo / Attachment | nested children |
| **M:N** | Product ↔ Tag | `ProductTag` junction |
| **M:N** | Product ↔ Supplier | `ProductSupplier` junction |
| **M:N** | Quote ↔ Product | `QuoteLine` association |
| **M:N** | Order ↔ Product | `OrderLine` association |
| **M:N** | PurchaseOrder ↔ Product | `PoLine` association |

GUI: M1-style **Purchasing Management** hub (Entry / Reports / Maintenance /
Business Analysis) plus **PO Entry** form mapped to the ERP template panels.


## Suggested build / next increments

1. **Now:** polymorphic C++ scaffold + console smoke + HTML GUI demo.
2. **Next:** native GUI shell implementing `IUserInterface`.
3. **Then:** real Excel loader (`ExcelStore`).
4. **Then:** fuller mutation command set + Lists DV.

## Solution layout

```
business-os/
  BusinessOS.sln
  BusinessOS/
    BusinessOS.vcxproj
    main.cpp
  include/          // I*.h contracts + concrete headers
  src/              // implementations
  docs/CLASS_INTERACTION_PLAN.md
  CMakeLists.txt
```
