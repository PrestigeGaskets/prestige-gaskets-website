#include "QuoteService.h"

#include <iomanip>
#include <iostream>

namespace bos {

QuoteService::QuoteService(IQuoteRepository& quotes) : quotes_(quotes) {}

std::map<std::string, double> QuoteService::totalsByQuote() const {
    std::map<std::string, double> totals;
    for (const auto& quote : quotes_.all()) {
        double sum = 0.0;
        for (const auto& line : quote.lines) {
            sum += line.lineTotal();
        }
        totals[quote.quoteNo] = sum;
    }
    return totals;
}

double QuoteService::grandTotal() const {
    double grand = 0.0;
    for (const auto& [_, total] : totalsByQuote()) {
        grand += total;
    }
    return grand;
}

void QuoteService::printTotals() const {
    std::cout << "--- QUOTE TOTALS ---\n";
    std::cout << std::fixed << std::setprecision(2);
    for (const auto& [qno, total] : totalsByQuote()) {
        std::cout << "  " << qno << " = " << total << '\n';
    }
    std::cout << "  grand = " << grandTotal() << "\n\n";
}

}  // namespace bos
