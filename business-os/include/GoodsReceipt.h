#pragma once

#include <string>
#include <vector>

namespace bos {

/// One received line against a PO line — links GRN → PO → Product.
struct GrnLine {
    std::string grnNo;  // FK → GoodsReceipt.grnNo
    int line = 0;
    std::string poNo;   // FK → PurchaseOrder.poNo
    int poLine = 0;     // FK → PoLine.line
    std::string sku;    // FK → Product.sku
    double qtyOrdered = 0.0;
    double qtyReceived = 0.0;
};

/// Goods Received Note (GRN) — generated when supplier goods are booked in.
/// End-to-end purchase intake key: GRN.poNo → PurchaseOrder → PoLine → Product.onHand.
struct GoodsReceipt {
    std::string grnNo;         // PK e.g. GRN-1001
    std::string poNo;          // FK → PurchaseOrder.poNo
    std::string supplierId;    // denormalised from PO
    std::string receivedDate;  // en-GB
    std::string receivedBy;
    std::string status;        // Draft | Posted
    std::string notes;
    std::vector<GrnLine> lines;
};

}  // namespace bos
