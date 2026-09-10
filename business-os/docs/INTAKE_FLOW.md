# End-to-end intake flow

Baked-in intake (SO / GRN / ship OH) runs on **Post**, not on the stage buttons.
See also [ACTION_REPOSITORY.md](ACTION_REPOSITORY.md).

## Sales intake (customer quote → Sales Order number)

1. **Edit tables** (Edit mode + Sales/Manager/Admin): update Customer, Quote, QuoteLines on the working copy.
2. **Quote received / accepted**: Quotes → **Accept quote → Sales Order** (stages).
3. **Toolbar Post**: generates `Order.orderNo` = Sales Order number (`SO-…`) and writes the daily action repository for the active Role.
4. **Linked updates** (on Post):
   - `Quote.status` → `Won`
   - new `Order` + `OrderLine` rows (copy from quote lines)
   - `Order.quoteNo` = `Quote.quoteNo` (1:1)
   - draft `Invoice` with `Invoice.orderNo` = Sales Order number

CLI: `edit` then `accept-quote Q-101` then `post`

## Purchase intake (PO → GRN number)

1. **Edit tables** (Purchasing): PurchaseOrder / PoLines (PO Entry).
2. **Goods received**: Receipt Entry → **Receive remaining → GRN** (stages).
3. **Toolbar Post**: generates `GoodsReceipt.grnNo` = GRN number (`GRN-…`) + action repo row.
4. **Linked updates** (on Post):
   - `GoodsReceipt.poNo` → PurchaseOrder
   - `GrnLine.sku` → Product; `Product.onHand` += qty received
   - PO `status` → `Closed` when fully received

CLI: `edit` then `receive-po 70286` then `post`

## Shipment intake

1. Shipment Entry → **Post** on the detail panel (stages).
2. Toolbar **Post** issues on-hand and marks the shipment Posted.

CLI: `edit` then `post-shipment 275525` then `post`

## Linking keys map

| Document | Primary key | Links |
|---|---|---|
| Quote | `quoteNo` | Customer via `customerId` |
| Sales Order | `orderNo` (SO) | Quote via `quoteNo`; Invoice via `orderNo`; lines via `orderNo` |
| Purchase Order | `poNo` | Supplier via `supplierId`; lines via `poNo` |
| GRN | `grnNo` | PO via `poNo`; Product OH via `GrnLine.sku` |
| Shipment | `shipmentId` | Lines → `orderNo` / `sku`; Post → OH |

GUI: **End-to-end Intake Map** view (Tools / Production → Receipt Management).
