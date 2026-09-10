#pragma once

#include <string>
#include <vector>

namespace bos {

struct QuoteLine {
    std::string quoteNo;
    int line = 0;
    std::string sku;
    double qty = 0.0;
    double price = 0.0;
    std::string formula;  // Excel formula text if imported

    double lineTotal() const { return qty * price; }
};

struct Quote {
    std::string quoteNo;
    std::string customerId;
    std::string status;
    double value = 0.0;  // header value (Quotes!G)
    std::vector<QuoteLine> lines;
};

}  // namespace bos
