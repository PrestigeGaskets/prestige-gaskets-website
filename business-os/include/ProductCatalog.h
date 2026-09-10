#pragma once

#include <optional>
#include <string>
#include <vector>

#include "IDataStore.h"
#include "IRepositories.h"
#include "Product.h"

namespace bos {

class ProductCatalog : public IProductCatalog {
public:
    explicit ProductCatalog(IDataStore& store);

    void reload() override;
    const std::vector<Product>& all() const override;
    std::vector<Product>& mutableAll() override;
    std::optional<Product> findBySku(const std::string& sku) const override;

private:
    IDataStore& store_;
    std::vector<Product> products_;
};

}  // namespace bos
