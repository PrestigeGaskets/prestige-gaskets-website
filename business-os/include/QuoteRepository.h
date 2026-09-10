#pragma once

#include <optional>
#include <string>
#include <vector>

#include "IDataStore.h"
#include "IRepositories.h"
#include "Quote.h"

namespace bos {

class QuoteRepository : public IQuoteRepository {
public:
    explicit QuoteRepository(IDataStore& store);

    void reload() override;
    const std::vector<Quote>& all() const override;
    std::optional<Quote> findByNo(const std::string& quoteNo) const override;

private:
    IDataStore& store_;
    std::vector<Quote> quotes_;
};

}  // namespace bos
