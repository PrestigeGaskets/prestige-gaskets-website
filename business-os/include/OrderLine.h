#pragma once

#include <string>

namespace bos {

/// Order line — 1:N child of Order; association entity for Order↔Product M:N.
struct OrderLine {
    std::string orderNo;  // FK → Order.orderNo
    int line = 0;         // composite key with orderNo
    std::string sku;      // FK → Product.sku
    double qty = 0.0;
    double price = 0.0;

    double lineTotal() const { return qty * price; }
};

}  // namespace bos
