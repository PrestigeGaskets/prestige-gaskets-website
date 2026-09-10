#pragma once

#include <optional>
#include <string>
#include <vector>

#include "IDataStore.h"
#include "Product.h"

namespace bos {

class ProductCatalog {
public:
    explicit ProductCatalog(IDataStore& store);

    void reload();
    const std::vector<Product>& all() const;
    std::vector<Product>& mutableAll();
    std::optional<Product> findBySku(const std::string& sku) const;

private:
    IDataStore& store_;
    std::vector<Product> products_;
};

}  // namespace bos
