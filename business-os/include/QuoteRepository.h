#pragma once

#include <optional>
#include <string>
#include <vector>

#include "IDataStore.h"
#include "Quote.h"

namespace bos {

class QuoteRepository {
public:
    explicit QuoteRepository(IDataStore& store);

    void reload();
    const std::vector<Quote>& all() const;
    std::optional<Quote> findByNo(const std::string& quoteNo) const;

private:
    IDataStore& store_;
    std::vector<Quote> quotes_;
};

}  // namespace bos
