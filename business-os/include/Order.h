#pragma once

#include <string>
#include <vector>

#include "OrderLine.h"

namespace bos {

/// Sales Order — orderNo is the Sales Order number that links Quote (via quoteNo),
/// OrderLines, and Invoice across the sales intake chain.
struct Order {
    std::string orderNo;     // PK / Sales Order number e.g. SO-502 (legacy seed O-500)
    std::string quoteNo;     // optional FK → Quote.quoteNo (1:1 when set — quote received → SO)
    std::string customerId;  // FK → Customer.id (N:1)
    std::string status;      // Open | Picked | Shipped | Closed
    bool readyToPrint = false;
    std::string shipMethod;      // CARRIER | COLLECT | COURIER — Sales confirms collect vs ship
    std::string via;             // white-label procurement / agent provider id
    std::string shipPaymentType; // PREPAID | COLLECT | THIRD PARTY
    double value = 0.0;
    std::vector<OrderLine> lines;  // 1:N Order → OrderLine; M:N Order↔Product
};

}  // namespace bos
