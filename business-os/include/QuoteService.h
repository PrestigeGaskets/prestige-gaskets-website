#pragma once

#include <map>
#include <string>

#include "IRepositories.h"
#include "IServices.h"

namespace bos {

class QuoteService : public IQuoteService {
public:
    explicit QuoteService(IQuoteRepository& quotes);

    std::map<std::string, double> totalsByQuote() const override;
    double grandTotal() const override;
    void printTotals() const override;

private:
    IQuoteRepository& quotes_;
};

}  // namespace bos
