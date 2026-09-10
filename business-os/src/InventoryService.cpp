#include "InventoryService.h"

#include <iostream>

namespace bos {

InventoryService::InventoryService(ProductCatalog& catalog) : catalog_(catalog) {}

bool InventoryService::needsReorder(const Product& p) {
    return p.onHand <= p.reorderPoint;
}

void InventoryService::refreshReorderFlags() {
    for (auto& product : catalog_.mutableAll()) {
        product.reorderFlag = needsReorder(product);
    }
}

void InventoryService::printInventory() const {
    std::cout << "--- PRODUCTS / INVENTORY ---\n";
    for (const auto& p : catalog_.all()) {
        const bool flag = needsReorder(p);
        std::cout << "  " << p.sku << " " << p.description
                  << " OH=" << p.onHand << " ROP=" << p.reorderPoint
                  << " lead=" << p.leadDays
                  << " cost=" << p.cost << " sell=" << p.sell
                  << " flag=" << (flag ? "REORDER" : "ok") << '\n';
    }
    std::cout << '\n';
}

}  // namespace bos
