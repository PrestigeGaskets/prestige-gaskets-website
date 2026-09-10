#pragma once

#include <string>

namespace bos {

/// Value type for staged/posted operational actions (backend report lookup).
struct ActionEntry {
    std::string id;
    std::string day;       // YYYY-MM-DD (local business day)
    std::string actor;     // role name (Sales, Purchasing, …)
    std::string type;      // accept-quote | receive-po | post-shipment | unpost-shipment | working-copy-edits
    std::string status;    // staged | posted | failed
    std::string stagedAt;  // ISO-8601
    std::string postedAt;  // ISO-8601 when posted

    // Lookup fields for reports / joins
    std::string quoteNo;
    std::string orderNo;
    std::string poNo;
    std::string grnNo;
    std::string shipmentId;
    std::string customerId;
    std::string detail;  // human / JSON summary
};

}  // namespace bos
