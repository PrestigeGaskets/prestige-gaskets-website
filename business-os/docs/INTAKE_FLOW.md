# End-to-end intake flow

Baked-in intake (SO / GRN / ship OH) runs on **Post**, not on the stage buttons.
See also [ACTION_REPOSITORY.md](ACTION_REPOSITORY.md).

## Sales intake (confirmed quote → Sales Order ready to print)

1. **Edit tables** (Edit mode + Sales/Manager/Admin): update Customer, Quote, and QuoteLines
   on the working copy. Inventory, POs, and Despatch are owned by Inventory / Purchasing /
   Shipping (not Sales).
2. **Quote life**: quotes are live for **14 days** from `quotedDate` (`validDays`); line
   **price may change** while status is Open / Sent / Confirmed.
3. **Confirm**: Quotes → **Confirm quote** → status `Confirmed` (Sales sets collect vs ship
   via `shipMethod` + optional white-label `via` procurement provider).
4. **Accept confirmed quote**: **Accept confirmed → SO** (stages). Expired quotes cannot convert.
5. **Toolbar Post**: generates `Order.orderNo` = Sales Order number (`SO-…`) with
   `readyToPrint = true`, copies fulfilment (`shipMethod` / `via` / payment), and writes
   the daily action repository for the active Role.
6. **Linked updates** (on Post):
   - `Quote.status` → `Won`
   - new `Order` + `OrderLine` rows (copy from quote lines)
   - `Order.quoteNo` = `Quote.quoteNo` (1:1)
   - draft `Invoice` with `Invoice.orderNo` = Sales Order number

CLI: `edit` then `accept-quote Q-101` then `post`

## Purchase intake (PO → GRN number)

1. **Edit tables** (Purchasing): PurchaseOrder / PoLines.
2. **Goods received**: Receipt Entry → **Receive remaining → GRN** (stages).
3. **Toolbar Post**: generates `GoodsReceipt.grnNo` = GRN number (`GRN-…`) + action repo row.
4. **Linked updates** (on Post):
   - `GoodsReceipt.poNo` → PurchaseOrder
   - `GrnLine.sku` → Product; `Product.onHand` += qty received
   - PO `status` → `Closed` when fully received

CLI: `edit` then `receive-po 70286` then `post`

## Shipment / delivery note intake

1. Shipment Entry → **Issue DN** (working-copy delivery note) and/or detail **Post** (stages).
2. Toolbar **Post** issues on-hand, marks shipment Posted, and records DN number (`DN-…`).
3. **Unpost DN**: **Unpost DN** (or tick Reversal Entry then Post) stages `unpost-shipment`;
   toolbar **Post** restores OH and reopens the shipment. Toolbar **Undo** also restores the
   pre-mutate working-copy snapshot while the Post mutate is still on the undo stack.

CLI: `edit` then `post-shipment 275525` then `post`  
CLI unpost: `edit` then `unpost-shipment 275525` then `post`

## Linking keys map

| Document | Primary key | Links |
|---|---|---|
| Quote | `quoteNo` | Customer via `customerId`; white-label via `via` |
| Sales Order | `orderNo` (SO) | Quote via `quoteNo`; Invoice via `orderNo`; lines via `orderNo`; fulfilment via `shipMethod` / `via` |
| Purchase Order | `poNo` | Supplier via `supplierId`; lines via `poNo` |
| GRN | `grnNo` | PO via `poNo`; Product OH via `GrnLine.sku` |
| Shipment / DN | `shipmentId` / `deliveryNoteNo` | Lines → `orderNo` / `sku`; Post → OH; Unpost → restore OH |

GUI: **End-to-end Intake Map** view (Tools / Production → Receipt Management).
