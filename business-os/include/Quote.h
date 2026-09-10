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
    std::string status;       // Open | Sent | Confirmed | Won | Lost
    std::string quotedDate;   // en-GB — start of validity window
    int validDays = 14;       // quotes live this many days; price may change while live
    std::string shipMethod;   // CARRIER | COLLECT | COURIER
    std::string via;          // white-label procurement provider id (empty when COLLECT)
    double value = 0.0;       // header value (Quotes!G)
    std::vector<QuoteLine> lines;
};

}  // namespace bos
