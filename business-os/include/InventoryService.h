#pragma once

#include "Product.h"
#include "ProductCatalog.h"

namespace bos {

class InventoryService {
public:
    explicit InventoryService(ProductCatalog& catalog);

    // Mirrors Products!Z reorder flag formula (OH vs ROP).
    void refreshReorderFlags();
    void printInventory() const;

private:
    ProductCatalog& catalog_;
    static bool needsReorder(const Product& p);
};

}  // namespace bos
