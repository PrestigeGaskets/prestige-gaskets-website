#pragma once

#include <string>

namespace bos {

struct Order {
    std::string orderNo;
    std::string quoteNo;     // optional origin
    std::string customerId;
    std::string status;
    double value = 0.0;
};

}  // namespace bos
