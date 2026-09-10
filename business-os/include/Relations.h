#pragma once

#include <string>

namespace bos {

/// Tag master — many products can share a tag; a product can have many tags (M:N).
struct Tag {
    std::string id;    // PK e.g. T-SEAL
    std::string name;  // e.g. Sealing
};

/// Junction table Product ↔ Tag (many-to-many).
struct ProductTag {
    std::string sku;    // FK → Product.sku
    std::string tagId;  // FK → Tag.id
};

/// Supplier master (vendor) — 1:N PurchaseOrders; M:N Products via ProductSupplier.
struct Supplier {
    std::string id;  // PK e.g. CITY0002 / S-01
    std::string name;
    std::string postcode;
    std::string line1;
    std::string line2;
    std::string city;
    std::string phone;
    std::string fax;
};

struct ProductSupplier {
    std::string sku;         // FK → Product.sku
    std::string supplierId;  // FK → Supplier.id
    int leadDays = 0;
    double unitCost = 0.0;
};

/// Documented edge in the master relationship graph.
struct RelationEdge {
    std::string cardinality;  // "1:1" | "1:N" | "M:N"
    std::string fromTable;
    std::string toTable;
    std::string via;
    std::string note;
};

}  // namespace bos
