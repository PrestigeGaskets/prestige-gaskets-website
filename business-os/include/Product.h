#pragma once

#include <string>

namespace bos {

struct Product {
    std::string sku;          // e.g. P1002
    std::string description;
    std::string category;
    double cost = 0.0;        // workbook col ~cost
    double sell = 0.0;        // workbook col ~sell
    int onHand = 0;           // OH
    int reorderPoint = 0;     // ROP
    int leadDays = 0;         // lead
    bool reorderFlag = false; // Products!Z formula equivalent
};

}  // namespace bos
