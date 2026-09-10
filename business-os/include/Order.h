#pragma once

#include <string>
#include <vector>

#include "OrderLine.h"

namespace bos {

struct Order {
    std::string orderNo;     // PK
    std::string quoteNo;     // optional FK → Quote.quoteNo (at most one Order per Quote → 1:1 conversion)
    std::string customerId;  // FK → Customer.id (N:1)
    std::string status;
    double value = 0.0;
    std::vector<OrderLine> lines;  // 1:N Order → OrderLine; association for Order↔Product M:N
};

}  // namespace bos
