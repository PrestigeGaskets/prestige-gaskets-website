#include "ProductCatalog.h"

#include <algorithm>

namespace bos {

ProductCatalog::ProductCatalog(IDataStore& store) : store_(store) { reload(); }

void ProductCatalog::reload() { products_ = store_.loadProducts(); }

const std::vector<Product>& ProductCatalog::all() const { return products_; }

std::vector<Product>& ProductCatalog::mutableAll() { return products_; }

std::optional<Product> ProductCatalog::findBySku(const std::string& sku) const {
    const auto it = std::find_if(products_.begin(), products_.end(),
                                 [&](const Product& p) { return p.sku == sku; });
    if (it == products_.end()) {
        return std::nullopt;
    }
    return *it;
}

}  // namespace bos
