# End-to-end intake flow

## Sales intake (customer quote → Sales Order number)

1. **Edit tables** (Edit mode + Sales/Manager/Admin): update Customer, Quote, QuoteLines on the working copy.
2. **Quote received / accepted**: Quotes → **Accept quote → Sales Order**.
3. **Generated key**: `Order.orderNo` = Sales Order number (`SO-…`).
4. **Linked updates**:
   - `Quote.status` → `Won`
   - new `Order` + `OrderLine` rows (copy from quote lines)
   - `Order.quoteNo` = `Quote.quoteNo` (1:1)
   - draft `Invoice` with `Invoice.orderNo` = Sales Order number

CLI: `edit` then `accept-quote Q-101`

## Purchase intake (PO → GRN number)

1. **Edit tables** (Purchasing): PurchaseOrder / PoLines (PO Entry).
2. **Goods received**: Receipt Entry → **Receive remaining → GRN**.
3. **Generated key**: `GoodsReceipt.grnNo` = GRN number (`GRN-…`).
4. **Linked updates**:
   - `GoodsReceipt.poNo` → PurchaseOrder
   - `GrnLine.sku` → Product; `Product.onHand` += qty received
   - PO `status` → `Closed` when fully received

CLI: `edit` then `receive-po 70286`

## Linking keys map

| Document | Primary key | Links |
|---|---|---|
| Quote | `quoteNo` | Customer via `customerId` |
| Sales Order | `orderNo` (SO) | Quote via `quoteNo`; Invoice via `orderNo`; lines via `orderNo` |
| Purchase Order | `poNo` | Supplier via `supplierId`; lines via `poNo` |
| GRN | `grnNo` | PO via `poNo`; Product OH via `GrnLine.sku` |

GUI: **End-to-end Intake Map** view (Tools / Production → Receipt Management).
