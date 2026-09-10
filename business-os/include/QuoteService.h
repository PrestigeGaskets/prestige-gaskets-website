#pragma once

#include <map>
#include <string>

#include "QuoteRepository.h"

namespace bos {

class QuoteService {
public:
    explicit QuoteService(QuoteRepository& quotes);

    // Same aggregation as _verify_aec5.py QUOTE TOTALS.
    std::map<std::string, double> totalsByQuote() const;
    double grandTotal() const;
    void printTotals() const;

private:
    QuoteRepository& quotes_;
};

}  // namespace bos
