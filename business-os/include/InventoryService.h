#pragma once

#include "IRepositories.h"
#include "IServices.h"
#include "Product.h"

namespace bos {

class InventoryService : public IInventoryService {
public:
    explicit InventoryService(IProductCatalog& catalog);

    void refreshReorderFlags() override;
    void printInventory() const override;
    bool needsReorder(const Product& product) const override;

private:
    IProductCatalog& catalog_;
};

}  // namespace bos
