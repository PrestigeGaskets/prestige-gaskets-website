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

/// Junction table Supplier ↔ Product (many-to-many alternate supply path).
struct Supplier {
    std::string id;  // PK e.g. S-01
    std::string name;
    std::string postcode;
};

struct ProductSupplier {
    std::string sku;         // FK → Product.sku
    std::string supplierId;  // FK → Supplier.id
    int leadDays = 0;        // supplier-specific lead
    double unitCost = 0.0;
};

/// Documented edge in the master relationship graph.
struct RelationEdge {
    std::string cardinality;  // "1:1" | "1:N" | "M:N"
    std::string fromTable;
    std::string toTable;
    std::string via;  // FK field or junction table
    std::string note;
};

}  // namespace bos
