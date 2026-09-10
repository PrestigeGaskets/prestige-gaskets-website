#include "QuoteRepository.h"

#include <algorithm>

namespace bos {

QuoteRepository::QuoteRepository(IDataStore& store) : store_(store) { reload(); }

void QuoteRepository::reload() { quotes_ = store_.loadQuotes(); }

const std::vector<Quote>& QuoteRepository::all() const { return quotes_; }

std::optional<Quote> QuoteRepository::findByNo(const std::string& quoteNo) const {
    const auto it = std::find_if(quotes_.begin(), quotes_.end(),
                                 [&](const Quote& q) { return q.quoteNo == quoteNo; });
    if (it == quotes_.end()) {
        return std::nullopt;
    }
    return *it;
}

}  // namespace bos
