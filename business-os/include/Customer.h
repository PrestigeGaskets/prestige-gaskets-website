#pragma once

#include <string>

namespace bos {

struct Customer {
    std::string id;       // e.g. C004
    std::string name;
    std::string email;
    std::string postcode; // UK postcode (e.g. SW1A 1AA)
    std::string status;   // active / inactive (workbook col G/J style fields)
    std::string notes;
};

}  // namespace bos
