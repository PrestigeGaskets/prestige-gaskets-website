#include "ListCatalog.h"

namespace bos {

const std::vector<std::string> ListCatalog::kEmpty_{};

ListCatalog::ListCatalog(IDataStore& store) : store_(store) { reload(); }

void ListCatalog::reload() {
    lists_.clear();
    for (const auto& name : {"QuoteStatus", "OrderStatus", "CustomerStatus"}) {
        lists_[name] = store_.loadList(name);
    }
}

const std::vector<std::string>& ListCatalog::values(const std::string& listName) const {
    const auto it = lists_.find(listName);
    if (it == lists_.end()) {
        return kEmpty_;
    }
    return it->second;
}

}  // namespace bos
